from django.urls import re_path
from core.consumers import PartnerOrderConsumer, OrderConsumer

websocket_urlpatterns = [
    # All unassigned orders for partners
    re_path(r'ws/orders/partner/$', PartnerOrderConsumer.as_asgi()),

    # All orders (general)
    re_path(r'ws/orders/$', OrderConsumer.as_asgi()),

    # Orders for specific user
    re_path(r'ws/orders/user_(?P<phone>\d{10})/$', OrderConsumer.as_asgi()),
]
