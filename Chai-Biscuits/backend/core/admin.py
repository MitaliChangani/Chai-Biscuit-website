from django.contrib import admin
from .models import CustomUser, Order, OTP, OrderItem, DeliveryPartner, DeliveryHistory

# CustomUser Admin (no password fields)
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'address', 'is_active')
    search_fields = ('name', 'phone_number')
    list_filter = ('is_active',)
    readonly_fields = ('last_login',)
    
    fieldsets = (
        (None, {'fields': ('phone_number', 'name', 'address', 'is_active', 'last_login')}),
    )

# OrderItem inline inside Order
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('item_name', 'quantity', 'price_per_item', 'total_price')
    can_delete = False

# Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'user', 'total_amount', 'delivery_status')    # 'order_date'
    search_fields = ('user__name', 'order_id')
    # list_filter = ('delivery_status', 'order_date')
    inlines = [OrderItemInline]
    readonly_fields = ('order_id', 'user', 'total_amount')  #  'order_date'

# OTP Admin
@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'otp', 'created_at')
    search_fields = ('phone_number',)
    list_filter = ('created_at',)

# DeliveryPartner Admin
@admin.register(DeliveryPartner)
class DeliveryPartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'is_online')
    search_fields = ('name', 'phone_number')
    list_filter = ('is_online',)


admin.site.register(DeliveryHistory)