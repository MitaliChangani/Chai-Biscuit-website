# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PartnerOrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send(text_data=json.dumps({
            "message": "Connected to partner order WS"
        }))

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.send(text_data=json.dumps({
            "echo": data
        }))
