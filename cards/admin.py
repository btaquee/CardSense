from django.contrib import admin
from .models import Card, RewardRule, UserCard, CardBenefit

# Register your models here.
# admin.site.register(Card)
# admin.site.register(RewardRule)
# admin.site.register(UserCard)

@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ("issuer", "name", "annual_fee", "ftf")
    fields = ("name", "issuer", "annual_fee", "ftf")
    ordering = ["issuer", "name"]

@admin.register(RewardRule)
class RewardRuleAdmin(admin.ModelAdmin):
    list_display = ("card", "multiplier", "get_categories", "cap_amount", "notes")
    fields = ("card", "multiplier", "category", "cap_amount", "notes")
    ordering = ["card", "-multiplier"]
    
    def get_categories(self, obj):
        """Display categories in a more readable format"""
        if obj.category:
            # Get the choice labels instead of raw values
            choice_dict = dict(RewardRule.CATEGORY_CHOICES)
            
            # MultiSelectField stores as a comma-separated string
            categories = obj.category if isinstance(obj.category, list) else obj.category.split(',')
            # Convert raw values to human-readable labels
            readable_categories = [choice_dict.get(cat.strip(), cat.strip()) for cat in categories]
            return ", ".join(readable_categories)
        return "-"
    get_categories.short_description = "Categories"


@admin.register(UserCard)
class UserCardAdmin(admin.ModelAdmin):
    list_display = ("user", "card","is_active", "notes")
    fields = ("card", "user", "is_active", "notes")

@admin.register(CardBenefit)
class CardBenefitAdmin(admin.ModelAdmin):
    list_display = ("card", "name", "amount", "get_categories", "description", "frequency")
    fields = ("card", "name", "amount", "category", "description", "frequency")
    ordering = ["card", "name"]
    
    def get_categories(self, obj):
        """Display categories in a more readable format"""
        if obj.category:
            # Convert the stored format to readable format
            categories = obj.category if isinstance(obj.category, list) else [obj.category]
            return ", ".join(categories)
        return "-"

    get_categories.short_description = "Categories"