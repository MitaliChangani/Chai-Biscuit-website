from django.urls import path
from . import views
from .views import *


urlpatterns = [
    # User
    path('register/', register_user),
    path('send-otp/', send_otp),
    path('verify-otp/', verify_otp),
    path('get-user-profile/', get_user_profile),
    path('update-user-profile/', update_user_profile),

    # Delivery Partner
    path('register-partner/', register_delivery_partner),
    path('send-otp-partner/', send_otp_partner),
    path('verify-otp-partner/', verify_otp_partner),
    path('get-partner-profile/', get_partner_profile),
    path('delivery-partner/update-profile/', update_delivery_partner_profile),
    
    # Orders
    path('create-order/', create_order),
    path('order-history/', user_order_history),
    path('orders/all/', all_orders),
    path('orders/unassigned/', unassigned_orders),
    path('orders/assigned/', assigned_orders),
    path('orders/history/', delivery_history),
    path('orders/<str:order_id>/status/', get_order_status),
    # path('confirm-order/<str:order_id>/', confirm_order, name='confirm_order'),
    path('orders/<uuid:order_id>/update-status/', views.update_order_status, name='update_order_status'),
]
