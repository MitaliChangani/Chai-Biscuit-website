import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from core.models import Order, DeliveryPartner

User = get_user_model()


# For delivery partners
class PartnerOrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "orders_unassigned"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def order_updated(self, event):
        order = event['order']
        print(f"[WS DEBUG] Sending order update: {order}")
        assigned_to = order.get("assigned_to")
        if assigned_to:
            order["assigned_to"] = {
                "name": assigned_to.get("name", "Unknown"),
                "phone_number": assigned_to.get("phone_number", "")
            }
        await self.send(text_data=json.dumps({"order": order}))
    async def order_created(self, event):
        await self.order_updated(event) 


# For users
class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract phone from URL kwargs
        self.phone = self.scope['url_route']['kwargs'].get('phone')
        if self.phone:
            self.group_name = f"user_{self.phone}"
        else:
            self.group_name = "orders"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def order_updated(self, event):
        order = event["order"]
        print(f"[WS DEBUG] Sending order update: {order}")
        assigned_to = order.get("assigned_to")
        if assigned_to:
            order["assigned_to"] = {
                "name": assigned_to.get("name", "Unknown"),
                "phone_number": assigned_to.get("phone_number", "")
            }
        await self.send(text_data=json.dumps({"order": order}))
