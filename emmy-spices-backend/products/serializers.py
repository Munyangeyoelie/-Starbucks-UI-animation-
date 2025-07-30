from rest_framework import serializers
from .models import Product, Category, ProductImage, ProductReview


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'product_count', 'created_at', 'updated_at']

    def get_product_count(self, obj):
        return obj.products.count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Serializer for ProductImage model"""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'created_at']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for ProductReview model"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'user', 'user_name', 'user_email', 'rating', 
            'title', 'comment', 'is_verified_purchase', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'is_verified_purchase']

    def create(self, validated_data):
        """Set the user automatically"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    stock_status = serializers.CharField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2, read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'retail_price', 'wholesale_price',
            'image', 'stock', 'box_size', 'category', 'category_id', 'is_active',
            'is_featured', 'rating', 'num_reviews', 'stock_status', 'is_in_stock',
            'average_rating', 'review_count', 'images', 'reviews', 'created_at', 'updated_at'
        ]

    def to_representation(self, instance):
        """Custom representation with calculated fields"""
        data = super().to_representation(instance)
        
        # Calculate average rating from reviews
        reviews = instance.reviews.all()
        if reviews.exists():
            data['average_rating'] = sum(review.rating for review in reviews) / reviews.count()
            data['review_count'] = reviews.count()
        else:
            data['average_rating'] = 0.0
            data['review_count'] = 0
        
        return data


class ProductListSerializer(serializers.ModelSerializer):
    """Simplified serializer for product lists"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    stock_status = serializers.CharField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'retail_price', 'wholesale_price',
            'image', 'stock', 'box_size', 'category_name', 'is_active', 'is_featured',
            'rating', 'stock_status', 'is_in_stock', 'created_at'
        ]


class ProductDetailSerializer(ProductSerializer):
    """Detailed serializer for single product view"""
    related_products = serializers.SerializerMethodField()

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['related_products']

    def get_related_products(self, obj):
        """Get related products from the same category"""
        related = Product.objects.filter(
            category=obj.category,
            is_active=True
        ).exclude(id=obj.id)[:4]
        return ProductListSerializer(related, many=True).data


class ProductCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating products"""
    images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'retail_price', 'wholesale_price',
            'image', 'stock', 'box_size', 'category_id', 'is_active', 'is_featured', 'images'
        ]

    def create(self, validated_data):
        """Handle nested image creation"""
        images_data = validated_data.pop('images', [])
        product = Product.objects.create(**validated_data)
        
        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)
        
        return product


class ProductUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating products"""
    images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'retail_price', 'wholesale_price',
            'image', 'stock', 'box_size', 'category_id', 'is_active', 'is_featured', 'images'
        ]

    def update(self, instance, validated_data):
        """Handle nested image updates"""
        images_data = validated_data.pop('images', [])
        
        # Update product
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle images
        if images_data:
            # Clear existing images
            instance.images.all().delete()
            
            # Create new images
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)
        
        return instance


class CategoryDetailSerializer(CategorySerializer):
    """Detailed serializer for category with products"""
    products = ProductListSerializer(many=True, read_only=True)

    class Meta(CategorySerializer.Meta):
        fields = CategorySerializer.Meta.fields + ['products']


class ProductSearchSerializer(serializers.Serializer):
    """Serializer for product search"""
    query = serializers.CharField(max_length=200, required=False)
    category = serializers.IntegerField(required=False)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    in_stock = serializers.BooleanField(required=False)
    featured = serializers.BooleanField(required=False)
    sort_by = serializers.ChoiceField(
        choices=[
            ('name', 'Name'),
            ('price', 'Price'),
            ('rating', 'Rating'),
            ('created_at', 'Newest'),
            ('stock', 'Stock Level')
        ],
        required=False
    )
    sort_order = serializers.ChoiceField(
        choices=[('asc', 'Ascending'), ('desc', 'Descending')],
        default='asc',
        required=False
    ) 