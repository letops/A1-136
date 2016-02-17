from MainAPP import models
from rest_framework import serializers


class FullSafeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = (
            'id',
            'username',
            'nickname',
            'first_name',
            'last_name',
            'email',
            'avatar',
            'birthday',
            'description',
            'gender',
            'edition_date',
            'is_active',
            'is_staff',
            'is_superuser',
        )
