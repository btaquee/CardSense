from django.contrib import admin
from .models import Card, RewardRule, UserCard

# Register your models here.

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("issuer", "name", "annual_fee", "ftf")
    fields = ("name", "issuer", "annual_fee", "ftf")

@admin.register(RewardRule)
class RewardRuleAdmin(admin.ModelAdmin):
    list_display = ("card", "category", "multiplier", "cashback_percent", "cap_amount")
    fields = ("card", "category", "multiplier", "cashback_percent", "cap_amount")

@admin.register(UserCard)
class UserCardAdmin(admin.ModelAdmin):
    list_display = ("user", "card","is_active", "notes")
    fields = ("card", "user", "is_active", "notes")