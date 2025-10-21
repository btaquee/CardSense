from django.db import models
from django.conf import settings
from multiselectfield import MultiSelectField

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
    annual_fee = models.DecimalField("Annual Fee ($)", max_digits=4, decimal_places=0)
    ftf = models.BooleanField("Foreign Transaction Fee", default=True)

    def __str__(self):
        return f"{self.issuer} {self.name}"

# A card can have many coupons
class CardBenefit(models.Model):

    BENEFIT_CATEGORY = [
        ("GENERAL", "General"),
        ("DINING", "Dining"),
        ("GROCERIES", "Groceries"),
        ("TRAVEL", "Travel"),
        ("ENTERTAINMENT", "Entertainment"),
        ("OTHER", "Other"),
    ]

    FREQUENCY_CHOICES = [
        ("ONCE", "One-time"),
        ("MONTHLY", "Monthly"),
        ("ANNUAL", "Annual"),
        ("EVERY_4_5_YEARS", "Every 4/5 Years"),
    ]

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="benefits")
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=5, decimal_places=0, null=True, blank=True)
    category = models.CharField(max_length=255, choices=BENEFIT_CATEGORY, default=None)
    description = models.TextField(blank=True, null=True, default=None)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default=None)
    
    def __str__(self):
        return f"{self.name} ({self.card.name})"



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

    CATEGORY_CHOICES = [
        ("SELECTED_CATEGORIES", "Selected Categories"),
        ("RENT", "Rent"),
        ("ONLINE_SHOPPING", "Online Shopping"),
        ("DINING", "Dining"),
        ("GROCERIES", "Groceries"),
        ("PHARMACY", "Pharmacy"),
        ("GAS", "Gas"),
        ("GENERAL_TRAVEL", "General Travel"),
        ("AIRLINE_TRAVEL", "Airline Travel"),
        ("HOTEL_TRAVEL", "Hotel Travel"),
        ("TRANSIT", "Transit"),
        ("ENTERTAINMENT", "Entertainment"),
        ("OTHER", "Other"),
    ]

    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='reward_rules')
    multiplier = models.DecimalField("Multiplier (x or %)", max_digits=5, decimal_places=2, default=None)
    category = MultiSelectField(
        "Categories",
        max_length=255,
        choices=CATEGORY_CHOICES,
        max_choices=len(CATEGORY_CHOICES),
    )
    cap_amount = models.DecimalField("Cap Amount (annual $)", max_digits=6, decimal_places=0, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    # class Meta:
    #     pass