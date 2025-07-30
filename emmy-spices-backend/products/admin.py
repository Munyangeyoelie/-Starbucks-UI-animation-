from django.contrib import admin
from .models import Product, Category, ProductImage, ProductReview


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'product_count', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductReviewInline(admin.TabularInline):
    model = ProductReview
    extra = 0
    readonly_fields = ['user', 'created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price', 'retail_price', 'wholesale_price',
        'stock', 'stock_status', 'is_active', 'is_featured', 'rating',
        'created_at'
    ]
    list_filter = [
        'category', 'is_active', 'is_featured', 'created_at',
        'stock_status'
    ]
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['rating', 'num_reviews', 'stock_status', 'is_in_stock']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category', 'image')
        }),
        ('Pricing', {
            'fields': ('price', 'retail_price', 'wholesale_price')
        }),
        ('Inventory', {
            'fields': ('stock', 'box_size')
        }),
        ('Status', {
            'fields': ('is_active', 'is_featured')
        }),
        ('Ratings', {
            'fields': ('rating', 'num_reviews'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    inlines = [ProductImageInline, ProductReviewInline]
    
    def stock_status(self, obj):
        return obj.stock_status
    stock_status.short_description = 'Stock Status'
    
    def is_in_stock(self, obj):
        return obj.is_in_stock
    is_in_stock.boolean = True
    is_in_stock.short_description = 'In Stock'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
    search_fields = ['product__name', 'alt_text']
    ordering = ['-created_at']


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = [
        'product', 'user', 'rating', 'title', 'is_verified_purchase',
        'created_at'
    ]
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__username', 'title', 'comment']
    ordering = ['-created_at']
    readonly_fields = ['user', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('product', 'user', 'rating', 'title', 'comment')
        }),
        ('Status', {
            'fields': ('is_verified_purchase',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
