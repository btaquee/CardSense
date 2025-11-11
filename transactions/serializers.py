from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ("id", "card", "merchant", "amount", "category", "created_at", "updated_at", "notes")
        read_only_fields = ("id", "user", "created_at", "updated_at")
    
    # Amount cannot be negative
    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Amount cannot be negative.")
        return value