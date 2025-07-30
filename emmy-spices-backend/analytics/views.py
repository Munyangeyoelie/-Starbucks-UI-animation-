from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import datetime, timedelta

from .models import SalesAnalytics, ProductAnalytics, UserAnalytics, WebsiteAnalytics, InventoryAnalytics
from .serializers import (
    SalesAnalyticsSerializer, ProductAnalyticsSerializer, UserAnalyticsSerializer,
    WebsiteAnalyticsSerializer, InventoryAnalyticsSerializer
)


class SalesAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for SalesAnalytics model"""
    queryset = SalesAnalytics.objects.all()
    serializer_class = SalesAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get sales summary for dashboard"""
        today = timezone.now().date()
        
        # Get today's analytics
        today_analytics, created = SalesAnalytics.objects.get_or_create(date=today)
        if created:
            today_analytics.calculate_daily_metrics()
        
        # Get last 30 days summary
        thirty_days_ago = today - timedelta(days=30)
        monthly_data = SalesAnalytics.objects.filter(
            date__gte=thirty_days_ago
        ).aggregate(
            total_revenue=Sum('total_revenue'),
            total_orders=Sum('total_orders'),
            avg_order_value=Avg('average_order_value')
        )
        
        # Get top products
        from products.models import Product
        top_products = Product.objects.annotate(
            total_sold=Count('orderitem')
        ).order_by('-total_sold')[:5]
        
        data = {
            'today': SalesAnalyticsSerializer(today_analytics).data,
            'monthly_summary': {
                'total_revenue': monthly_data['total_revenue'] or 0,
                'total_orders': monthly_data['total_orders'] or 0,
                'avg_order_value': monthly_data['avg_order_value'] or 0,
            },
            'top_products': [
                {
                    'id': product.id,
                    'name': product.name,
                    'total_sold': product.total_sold
                }
                for product in top_products
            ]
        }
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def trends(self, request):
        """Get sales trends"""
        days = int(request.query_params.get('days', 30))
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        analytics = SalesAnalytics.objects.filter(
            date__gte=start_date,
            date__lte=end_date
        ).order_by('date')
        
        serializer = self.get_serializer(analytics, many=True)
        return Response(serializer.data)


class ProductAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ProductAnalytics model"""
    queryset = ProductAnalytics.objects.all()
    serializer_class = ProductAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def top_sellers(self, request):
        """Get top selling products"""
        from products.models import Product
        
        top_products = Product.objects.annotate(
            total_sold=Count('orderitem')
        ).order_by('-total_sold')[:10]
        
        data = [
            {
                'id': product.id,
                'name': product.name,
                'total_sold': product.total_sold,
                'revenue': product.retail_price * product.total_sold,
                'rating': product.rating
            }
            for product in top_products
        ]
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock"""
        from products.models import Product
        
        low_stock_products = Product.objects.filter(stock__lt=50).order_by('stock')
        
        data = [
            {
                'id': product.id,
                'name': product.name,
                'stock': product.stock,
                'category': product.category.name
            }
            for product in low_stock_products
        ]
        
        return Response(data)


class UserAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for UserAnalytics model"""
    queryset = UserAnalytics.objects.all()
    serializer_class = UserAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def user_summary(self, request):
        """Get user analytics summary"""
        from django.contrib.auth.models import User
        from users.models import UserProfile
        
        # User type breakdown
        user_types = UserProfile.objects.values('user_type').annotate(
            count=Count('user_type')
        )
        
        # Recent registrations
        recent_users = User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Active users (logged in last 30 days)
        active_users = User.objects.filter(
            last_login__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        data = {
            'user_types': user_types,
            'recent_registrations': recent_users,
            'active_users': active_users,
            'total_users': User.objects.count()
        }
        
        return Response(data)


class WebsiteAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for WebsiteAnalytics model"""
    queryset = WebsiteAnalytics.objects.all()
    serializer_class = WebsiteAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get website analytics summary"""
        today = timezone.now().date()
        
        # Get today's analytics
        today_analytics, created = WebsiteAnalytics.objects.get_or_create(date=today)
        
        # Get last 7 days summary
        seven_days_ago = today - timedelta(days=7)
        weekly_data = WebsiteAnalytics.objects.filter(
            date__gte=seven_days_ago
        ).aggregate(
            total_visitors=Sum('total_visitors'),
            total_page_views=Sum('page_views'),
            avg_conversion_rate=Avg('conversion_rate')
        )
        
        data = {
            'today': WebsiteAnalyticsSerializer(today_analytics).data,
            'weekly_summary': {
                'total_visitors': weekly_data['total_visitors'] or 0,
                'total_page_views': weekly_data['total_page_views'] or 0,
                'avg_conversion_rate': weekly_data['avg_conversion_rate'] or 0,
            }
        }
        
        return Response(data)


class InventoryAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for InventoryAnalytics model"""
    queryset = InventoryAnalytics.objects.all()
    serializer_class = InventoryAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def alerts(self, request):
        """Get inventory alerts"""
        from products.models import Product
        
        # Low stock products
        low_stock_products = Product.objects.filter(stock__lt=50, stock__gt=0)
        
        # Out of stock products
        out_of_stock_products = Product.objects.filter(stock=0)
        
        data = {
            'low_stock': [
                {
                    'id': product.id,
                    'name': product.name,
                    'stock': product.stock,
                    'category': product.category.name
                }
                for product in low_stock_products
            ],
            'out_of_stock': [
                {
                    'id': product.id,
                    'name': product.name,
                    'category': product.category.name
                }
                for product in out_of_stock_products
            ]
        }
        
        return Response(data)
