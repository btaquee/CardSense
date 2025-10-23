from rest_framework import serializers
from .models import Card, RewardRule, UserCard, CardBenefit

class RewardRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardRule
        fields = ("id", "multiplier", "category", "cap_amount", "notes")

class CardBenefitSerializer(serializers.ModelSerializer):
    card = serializers.StringRelatedField(read_only=True)
    benefits = serializers.SerializerMethodField()

    class Meta:
        model = CardBenefit
        fields = ("id", "card", "benefits")

    # AI generated function
    def get_benefits(self, obj):
        """
        Convert the `benefits` text field to a JSON list,
        splitting by comma. Strips whitespace, skips empty values.
        """
        if not obj.benefits:
            return []
        # Split by comma, strip whitespace, exclude empty
        items = [item.strip() for item in obj.benefits.split(",") if item.strip()]
        return items

class CardSerializer(serializers.ModelSerializer):
    reward_rules = RewardRuleSerializer(many=True, read_only=True)
    benefits = CardBenefitSerializer(many=True, read_only=True)
    class Meta:
        model = Card
        fields = ("id", "issuer", "name", "annual_fee", "ftf", "reward_rules", "benefits")
        
class UserCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCard
        fields = ("id", "card", "notes", "is_active")
        read_only_fields = ()
