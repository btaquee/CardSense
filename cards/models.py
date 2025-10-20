from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# Create your models here.

# Card base fixed info
class Card(models.Model):
    ISSUER_CHOICES = [
        ("BANK OF AMERICA", "Bank of America"),
        ("CHASE", "Chase"),
        ("AMEX", "American Express"),
        ("CITI", "Citi"),
        ("CAPITALONE", "Capital One"),
        ("DISCOVER", "Discover"),
        ("USBANK", "US Bank"),
        ("WELLS FARGO", "Wells Fargo"),
        ("OTHER", "Other"),
    ]
    
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255, choices=ISSUER_CHOICES)
    annual_fee = models.DecimalField("Annual Fee ($)", max_digits=3, decimal_places=0)
    ftf = models.BooleanField("Foreign Transaction Fee", default=True)

    # Coupons
    coupon_name = models.CharField("Coupon Name", max_length=100, blank=True, null=True)
    coupon_amount = models.DecimalField("Coupon Value ($)", max_digits=7, decimal_places=2, blank=True, null=True)
    coupon_description = models.TextField("Coupon Description", blank=True, null=True)
    coupon_frequency = models.CharField(
        "Coupon Frequency",
        max_length=20,
        choices=[
            ("ONCE", "One-time"),
            ("MONTHLY", "Monthly"),
            ("ANNUAL", "Annual"),
        ],
        blank=True,
        null=True,
    )


    def __str__(self):
        return self.issuer + " " + self.name

# User can add info to a card
class UserCard(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='user_cards')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_cards")
    is_active = models.BooleanField("Active", default=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "card"], name="uniq_user_card")
        ]

    def __str__(self):
        return f"{self.user.username} → {self.card.name}"

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


# Run server
# python manage.py runserver