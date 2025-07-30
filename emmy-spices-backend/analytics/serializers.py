from rest_framework import serializers
from .models import SalesAnalytics, ProductAnalytics, UserAnalytics, WebsiteAnalytics, InventoryAnalytics


class SalesAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for SalesAnalytics model"""
    
    class Meta:
        model = SalesAnalytics
        fields = [
            'id', 'date', 'total_revenue', 'total_orders', 'retail_orders',
            'wholesale_orders', 'retail_revenue', 'wholesale_revenue',
            'average_order_value', 'new_customers', 'returning_customers',
            'total_products_sold', 'top_product', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ProductAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for ProductAnalytics model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = ProductAnalytics
        fields = [
            'id', 'product', 'product_name', 'date', 'units_sold', 'revenue',
            'orders_count', 'stock_level', 'stock_sold', 'conversion_rate',
            'average_rating', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for UserAnalytics model"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserAnalytics
        fields = [
            'id', 'user', 'user_name', 'date', 'login_count', 'session_duration',
            'page_views', 'orders_placed', 'total_spent', 'average_order_value',
            'products_viewed', 'products_added_to_cart', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class WebsiteAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for WebsiteAnalytics model"""
    
    class Meta:
        model = WebsiteAnalytics
        fields = [
            'id', 'date', 'total_visitors', 'unique_visitors', 'page_views',
            'bounce_rate', 'conversion_rate', 'cart_abandonment_rate',
            'average_session_duration', 'average_pages_per_session',
            'desktop_visitors', 'mobile_visitors', 'tablet_visitors',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class InventoryAnalyticsSerializer(serializers.ModelSerializer):
    """Serializer for InventoryAnalytics model"""
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = InventoryAnalytics
        fields = [
            'id', 'product', 'product_name', 'date', 'opening_stock',
            'closing_stock', 'stock_sold', 'stock_received', 'stock_turnover_rate',
            'days_of_inventory', 'low_stock_alert', 'out_of_stock_alert',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class DashboardSummarySerializer(serializers.Serializer):
    """Serializer for dashboard summary"""
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_orders = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_products = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    low_stock_products = serializers.IntegerField()
    today_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    today_orders = serializers.IntegerField()
    conversion_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)


class SalesTrendSerializer(serializers.Serializer):
    """Serializer for sales trends"""
    date = serializers.DateField()
    revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    orders = serializers.IntegerField()
    customers = serializers.IntegerField()


class ProductPerformanceSerializer(serializers.Serializer):
    """Serializer for product performance"""
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    units_sold = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    stock_level = serializers.IntegerField()


class CustomerAnalyticsSerializer(serializers.Serializer):
    """Serializer for customer analytics"""
    total_customers = serializers.IntegerField()
    new_customers = serializers.IntegerField()
    returning_customers = serializers.IntegerField()
    active_customers = serializers.IntegerField()
    average_customer_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    customer_retention_rate = serializers.DecimalField(max_digits=5, decimal_places=2) 