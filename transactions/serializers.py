from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ("id", "card", "merchant", "amount", "category", "created_at", "updated_at", "notes")
        read_only_fields = ("user", "created_at", "updated_at")