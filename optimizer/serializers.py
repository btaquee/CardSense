from rest_framework import serializers
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from .models import UserCategorySelection

class UserCategorySelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCategorySelection
        fields = ("id", "user", "category_tag")
        read_only_fields = ("user",)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        try:
            return super().create(validated_data)
        except IntegrityError:
            # Handle the case where the combination already exists
            raise ValidationError({
                'category_tag': 'You have already selected this category.'
            })
