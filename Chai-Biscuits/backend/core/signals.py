from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, DeliveryPartner

@receiver(post_save, sender=CustomUser)
def create_delivery_partner(sender, instance, created, **kwargs):
    if instance.is_delivery_partner:
        DeliveryPartner.objects.get_or_create(
            user=instance,
            defaults={
                "name": instance.name,
                "phone_number": instance.phone_number
            }
        )
