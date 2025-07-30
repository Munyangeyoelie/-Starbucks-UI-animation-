from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalesAnalyticsViewSet, ProductAnalyticsViewSet, UserAnalyticsViewSet

router = DefaultRouter()
router.register(r'sales', SalesAnalyticsViewSet)
router.register(r'products', ProductAnalyticsViewSet)
router.register(r'users', UserAnalyticsViewSet)

app_name = 'analytics'

urlpatterns = [
    path('api/', include(router.urls)),
] 