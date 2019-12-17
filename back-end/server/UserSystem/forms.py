from django import forms


class AvatarForm(forms.Form):
    img = forms.ImageField(label='img')
