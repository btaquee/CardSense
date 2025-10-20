from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

# Card base info
class Card(models.Model):
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    annual_fee = models.DecimalField(max_digits=3, decimal_places=0)
    ftf = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.issuer + " " + self.name

# Reward rules for a card
class RewardRule(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='reward_rules')
    category = models.CharField(max_length=255)
    multiplier = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    cashback_percent = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True)
    cap_amount = models.DecimalField(max_digits=5, decimal_places=0, null=True, blank=True)

    def __str__(self):
        if self.multiplier:
            return f"{self.multiplier}x on {self.category} for {self.card}"
        elif self.cashback_percent:
            return f"{self.cashback_percent}% on {self.category} for {self.card}"
        return f"1x on {self.category} (everything else) for {self.card}"

    def clean(self):
        if bool(self.multiplier) and bool(self.cashback_percent):
            raise ValidationError("Only one of multiplier or cashback percent can be set")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['card', 'category'], name='unique_card_category')
        ]