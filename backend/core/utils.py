from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_to_group(group_name, event, order_payload):
    """
    Broadcast a message to a given WebSocket group.
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "order_updated",   # Ye consumer ke andar hona chahiye
            "order": order_payload
        }
    )
