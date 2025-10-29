from django.db import models
from django.conf import settings
from cards.models import Card, RewardRule

# Create your models here.


class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions")
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="transactions")
    merchant = models.CharField(max_length=255)
    amount = models.DecimalField("Amount ($)", max_digits=10, decimal_places=2)
    category = models.CharField(max_length=255, choices=RewardRule.CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)