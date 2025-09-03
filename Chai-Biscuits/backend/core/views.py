import random
from django.http import JsonResponse
import requests
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json
from django.utils import timezone
from .serializers import *
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from django.utils import timezone
from decimal import Decimal
from django.shortcuts import get_object_or_404
from .utils import broadcast_to_group 


def broadcast_to_group(group_name: str, event_type: str, order_data: dict):
    """
    Helper: send order_data to group_name.
    event_type should be 'order_created', 'order_assigned', or 'order_updated'
    """
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": event_type, 
            "order": order_data
        }
    )


@csrf_exempt
def get_user_profile(request):
    if request.method == 'GET':
        try:
            print("Query params:", request.GET)
            phone = request.GET.get('phone') 

            if not phone:
                return JsonResponse({'error': 'Phone number is required'}, status=400)

            user = CustomUser.objects.get(phone_number=phone)

            return JsonResponse({
                'name': user.name,
                'phone_number': user.phone_number,
                'address': user.address
            })

        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def update_user_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        phone = data.get('phone_number')
        address = data.get('address')

        if not phone:
            return JsonResponse({'error': 'Phone number required'}, status=400)
        try:
            user = CustomUser.objects.get(phone_number=phone)
            user.address = address
            user.save()
            return JsonResponse({'message': 'Address updated successfully'})
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)


@csrf_exempt
def get_partner_profile(request):
    if request.method == 'GET':
        try:
            print("Query params:", request.GET)
            phone = request.GET.get('phone') 

            if not phone:
                return JsonResponse({'error': 'Phone number is required'}, status=400)

            user = DeliveryPartner.objects.get(phone_number=phone)

            return JsonResponse({
                'name': user.name,
                'phone_number': user.phone_number,
                'address': user.address
            })

        except DeliveryPartner.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        phone_number = data.get('phone_number')
        address = data.get('address')

        if not all([name, phone_number, address]):
            return JsonResponse({'error': 'All fields are required'}, status=400)

        # Save user if not already exists
        user, created = CustomUser.objects.get_or_create(phone_number=phone_number, defaults={
            'name': name,
            'address': address
        })

        if not created:
            return JsonResponse({'error': 'User already exists'}, status=400)

        return JsonResponse({'message': 'User registered successfully'})


def generate_otp():
    return str(random.randint(1000, 9999))

