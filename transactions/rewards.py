"""
Rewards calculation service for transactions.
Calculates cashback/points based on card reward rules and transaction categories.
"""
from decimal import Decimal
from cards.models import RewardRule


def calculate_transaction_reward(transaction):
    """
    Calculate the reward earned for a single transaction.
    
    Args:
        transaction: Transaction object with card, amount, and category
    
    Returns:
        Decimal: Reward amount earned (in dollars/cashback)
    """
    if not transaction.card or not transaction.category:
        return Decimal('0.00')
    
    # Get matching reward rules for this card and category
    reward_rules = RewardRule.objects.filter(card=transaction.card)
    
    best_multiplier = Decimal('0.00')
    
    for rule in reward_rules:
        # Check if transaction category matches rule category
        # rule.category can be a string or comma-separated list from MultiSelectField
        categories = rule.category
        if isinstance(categories, str):
            categories = [cat.strip() for cat in categories.split(',')]
        
        if transaction.category in categories:
            if rule.multiplier and rule.multiplier > best_multiplier:
                best_multiplier = rule.multiplier
    
    # Calculate reward: amount × multiplier ÷ 100 (if multiplier is percentage)
    # Most cards use percentage (e.g., 3% back = multiplier of 3.00)
    reward = (transaction.amount * best_multiplier) / Decimal('100')
    
    return reward.quantize(Decimal('0.01'))


def calculate_total_rewards(user, start_date=None, end_date=None):
    """
    Calculate total rewards earned by a user across all transactions.
    
    Args:
        user: User object
        start_date: Optional start date filter
        end_date: Optional end date filter
    
    Returns:
        Decimal: Total rewards earned
    """
    from transactions.models import Transaction
    
    transactions = Transaction.objects.filter(user=user)
    
    if start_date:
        transactions = transactions.filter(created_at__gte=start_date)
    if end_date:
        transactions = transactions.filter(created_at__lte=end_date)
    
    total_rewards = Decimal('0.00')
    
    for transaction in transactions:
        total_rewards += calculate_transaction_reward(transaction)
    
    return total_rewards.quantize(Decimal('0.01'))


def calculate_rewards_by_card(user, start_date=None, end_date=None):
    """
    Calculate rewards earned per card for a user.
    
    Args:
        user: User object
        start_date: Optional start date filter
        end_date: Optional end date filter
    
    Returns:
        dict: {card_id: reward_amount}
    """
    from transactions.models import Transaction
    
    transactions = Transaction.objects.filter(user=user)
    
    if start_date:
        transactions = transactions.filter(created_at__gte=start_date)
    if end_date:
        transactions = transactions.filter(created_at__lte=end_date)
    
    rewards_by_card = {}
    
    for transaction in transactions:
        card_id = transaction.card.id
        reward = calculate_transaction_reward(transaction)
        
        if card_id in rewards_by_card:
            rewards_by_card[card_id] += reward
        else:
            rewards_by_card[card_id] = reward
    
    return rewards_by_card

