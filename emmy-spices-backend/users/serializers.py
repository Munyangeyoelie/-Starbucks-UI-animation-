from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, DistributorApplication, UserActivity, Notification


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'last_login']
        read_only_fields = ['date_joined', 'last_login']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'user_id', 'user_type', 'phone_number', 'address',
            'city', 'state', 'country', 'postal_code', 'company_name',
            'business_license', 'tax_id', 'email_notifications', 'sms_notifications',
            'profile_picture', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        """Set the user automatically"""
        if 'user_id' not in validated_data:
            validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class DistributorApplicationSerializer(serializers.ModelSerializer):
    """Serializer for DistributorApplication model"""
    user = UserSerializer(read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DistributorApplication
        fields = [
            'id', 'user', 'user_name', 'user_email', 'company_name',
            'business_license', 'tax_id', 'business_address', 'phone_number',
            'email', 'business_type', 'years_in_business', 'annual_revenue',
            'status', 'admin_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'status', 'admin_notes', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Set the user automatically"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserActivitySerializer(serializers.ModelSerializer):
    """Serializer for UserActivity model"""
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserActivity
        fields = [
            'id', 'user', 'user_name', 'activity_type', 'description',
            'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model"""
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'user_name', 'notification_type', 'title',
            'message', 'is_read', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, default='customer')
    phone_number = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 'password',
            'password_confirm', 'user_type', 'phone_number', 'address'
        ]

    def validate(self, data):
        """Validate registration data"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        """Create user and profile"""
        # Extract profile data
        user_type = validated_data.pop('user_type')
        phone_number = validated_data.pop('phone_number', '')
        address = validated_data.pop('address', '')
        password_confirm = validated_data.pop('password_confirm')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        # Create profile
        UserProfile.objects.create(
            user=user,
            user_type=user_type,
            phone_number=phone_number,
            address=address
        )
        
        return user


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 'address', 'city', 'state', 'country',
            'postal_code', 'company_name', 'business_license', 'tax_id',
            'email_notifications', 'sms_notifications', 'profile_picture'
        ] 