@csrf_exempt
def send_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            phone = data.get('phone_number')
            name = data.get('name')

            if not phone or not name:
                return JsonResponse({'error': 'Phone number and name are required'}, status=400)

            # ✅ Match BOTH name and phone number
            try:
                user = CustomUser.objects.get(phone_number=phone, name=name)
            except CustomUser.DoesNotExist:
                return JsonResponse({'error': 'User not found with given name and phone number'}, status=404)

            otp = generate_otp()

            # Save OTP in DB
            OTP.objects.update_or_create(
                phone_number=phone,
                defaults={'otp': otp, 'created_at': timezone.now()}
            )

            print(f"[DEBUG] Saved OTP {otp} for {phone}")

            # Send OTP (real API in production)
            api_key = 'cfc26a50-6ebb-11f0-a562-0200cd936042'
            url = f'https://2factor.in/API/V1/{api_key}/SMS/{phone}/{otp}'
            response = requests.get(url)
            print(f'Sending OTP {otp} to {phone}, API response: {response.text}')

            return JsonResponse({'message': 'OTP sent successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def send_otp_partner(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            phone = data.get('phone_number')
            name = data.get('name')

            if not phone or not name:
                return JsonResponse({'error': 'Phone number and name are required'}, status=400)

            # ✅ Match BOTH name and phone number
            try:
                user = DeliveryPartner.objects.get(phone_number=phone, name=name)
            except DeliveryPartner.DoesNotExist:
                return JsonResponse({'error': 'User not found with given name and phone number'}, status=404)

            otp = generate_otp()

            # Save OTP in DB
            OTP.objects.update_or_create(
                phone_number=phone,
                defaults={'otp': otp, 'created_at': timezone.now()}
            )

            print(f"[DEBUG] Saved OTP {otp} for {phone}")

            # Send OTP (real API in production)
            api_key = 'cfc26a50-6ebb-11f0-a562-0200cd936042'
            url = f'https://2factor.in/API/V1/{api_key}/SMS/{phone}/{otp}'
            response = requests.get(url)
            print(f'Sending OTP {otp} to {phone}, API response: {response.text}')

            return JsonResponse({'message': 'OTP sent successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def verify_otp(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            phone = data.get('phone_number')
            entered_otp = data.get('otp')
            name = data.get('name')  # ✅ get name from request

            if not all([phone, entered_otp, name]):
                return JsonResponse({'error': 'Phone number, name, and OTP required'}, status=400)

            otp_record = OTP.objects.filter(phone_number=phone).latest('created_at')

            if timezone.now() - otp_record.created_at > timedelta(minutes=5):
                return JsonResponse({'error': 'OTP expired'}, status=400)

            if otp_record.otp == entered_otp:
                otp_record.delete()  # Delete after successful verification
                
                try:
                    # ✅ Match both name and phone number here too
                    user = CustomUser.objects.get(phone_number=phone, name=name)
                    return JsonResponse({
                        'message': 'OTP verified, login successful',
                        'phone_number': user.phone_number,
                        'name': user.name
                    })
                except CustomUser.DoesNotExist:
                    return JsonResponse({'error': 'User not found with given name and phone'}, status=404)
            else:
                return JsonResponse({'error': 'Invalid OTP'}, status=400)
        except OTP.DoesNotExist:
            return JsonResponse({'error': 'OTP not found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def verify_otp_partner(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(f"[DEBUG] Received data: {data}")

            phone = data.get('phone_number')
            entered_otp = data.get('otp')
            name = data.get('name')  # ✅ get name from request

            if not all([phone, entered_otp, name]):
                return JsonResponse({'error': 'Phone number, name, and OTP required'}, status=400)

            otp_record = OTP.objects.filter(phone_number=phone).latest('created_at')

            if timezone.now() - otp_record.created_at > timedelta(minutes=5):
                return JsonResponse({'error': 'OTP expired'}, status=400)

            if otp_record.otp == entered_otp:
                otp_record.delete()  # Delete after successful verification
                
                try:
                    # ✅ Match both name and phone number here too
                    user = DeliveryPartner.objects.get(phone_number=phone, name=name)
                    return JsonResponse({
                        'message': 'OTP verified, login successful',
                        'phone_number': user.phone_number,
                        'name': user.name
                    })
                except DeliveryPartner.DoesNotExist:
                    return JsonResponse({'error': 'User not found with given name and phone'}, status=404)
            else:
                return JsonResponse({'error': 'Invalid OTP'}, status=400)
        except OTP.DoesNotExist:
            return JsonResponse({'error': 'OTP not found'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def create_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            phone = data.get('phone_number')
            total = data.get('total')
            delivery_status = data.get('delivery_status', 'placed')
            items = data.get('items', [])

            if not all([phone, total, delivery_status, items]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            user = CustomUser.objects.get(phone_number=phone)

            order = Order.objects.create(
                user=user,
                total_amount=Decimal(str(total)),
                delivery_status=delivery_status,
                delivery_address=user.address 
            )

            for item in items:
                OrderItem.objects.create(
                    order=order,
                    item_name=item.get('item_name') or item.get('name'),
                    quantity=item['quantity'],
                    price_per_item=Decimal(str(item.get('price_per_item') or item.get('price')))
                )
                
            # order payload for broadcasting
            order_payload = {
                "order_id": str(order.order_id),
                "placed_at": order.placed_at.isoformat(),
                "out_for_delivery_at": order.out_for_delivery_at.isoformat() if order.out_for_delivery_at else None,
                "delivery_time": order.delivery_time,
                "total_amount": str(order.total_amount),
                "delivery_status": order.delivery_status,
                "assigned_to": {
                    "id": order.assigned_to.id,
                    "name": order.assigned_to.name,
                    "phone_number": order.assigned_to.phone_number
                } if order.assigned_to else None,
                "user": {  # ✅ Include customer info
                    "name": order.user.name,
                    "phone_number": order.user.phone_number,
                    "address": order.user.address
                },
                "items": [{"name": it.item_name, "quantity": it.quantity, "price": str(it.price_per_item)} for it in order.items.all()],
                "delivery_address": order.user.address,
            }

            
             # Broadcast to unassigned orders group (partners listening)
            broadcast_to_group("orders_unassigned", "order_created", order_payload)
            # Also notify the user group (so user's UI can react)
            broadcast_to_group(f"user_{order.user.phone_number}", "order_updated", order_payload)

            return JsonResponse({
                'message': 'Order created successfully',
                'order_id': str(order.order_id)  # 👈 send order_id to frontend
            }, status=201)

        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)



@api_view(['GET'])
def user_order_history(request):
    phone = request.GET.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=400)

    try:
        user = CustomUser.objects.get(phone_number=phone)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    orders = Order.objects.filter(user=user).order_by('-placed_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def all_orders(request):
    """All placed orders (admin-level or for delivery panel overview)"""
    orders = Order.objects.all().order_by('-placed_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def unassigned_orders(request):
    """View orders that are not yet assigned to any delivery partner"""
    orders = Order.objects.filter(assigned_to__isnull=True).order_by('placed_at')
    serializer = OrderSerializer(orders, many=True)
    data = serializer.data

    # ✅ Add customer info to each order
    for i, order in enumerate(orders):
        data[i]['user'] = {
            "name": order.user.name,
            "phone_number": order.user.phone_number,
            "address": order.user.address
        }

    return Response(data)




@api_view(['GET'])
def assigned_orders(request):
    phone = request.GET.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=400)

    try:
        partner = DeliveryPartner.objects.get(phone_number=phone)
    except DeliveryPartner.DoesNotExist:
        return Response([], status=200)

    # Only return orders that are assigned and not delivered or cancelled
    orders = Order.objects.filter(
        assigned_to=partner,
        delivery_status__in=['assigned']  # Only show active/pending
    ).order_by('-placed_at')
    serializer = OrderSerializer(orders, many=True)
    data = serializer.data

    # ✅ Add customer info to each order
    for i, order in enumerate(orders):
        data[i]['user'] = {
            "name": order.user.name,
            "phone_number": order.user.phone_number,
            "address": order.user.address
        }

    return Response(data)


@api_view(['GET'])
def delivery_history(request):
    phone = request.GET.get('phone')
    if not phone:
        return Response({'error': 'Phone number is required'}, status=400)

    try:
        partner = DeliveryPartner.objects.get(phone_number=phone)
    except DeliveryPartner.DoesNotExist:
        return Response({'error': 'Delivery partner not found'}, status=404)

    # Fetch related delivery history records
    history = DeliveryHistory.objects.filter(delivery_partner=partner).select_related(
        "order", "delivery_partner"
    ).prefetch_related("order__items").order_by('-completed_at')

    data = []
    for h in history:
        order_items = []
        for item in h.order.items.all():
            order_items.append({
                'item_name': item.item_name,
                'quantity': item.quantity,
                'price_per_item': str(item.price_per_item)
            })

        data.append({
            'order_id': str(h.order.order_id),
            'delivery_status': 'delivered' if h.status == 'completed' else h.status,
            'completed_at': h.completed_at.isoformat() if h.completed_at else None,
            'earnings': str(h.earnings),
            'total_amount': str(h.order.total_amount),
            'assigned_to': {
                'name': h.delivery_partner.name,
                'phone_number': h.delivery_partner.phone_number
            },
            'user': {   # ✅ Include user info
                'name': h.order.user.name,
                'phone_number': h.order.user.phone_number,
                'address': h.order.user.address
            },
            'items': order_items
        })

    return Response(data, status=200)



@csrf_exempt
def update_delivery_partner_profile(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            phone = data.get('phone_number')

            if not phone:
                return JsonResponse({'error': 'Phone number is required'}, status=400)

            partner = DeliveryPartner.objects.get(phone_number=phone)

            partner.name = data.get('name', partner.name)
            partner.is_online = data.get('is_online', partner.is_online)
            partner.save()

            return JsonResponse({'message': 'Profile updated successfully'})
        except DeliveryPartner.DoesNotExist:
            return JsonResponse({'error': 'Delivery partner not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def register_delivery_partner(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            name = data.get('name', '').strip()
            phone_number = data.get('phone_number', '').strip()
            address = data.get('address', '').strip()

            if not all([name, phone_number, address]):
                return JsonResponse({'error': 'All fields are required'}, status=400)

            if not phone_number.isdigit() or len(phone_number) != 10:
                return JsonResponse({'error': 'Invalid phone number'}, status=400)

            if DeliveryPartner.objects.filter(phone_number=phone_number).exists():
                return JsonResponse({'error': 'Phone number already registered'}, status=400)

            DeliveryPartner.objects.create(
                name=name,
                phone_number=phone_number,
                address=address
            )

            return JsonResponse({'message': 'Delivery partner registered successfully'})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


from django.http import JsonResponse
from .models import Order

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order

from uuid import UUID
@csrf_exempt
def get_order_status(request, order_id):
    """
    Return current status of a specific order along with delivery partner info if assigned.
    """
    if request.method == 'GET':
        try:
            UUID(order_id)
        except ValueError:
            return JsonResponse({'error': 'Invalid order ID'}, status=400)
        try:
            order = Order.objects.get(order_id=order_id)

            order_data = {
                "order_id": str(order.order_id),
                "delivery_status": order.delivery_status,
                "total_amount": str(order.total_amount),
                "placed_at": order.placed_at.isoformat(),
                "delivery_time": order.delivery_time,
                "assigned_to": {
                    "id": order.assigned_to.id,
                    "name": order.assigned_to.name,
                    "phone_number": order.assigned_to.phone_number,
                } if order.assigned_to else None,
                "items": [
                    {
                        "item_name": it.item_name,
                        "quantity": it.quantity,
                        "price_per_item": str(it.price_per_item),
                    }
                    for it in order.items.all()
                ]
                
            }

            return JsonResponse(order_data, safe=False)

        except Order.DoesNotExist:
            return JsonResponse({"error": "Order not found"}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



@api_view(['PATCH'])
def update_order_status(request, order_id):
    order = get_object_or_404(Order, order_id=order_id)
    status = request.data.get("status", "")
    phone_number = request.data.get("phone_number")

    # Clean and log status
    status = status.strip().lower()
    print("Received status:", repr(status))

    valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
    if not status:
        return Response({"error": "'status' is required."}, status=400)
    if status not in valid_statuses:
        return Response({"error": f"Invalid status. Must be one of {valid_statuses}"}, status=400)

    # -----------------
    # ASSIGN ORDER
    # -----------------
    if status == "assigned":
        if not phone_number:
            return Response({"error": "'phone_number' is required to assign order."}, status=400)
        partner = get_object_or_404(DeliveryPartner, phone_number=phone_number)
        order.assigned_to = partner
        order.assigned_at = timezone.now()
        order.delivery_status = status
        order.save()

    # -----------------
    # DELIVERED ORDER
    # -----------------
    elif status == "delivered":
        if not DeliveryHistory.objects.filter(order=order, status="completed").exists():
            DeliveryHistory.objects.create(
                delivery_partner=order.assigned_to,
                order=order,
                completed_at=timezone.now(),
                status="completed",
                earnings=order.total_amount * Decimal(0.1)  # ✅ 10% earnings example
            )

    # -----------------
    # CANCELLED ORDER
    # -----------------
    elif status == "cancelled":
        partner = order.assigned_to
        if partner and not DeliveryHistory.objects.filter(order=order, status="cancelled").exists():
            DeliveryHistory.objects.create(
                delivery_partner=partner,
                order=order,
                completed_at=timezone.now(),
                status="cancelled",
                earnings=0
            )

    # -----------------
    # UPDATE ORDER STATUS
    # -----------------
    order.delivery_status = status
    order.save()

    # Serialize full order (including assigned_to info)
    # Serialize full order (including assigned_to info)
    serializer = OrderSerializer(order)

    data = serializer.data
    data["delivery_address"] = order.user.address
    data["user"] = {   # ✅ Add full customer info
        "name": order.user.name,
        "phone_number": order.user.phone_number,
        "address": order.user.address
    }



   # Broadcast to user
    broadcast_to_group(f"user_{order.user.phone_number}", "order_updated", data)

    # Broadcast to groups
    broadcast_to_group("orders", "order_updated", data)
    if order.assigned_to is None:
        broadcast_to_group("orders_unassigned", "order_updated", data)

    print("Order Updated:", data)  # Debug log

    # ✅ Return the data including 'user'
    return Response({"success": True, "order": data})


