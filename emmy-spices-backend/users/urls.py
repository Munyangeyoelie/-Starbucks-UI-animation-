from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, DistributorApplicationViewSet

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet)
router.register(r'distributor-applications', DistributorApplicationViewSet)

app_name = 'users'

urlpatterns = [
    path('api/', include(router.urls)),
] 