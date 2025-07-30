from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta
from products.models import Product
from orders.models import Order


class SalesAnalytics(models.Model):
    """Model for tracking sales analytics"""
    date = models.DateField(unique=True)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_orders = models.PositiveIntegerField(default=0)
    retail_orders = models.PositiveIntegerField(default=0)
    wholesale_orders = models.PositiveIntegerField(default=0)
    retail_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    wholesale_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Customer metrics
    new_customers = models.PositiveIntegerField(default=0)
    returning_customers = models.PositiveIntegerField(default=0)
    
    # Product metrics
    total_products_sold = models.PositiveIntegerField(default=0)
    top_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Sales Analytics"

    def __str__(self):
        return f"Sales Analytics - {self.date}"

    @classmethod
    def get_or_create_for_date(cls, date):
        """Get or create analytics for a specific date"""
        analytics, created = cls.objects.get_or_create(date=date)
        if created:
            analytics.calculate_daily_metrics()
        return analytics

    def calculate_daily_metrics(self):
        """Calculate metrics for this date"""
        from django.db.models import Sum, Count, Avg
        
        # Get orders for this date
        orders = Order.objects.filter(
            created_at__date=self.date,
            status__in=['delivered', 'shipped', 'processing']
        )
        
        # Calculate revenue
        self.total_revenue = orders.aggregate(total=Sum('total_amount'))['total'] or 0
        self.total_orders = orders.count()
        
        # Calculate order types
        self.retail_orders = orders.filter(order_type='retail').count()
        self.wholesale_orders = orders.filter(order_type='wholesale').count()
        
        # Calculate revenue by type
        self.retail_revenue = orders.filter(order_type='retail').aggregate(
            total=Sum('total_amount'))['total'] or 0
        self.wholesale_revenue = orders.filter(order_type='wholesale').aggregate(
            total=Sum('total_amount'))['total'] or 0
        
        # Calculate average order value
        if self.total_orders > 0:
            self.average_order_value = self.total_revenue / self.total_orders
        
        # Calculate customer metrics
        unique_customers = orders.values('user').distinct().count()
        new_customers = User.objects.filter(
            date_joined__date=self.date
        ).count()
        self.new_customers = new_customers
        self.returning_customers = unique_customers - new_customers
        
        # Calculate product metrics
        from orders.models import OrderItem
        order_items = OrderItem.objects.filter(
            order__created_at__date=self.date
        )
        self.total_products_sold = order_items.aggregate(
            total=Sum('quantity'))['total'] or 0
        
        # Find top product
        top_product_data = order_items.values('product').annotate(
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity').first()
        
        if top_product_data:
            self.top_product_id = top_product_data['product']
        
        self.save()


class ProductAnalytics(models.Model):
    """Model for tracking product-specific analytics"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='analytics')
    date = models.DateField()
    
    # Sales metrics
    units_sold = models.PositiveIntegerField(default=0)
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    orders_count = models.PositiveIntegerField(default=0)
    
    # Inventory metrics
    stock_level = models.PositiveIntegerField(default=0)
    stock_sold = models.PositiveIntegerField(default=0)
    
    # Performance metrics
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['product', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.product.name} - {self.date}"


class UserAnalytics(models.Model):
    """Model for tracking user behavior analytics"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analytics')
    date = models.DateField()
    
    # Activity metrics
    login_count = models.PositiveIntegerField(default=0)
    session_duration = models.PositiveIntegerField(default=0)  # in minutes
    page_views = models.PositiveIntegerField(default=0)
    
    # Purchase metrics
    orders_placed = models.PositiveIntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Product interaction
    products_viewed = models.PositiveIntegerField(default=0)
    products_added_to_cart = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class WebsiteAnalytics(models.Model):
    """Model for tracking website-wide analytics"""
    date = models.DateField(unique=True)
    
    # Traffic metrics
    total_visitors = models.PositiveIntegerField(default=0)
    unique_visitors = models.PositiveIntegerField(default=0)
    page_views = models.PositiveIntegerField(default=0)
    bounce_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Conversion metrics
    conversion_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cart_abandonment_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Performance metrics
    average_session_duration = models.PositiveIntegerField(default=0)  # in minutes
    average_pages_per_session = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Device metrics
    desktop_visitors = models.PositiveIntegerField(default=0)
    mobile_visitors = models.PositiveIntegerField(default=0)
    tablet_visitors = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Website Analytics"

    def __str__(self):
        return f"Website Analytics - {self.date}"


class InventoryAnalytics(models.Model):
    """Model for tracking inventory analytics"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory_analytics')
    date = models.DateField()
    
    # Stock metrics
    opening_stock = models.PositiveIntegerField(default=0)
    closing_stock = models.PositiveIntegerField(default=0)
    stock_sold = models.PositiveIntegerField(default=0)
    stock_received = models.PositiveIntegerField(default=0)
    
    # Performance metrics
    stock_turnover_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    days_of_inventory = models.PositiveIntegerField(default=0)
    
    # Alert metrics
    low_stock_alert = models.BooleanField(default=False)
    out_of_stock_alert = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['product', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.product.name} Inventory - {self.date}"

    def calculate_stock_metrics(self):
        """Calculate stock-related metrics"""
        if self.opening_stock > 0:
            self.stock_turnover_rate = (self.stock_sold / self.opening_stock) * 100
        
        if self.stock_sold > 0:
            self.days_of_inventory = self.closing_stock / (self.stock_sold / 30)  # Assuming 30 days
        
        # Set alerts
        self.low_stock_alert = self.closing_stock < 50
        self.out_of_stock_alert = self.closing_stock == 0
        
        self.save()
