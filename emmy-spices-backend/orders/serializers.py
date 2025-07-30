from rest_framework import serializers
from .models import Order, OrderItem, ShippingMethod, Payment
from products.serializers import ProductListSerializer
from users.serializers import UserProfileSerializer
from products.models import Product
from django.utils import timezone


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model"""
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product', 'product_id', 'quantity', 'unit_price',
            'total_price', 'is_wholesale', 'box_quantity'
        ]


class ShippingMethodSerializer(serializers.ModelSerializer):
    """Serializer for ShippingMethod model"""
    
    class Meta:
        model = ShippingMethod
        fields = ['id', 'name', 'description', 'cost', 'estimated_days', 'is_active', 'is_wholesale_only']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'amount', 'payment_method', 'transaction_id',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model"""
    items = OrderItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    user_profile = UserProfileSerializer(source='user.profile', read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    can_cancel = serializers.BooleanField(read_only=True)
    can_refund = serializers.BooleanField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_profile', 'order_type', 'status',
            'customer_name', 'customer_email', 'customer_phone', 'shipping_address',
            'shipping_city', 'shipping_state', 'shipping_country', 'shipping_postal_code',
            'subtotal', 'tax_amount', 'shipping_cost', 'total_amount', 'payment_status',
            'payment_method', 'transaction_id', 'tracking_number', 'shipping_carrier',
            'created_at', 'updated_at', 'shipped_at', 'delivered_at', 'notes',
            'admin_notes', 'items', 'payments', 'total_items', 'can_cancel', 'can_refund'
        ]
        read_only_fields = [
            'order_number', 'created_at', 'updated_at', 'shipped_at', 'delivered_at',
            'total_items', 'can_cancel', 'can_refund'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order lists"""
    total_items = serializers.IntegerField(read_only=True)
    can_cancel = serializers.BooleanField(read_only=True)
    can_refund = serializers.BooleanField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_type', 'status', 'customer_name',
            'total_amount', 'payment_status', 'created_at', 'total_items',
            'can_cancel', 'can_refund'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = OrderItemSerializer(many=True)
    shipping_method_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = [
            'order_type', 'customer_name', 'customer_email', 'customer_phone',
            'shipping_address', 'shipping_city', 'shipping_state', 'shipping_country',
            'shipping_postal_code', 'notes', 'items', 'shipping_method_id'
        ]

    def create(self, validated_data):
        """Create order with items"""
        items_data = validated_data.pop('items', [])
        shipping_method_id = validated_data.pop('shipping_method_id', None)
        
        # Set user
        validated_data['user'] = self.context['request'].user
        
        # Calculate shipping cost
        if shipping_method_id:
            try:
                shipping_method = ShippingMethod.objects.get(id=shipping_method_id)
                validated_data['shipping_cost'] = shipping_method.cost
            except ShippingMethod.DoesNotExist:
                pass
        
        # Create order
        order = Order.objects.create(**validated_data)
        
        # Create order items
        subtotal = 0
        for item_data in items_data:
            product_id = item_data.pop('product_id')
            product = Product.objects.get(id=product_id)
            
            # Set price based on order type
            if validated_data['order_type'] == 'wholesale':
                item_data['unit_price'] = product.wholesale_price
                item_data['is_wholesale'] = True
                item_data['box_quantity'] = item_data.get('quantity', 1)
            else:
                item_data['unit_price'] = product.retail_price
                item_data['is_wholesale'] = False
            
            item_data['order'] = order
            item_data['product'] = product
            
            order_item = OrderItem.objects.create(**item_data)
            subtotal += order_item.total_price
        
        # Calculate totals
        order.subtotal = subtotal
        order.total_amount = subtotal + order.tax_amount + order.shipping_cost
        order.save()
        
        return order

    def validate(self, data):
        """Validate order data"""
        # Check if items are provided
        if not data.get('items'):
            raise serializers.ValidationError("At least one item is required")
        
        # Validate items
        for item in data['items']:
            product_id = item.get('product_id')
            if not product_id:
                raise serializers.ValidationError("Product ID is required for each item")
            
            try:
                product = Product.objects.get(id=product_id)
                if not product.is_active:
                    raise serializers.ValidationError(f"Product {product.name} is not active")
                
                if product.stock < item.get('quantity', 1):
                    raise serializers.ValidationError(f"Insufficient stock for {product.name}")
                    
            except Product.DoesNotExist:
                raise serializers.ValidationError(f"Product with ID {product_id} does not exist")
        
        return data


class OrderUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating orders"""
    
    class Meta:
        model = Order
        fields = [
            'status', 'payment_status', 'tracking_number', 'shipping_carrier',
            'notes', 'admin_notes'
        ]

    def validate_status(self, value):
        """Validate status transitions"""
        instance = self.instance
        if instance:
            # Define allowed status transitions
            allowed_transitions = {
                'pending': ['processing', 'cancelled'],
                'processing': ['shipped', 'cancelled'],
                'shipped': ['delivered'],
                'delivered': ['refunded'],
                'cancelled': [],
                'refunded': []
            }
            
            current_status = instance.status
            if value != current_status and value not in allowed_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Cannot transition from {current_status} to {value}"
                )
        
        return value


class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating order status"""
    status = serializers.ChoiceField(choices=Order.ORDER_STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)

    def update(self, instance, validated_data):
        """Update order status"""
        status = validated_data['status']
        notes = validated_data.get('notes', '')
        
        # Update status
        instance.status = status
        
        # Add notes
        if notes:
            if instance.admin_notes:
                instance.admin_notes += f"\n{notes}"
            else:
                instance.admin_notes = notes
        
        # Set timestamps
        if status == 'shipped' and not instance.shipped_at:
            instance.shipped_at = timezone.now()
        elif status == 'delivered' and not instance.delivered_at:
            instance.delivered_at = timezone.now()
        
        instance.save()
        return instance


class OrderFilterSerializer(serializers.Serializer):
    """Serializer for order filtering"""
    status = serializers.ChoiceField(choices=Order.ORDER_STATUS_CHOICES, required=False)
    order_type = serializers.ChoiceField(choices=Order.ORDER_TYPE_CHOICES, required=False)
    payment_status = serializers.ChoiceField(
        choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed'), ('refunded', 'Refunded')],
        required=False
    )
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    customer_name = serializers.CharField(required=False)
    customer_email = serializers.CharField(required=False)
    order_number = serializers.CharField(required=False)
    min_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    max_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)


class OrderStatisticsSerializer(serializers.Serializer):
    """Serializer for order statistics"""
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    average_order_value = serializers.DecimalField(max_digits=10, decimal_places=2)
    pending_orders = serializers.IntegerField()
    processing_orders = serializers.IntegerField()
    shipped_orders = serializers.IntegerField()
    delivered_orders = serializers.IntegerField()
    cancelled_orders = serializers.IntegerField()
    retail_orders = serializers.IntegerField()
    wholesale_orders = serializers.IntegerField()
    retail_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    wholesale_revenue = serializers.DecimalField(max_digits=12, decimal_places=2) 