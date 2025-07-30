from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum, Count
from django.utils import timezone
from datetime import datetime, timedelta

from .models import Order, OrderItem, ShippingMethod, Payment
from .serializers import (
    OrderSerializer, OrderListSerializer, OrderCreateSerializer,
    OrderUpdateSerializer, OrderStatusUpdateSerializer, OrderFilterSerializer,
    OrderStatisticsSerializer, ShippingMethodSerializer, PaymentSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model"""
    queryset = Order.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'order_type', 'payment_status']
    search_fields = ['order_number', 'customer_name', 'customer_email']
    ordering_fields = ['created_at', 'total_amount', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter queryset based on user"""
        queryset = Order.objects.all()
        
        # If user is not admin, only show their orders
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        # Apply date filters
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__date__lte=date_to)
        
        # Apply amount filters
        min_amount = self.request.query_params.get('min_amount')
        max_amount = self.request.query_params.get('max_amount')
        
        if min_amount:
            queryset = queryset.filter(total_amount__gte=min_amount)
        if max_amount:
            queryset = queryset.filter(total_amount__lte=max_amount)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.update(order, serializer.validated_data)
            return Response(OrderSerializer(order).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get order statistics"""
        queryset = self.get_queryset()
        
        # Calculate statistics
        total_orders = queryset.count()
        total_revenue = queryset.aggregate(total=Sum('total_amount'))['total'] or 0
        average_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Status breakdown
        pending_orders = queryset.filter(status='pending').count()
        processing_orders = queryset.filter(status='processing').count()
        shipped_orders = queryset.filter(status='shipped').count()
        delivered_orders = queryset.filter(status='delivered').count()
        cancelled_orders = queryset.filter(status='cancelled').count()
        
        # Order type breakdown
        retail_orders = queryset.filter(order_type='retail').count()
        wholesale_orders = queryset.filter(order_type='wholesale').count()
        retail_revenue = queryset.filter(order_type='retail').aggregate(
            total=Sum('total_amount'))['total'] or 0
        wholesale_revenue = queryset.filter(order_type='wholesale').aggregate(
            total=Sum('total_amount'))['total'] or 0
        
        data = {
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'average_order_value': average_order_value,
            'pending_orders': pending_orders,
            'processing_orders': processing_orders,
            'shipped_orders': shipped_orders,
            'delivered_orders': delivered_orders,
            'cancelled_orders': cancelled_orders,
            'retail_orders': retail_orders,
            'wholesale_orders': wholesale_orders,
            'retail_revenue': retail_revenue,
            'wholesale_revenue': wholesale_revenue,
        }
        
        serializer = OrderStatisticsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent orders"""
        recent_orders = self.get_queryset()[:10]
        serializer = OrderListSerializer(recent_orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending orders"""
        pending_orders = self.get_queryset().filter(status='pending')
        serializer = OrderListSerializer(pending_orders, many=True)
        return Response(serializer.data)


class ShippingMethodViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ShippingMethod model"""
    queryset = ShippingMethod.objects.filter(is_active=True)
    serializer_class = ShippingMethodSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def for_order_type(self, request):
        """Get shipping methods for specific order type"""
        order_type = request.query_params.get('order_type', 'retail')
        
        if order_type == 'wholesale':
            shipping_methods = self.queryset.filter(is_wholesale_only=True)
        else:
            shipping_methods = self.queryset.filter(is_wholesale_only=False)
        
        serializer = self.get_serializer(shipping_methods, many=True)
        return Response(serializer.data)


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for Payment model"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter payments by order if specified"""
        queryset = Payment.objects.all()
        order_id = self.request.query_params.get('order')
        if order_id:
            queryset = queryset.filter(order_id=order_id)
        return queryset

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]
