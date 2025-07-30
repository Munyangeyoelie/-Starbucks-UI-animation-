from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q

from .models import UserProfile, DistributorApplication, UserActivity, Notification
from .serializers import (
    UserProfileSerializer, DistributorApplicationSerializer,
    UserActivitySerializer, NotificationSerializer
)


class UserProfileViewSet(viewsets.ModelViewSet):
    """ViewSet for UserProfile model"""
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user_type']
    search_fields = ['user__username', 'user__email', 'company_name']

    def get_queryset(self):
        """Filter queryset based on user"""
        queryset = UserProfile.objects.all()
        
        # If user is not admin, only show their own profile
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current user's profile"""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def distributors(self, request):
        """Get all distributor profiles"""
        distributor_profiles = UserProfile.objects.filter(user_type='distributor')
        serializer = self.get_serializer(distributor_profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def customers(self, request):
        """Get all customer profiles"""
        customer_profiles = UserProfile.objects.filter(user_type='customer')
        serializer = self.get_serializer(customer_profiles, many=True)
        return Response(serializer.data)


class DistributorApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for DistributorApplication model"""
    queryset = DistributorApplication.objects.all()
    serializer_class = DistributorApplicationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['company_name', 'business_license', 'tax_id']

    def get_queryset(self):
        """Filter queryset based on user"""
        queryset = DistributorApplication.objects.all()
        
        # If user is not admin, only show their own applications
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    def get_permissions(self):
        """Set permissions based on action"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        """Set the user automatically"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve distributor application"""
        application = self.get_object()
        
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can approve applications'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        application.status = 'approved'
        application.save()
        
        # Update user profile to distributor
        user_profile = application.user.profile
        user_profile.user_type = 'distributor'
        user_profile.company_name = application.company_name
        user_profile.business_license = application.business_license
        user_profile.tax_id = application.tax_id
        user_profile.save()
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject distributor application"""
        application = self.get_object()
        
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can reject applications'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        application.status = 'rejected'
        application.save()
        
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending applications"""
        pending_applications = self.get_queryset().filter(status='pending')
        serializer = self.get_serializer(pending_applications, many=True)
        return Response(serializer.data)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for UserActivity model"""
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter activities based on user"""
        queryset = UserActivity.objects.all()
        
        # If user is not admin, only show their own activities
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """Get current user's activities"""
        activities = UserActivity.objects.filter(user=request.user)
        serializer = self.get_serializer(activities, many=True)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for Notification model"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter notifications based on user"""
        queryset = Notification.objects.all()
        
        # If user is not admin, only show their own notifications
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        unread_notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(unread_notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'message': 'All notifications marked as read'})
