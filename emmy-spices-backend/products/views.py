from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg, Count
from django.shortcuts import get_object_or_404

from .models import Product, Category, ProductImage, ProductReview
from .serializers import (
    ProductSerializer, ProductListSerializer, ProductDetailSerializer,
    ProductCreateSerializer, ProductUpdateSerializer, CategorySerializer,
    CategoryDetailSerializer, ProductImageSerializer, ProductReviewSerializer,
    ProductSearchSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Category model"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategorySerializer

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products for a specific category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        
        # Apply filters
        featured = request.query_params.get('featured')
        if featured:
            products = products.filter(is_featured=True)
        
        # Apply search
        search = request.query_params.get('search')
        if search:
            products = products.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model"""
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'rating', 'created_at', 'stock']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter queryset based on user type"""
        queryset = Product.objects.all()
        
        # Filter by active status
        if self.action in ['list', 'retrieve']:
            queryset = queryset.filter(is_active=True)
        
        # Filter by stock status
        in_stock = self.request.query_params.get('in_stock')
        if in_stock is not None:
            if in_stock.lower() == 'true':
                queryset = queryset.filter(stock__gt=0)
            elif in_stock.lower() == 'false':
                queryset = queryset.filter(stock=0)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProductUpdateSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock"""
        products = self.get_queryset().filter(stock__lt=50, stock__gt=0)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Get out of stock products"""
        products = self.get_queryset().filter(stock=0)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top rated products"""
        products = self.get_queryset().order_by('-rating')[:10]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def best_sellers(self, request):
        """Get best selling products"""
        products = self.get_queryset().annotate(
            total_sold=Count('orderitem')
        ).order_by('-total_sold')[:10]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def search(self, request):
        """Advanced product search"""
        serializer = ProductSearchSerializer(data=request.data)
        if serializer.is_valid():
            queryset = self.get_queryset()
            
            # Apply search filters
            data = serializer.validated_data
            
            if data.get('query'):
                queryset = queryset.filter(
                    Q(name__icontains=data['query']) |
                    Q(description__icontains=data['query'])
                )
            
            if data.get('category'):
                queryset = queryset.filter(category_id=data['category'])
            
            if data.get('min_price'):
                queryset = queryset.filter(price__gte=data['min_price'])
            
            if data.get('max_price'):
                queryset = queryset.filter(price__lte=data['max_price'])
            
            if data.get('in_stock') is not None:
                if data['in_stock']:
                    queryset = queryset.filter(stock__gt=0)
                else:
                    queryset = queryset.filter(stock=0)
            
            if data.get('featured'):
                queryset = queryset.filter(is_featured=True)
            
            # Apply sorting
            sort_by = data.get('sort_by', 'name')
            sort_order = data.get('sort_order', 'asc')
            
            if sort_order == 'desc':
                sort_by = f'-{sort_by}'
            
            queryset = queryset.order_by(sort_by)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get reviews for a product"""
        product = self.get_object()
        reviews = product.reviews.all()
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        """Add a review to a product"""
        product = self.get_object()
        serializer = ProductReviewSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            # Check if user already reviewed this product
            existing_review = ProductReview.objects.filter(
                product=product,
                user=request.user
            ).first()
            
            if existing_review:
                return Response(
                    {'error': 'You have already reviewed this product'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer.save(product=product)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for ProductReview model"""
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter reviews by product if specified"""
        queryset = ProductReview.objects.all()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def perform_create(self, serializer):
        """Set the user automatically"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Ensure only the review author can update"""
        if serializer.instance.user != self.request.user:
            raise PermissionError("You can only edit your own reviews")
        serializer.save()

    def perform_destroy(self, instance):
        """Ensure only the review author can delete"""
        if instance.user != self.request.user:
            raise PermissionError("You can only delete your own reviews")
        instance.delete()


class ProductImageViewSet(viewsets.ModelViewSet):
    """ViewSet for ProductImage model"""
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter images by product if specified"""
        queryset = ProductImage.objects.all()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def perform_create(self, serializer):
        """Set the product automatically"""
        product_id = self.request.data.get('product')
        if product_id:
            product = get_object_or_404(Product, id=product_id)
            serializer.save(product=product)
        else:
            serializer.save()
