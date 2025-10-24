# optimizer/services.py
from decimal import Decimal
from cards.models import RewardRule, UserCard, Card

SELECTED = "SELECTED_CATEGORIES"
BASE_ANYWHERE = "OTHER"
BIG = Decimal("1000000000")  # treat None cap as "very large"

def _rank(items):
    # items: list of (card, multiplier_float, cap_or_BIG)
    # Sort by: higher multiplier → higher cap → lower annual fee → issuer/name
    items.sort(
        key=lambda t: (t[1], t[2], -float(t[0].annual_fee or 0), t[0].issuer, t[0].name),
        reverse=True,
    )

    # Best card = first after sort
    best_card, best_mult, _ = items[0]

    # Collect other cards that tie with the best multiplier (exclude best itself)
    ties = [
        (c, m, cap)
        for (c, m, cap) in items[1:]  # skip the best one
        if m == best_mult
    ][:2]  # +2 because we already have one best → total 3 max

    # Prepare top3 list = alternatives (no duplication of the best card)
    top3 = [
        {"card_id": c.id, "card_name": f"{c.issuer} {c.name}", "multiplier": m}
        for (c, m, _cap) in ties
    ]

    return best_card, best_mult, top3


def best_cards_for_category(category_tag: str, user) -> dict:
    # 0) user's active cards
    my_card_ids = list(
        UserCard.objects.filter(user=user, is_active=True).values_list("card_id", flat=True)
    )
    if not my_card_ids:
        return {
            "best_card": None,
            "multiplier": 1.0,
            "rationale": "You have no active cards. Showing baseline 1.0× recommendation.",
            "top3": [],
        }

    # 1) exact category among user's cards
    qs = (
        RewardRule.objects
        .exclude(category__contains=SELECTED)
        .filter(category__contains=category_tag, card_id__in=my_card_ids)
        .select_related("card")
    )
    primary = []
    for r in qs:
        m = float(r.multiplier or 0)
        cap = r.cap_amount if r.cap_amount is not None else BIG
        primary.append((r.card, m, cap))

    if primary:
        best_card, best_mult, top3 = _rank(primary)
        return {
            "best_card": {"card_id": best_card.id, "card_name": f"{best_card.issuer} {best_card.name}"},
            "multiplier": best_mult,
            "rationale": f"{best_mult}× on {category_tag} (from your wallet).",
            "top3": top3,
        }

    # 2) fallback: use only each card's base/anywhere rate (OTHER)
    alt_qs = (
        RewardRule.objects
        .exclude(category__contains=SELECTED)
        .filter(card_id__in=my_card_ids, category__contains=BASE_ANYWHERE)
        .select_related("card")
    )

    # pick the best OTHER rule per card (dedupe by card)
    by_card = {}
    for r in alt_qs:
        c = r.card
        m = float(r.multiplier or 0)
        cap = r.cap_amount if r.cap_amount is not None else BIG
        cur = by_card.get(c.id)
        if cur is None or (m, cap) > (cur[1], cur[2]):
            by_card[c.id] = (c, m, cap)

    if by_card:
        items = list(by_card.values())
        best_card, best_mult, top3 = _rank(items)
        return {
            "best_card": {"card_id": best_card.id, "card_name": f"{best_card.issuer} {best_card.name}"},
            "multiplier": best_mult,
            "rationale": (
                f"No {category_tag} bonus among your cards. "
                f"Showing your best base rate (OTHER): {best_mult}×."
            ),
            "top3": top3,
        }

    # 3) final fallback: baseline 1.0× on lowest-AF card
    any_card = (
        Card.objects.filter(id__in=my_card_ids).order_by("annual_fee", "issuer", "name").first()
    )
    return {
        "best_card": (
            {"card_id": any_card.id, "card_name": f"{any_card.issuer} {any_card.name}"}
            if any_card else None
        ),
        "multiplier": 1.0,
        "rationale": (
            f"No base (OTHER) rates found for your cards. Showing baseline 1.0×"
            f"{' on ' + any_card.name if any_card else ''}."
        ),
        "top3": [],
    }
