from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid
from datetime import timedelta

# ----------------------------
# Custom User Model
# ----------------------------

class CustomUserManager(BaseUserManager):
    def create_user(self, phone_number, name, address, password=None):
        if not phone_number:
            raise ValueError("Users must have a phone number")
        user = self.model(phone_number=phone_number, name=name, address=address)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    

class CustomUser(AbstractBaseUser):
    phone_number = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required for admin access
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['name', 'address']

    def __str__(self):
        return f"{self.name} ({self.phone_number})"

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

# ----------------------------
# OTP for Login
# ----------------------------

class OTP(models.Model):
    phone_number = models.CharField(max_length=10)
    otp = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.phone_number} - OTP: {self.otp}"

# ----------------------------
# Delivery Partner
# ----------------------------

class DeliveryPartner(models.Model):
    phone_number = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    address = models.TextField()
    is_online = models.BooleanField(default=True)  # Online/Offline toggle
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"



# ----------------------------
# Order and Items
# ----------------------------

class Order(models.Model):
    STATUS_CHOICES = [
        ('placed', 'Order Placed'),
        ('assigned', 'Assigned to Delivery Partner'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    placed_at = models.DateTimeField(auto_now_add=True)  # Real timestamp
    out_for_delivery_at = models.DateTimeField(null=True, blank=True)
    delivery_time = models.DurationField(default=timedelta(0))
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='placed')
    delivery_address = models.TextField(blank=True, null=True)  # Address at the time of order
    # Link delivery partner if assigned
    assigned_to = models.ForeignKey(DeliveryPartner, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_orders')

    def __str__(self):
        return f"Order {self.order_id} for {self.user.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    price_per_item = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    @property
    def total_price(self):
        if self.quantity is not None and self.price_per_item is not None:
            return self.quantity * self.price_per_item
        return 0

    def __str__(self):
        return f"{self.quantity} x {self.item_name}"

# ----------------------------
# Delivery History (Optional)
# ----------------------------

class DeliveryHistory(models.Model):
    delivery_partner = models.ForeignKey(DeliveryPartner, on_delete=models.CASCADE)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('completed', 'Completed'), ('cancelled', 'Cancelled')])
    earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def time_taken(self):
        if self.order.placed_at and self.completed_at:
            return self.completed_at - self.order.placed_at
        return timedelta(0)

    def __str__(self):
        return f"{self.order.order_id} - {self.delivery_partner.name}"
