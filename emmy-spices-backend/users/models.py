from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    """Extended user profile model"""
    USER_TYPE_CHOICES = [
        ('customer', 'Customer'),
        ('distributor', 'Distributor'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')
    
    # Contact information
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='Rwanda')
    postal_code = models.CharField(max_length=20, blank=True)
    
    # Business information (for distributors)
    company_name = models.CharField(max_length=200, blank=True)
    business_license = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=100, blank=True)
    
    # Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Profile picture
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"

    @property
    def is_distributor(self):
        """Check if user is a distributor"""
        return self.user_type == 'distributor'

    @property
    def is_admin(self):
        """Check if user is an admin"""
        return self.user_type == 'admin'

    @property
    def is_customer(self):
        """Check if user is a customer"""
        return self.user_type == 'customer'

    def get_full_address(self):
        """Get complete address"""
        address_parts = [self.address, self.city, self.state, self.country]
        return ', '.join(filter(None, address_parts))


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create user profile when user is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save user profile when user is saved"""
    if hasattr(instance, 'profile'):
        instance.profile.save()


class DistributorApplication(models.Model):
    """Model for distributor applications"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='distributor_applications')
    company_name = models.CharField(max_length=200)
    business_license = models.CharField(max_length=100)
    tax_id = models.CharField(max_length=100)
    business_address = models.TextField()
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    
    # Business details
    business_type = models.CharField(max_length=100, blank=True)
    years_in_business = models.PositiveIntegerField(blank=True, null=True)
    annual_revenue = models.CharField(max_length=50, blank=True)
    
    # Application details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} - {self.get_status_display()}"


class UserActivity(models.Model):
    """Model for tracking user activity"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=50)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "User Activities"

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"


class Notification(models.Model):
    """Model for user notifications"""
    NOTIFICATION_TYPE_CHOICES = [
        ('order_status', 'Order Status'),
        ('payment', 'Payment'),
        ('shipping', 'Shipping'),
        ('promotion', 'Promotion'),
        ('system', 'System'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"


class UserSession(models.Model):
    """Model for tracking user sessions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_key = models.CharField(max_length=40)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-login_time']

    def __str__(self):
        return f"{self.user.username} - {self.login_time}"
