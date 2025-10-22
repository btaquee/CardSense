from rest_framework import serializers
from .models import Card, RewardRule, UserCard, CardBenefit

class RewardRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardRule
        fields = ("id", "multiplier", "category", "cap_amount", "notes")

class CardBenefitSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardBenefit
        fields = ("id", "card", "name", "amount", "category", "description", "frequency")

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
