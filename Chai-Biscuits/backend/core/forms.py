from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('name', 'phone_number', 'address', 'is_customer', 'is_delivery_partner', 'is_active')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_unusable_password()  # This ensures the user can't login
        if commit:
            user.save()
        return user


class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = '__all__'
