from django.contrib import admin
from .models import Card, RewardRule, UserCard

# Register your models here.
# admin.site.register(Card)
# admin.site.register(RewardRule)
# admin.site.register(UserCard)

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("issuer", "name", "annual_fee", "ftf", "coupon_name", "coupon_amount", "coupon_description", "coupon_frequency")
    fields = ("name", "issuer", "annua-l_fee", "ftf", "coupon_name", "coupon_amount", "coupon_description", "coupon_frequency")

@admin.register(RewardRule)
class RewardRuleAdmin(admin.ModelAdmin):
    list_display = ("card", "category", "multiplier", "cashback_percent", "cap_amount")
    fields = ("card", "category", "multiplier", "cashback_percent", "cap_amount")

@admin.register(UserCard)
class UserCardAdmin(admin.ModelAdmin):
    list_display = ("user", "card","is_active", "notes")
    fields = ("card", "user", "is_active", "notes")