from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet, ProductReviewViewSet, ProductImageViewSet
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'reviews', ProductReviewViewSet)
router.register(r'images', ProductImageViewSet)

app_name = 'products'

urlpatterns = [
    path('api/', include(router.urls)),
] 