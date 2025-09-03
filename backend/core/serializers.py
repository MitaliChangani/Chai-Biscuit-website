from rest_framework import serializers
from .models import Order, OrderItem, DeliveryPartner

class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        read_only=True
    )
    class Meta:
        model = OrderItem
        fields = ['item_name', 'quantity', 'price_per_item', "total_price"]


class DeliveryPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPartner
        fields = ['id', 'name', 'phone_number']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    assigned_to = DeliveryPartnerSerializer(read_only=True)
    delivery_address = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField() 

    class Meta:
        model = Order
        fields = [
            'order_id',
            'placed_at',
            'out_for_delivery_at',
            'delivery_time',
            'total_amount',
            'delivery_status',   
            'assigned_to',
            'items',
            'delivery_address',
            'user',
            
       ]
    def get_delivery_address(self, obj):
        # Returns the address of the user who placed the order
        return obj.user.address
    
    def get_user(self, obj):
        return {
            "name": obj.user.name,
            "phone_number": obj.user.phone_number,
            "address": obj.user.address
        }