from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, ShippingMethodViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet)
router.register(r'shipping-methods', ShippingMethodViewSet)
router.register(r'payments', PaymentViewSet)

app_name = 'orders'

urlpatterns = [
    path('api/', include(router.urls)),
] 