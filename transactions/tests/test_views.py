from decimal import Decimal
from datetime import timedelta
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
from django.test import TestCase
from django.utils import timezone
from transactions.models import Transaction
from transactions.views import HealthCheckView, TransactionViewSet
from cards.models import Card

'''
Expectations
------------
HealthCheckView
- GET always returns 200 OK and {"status": "ok"}.
- No authentication required.

TransactionViewSet
- Requires authentication for all actions.
- GET /list returns only transactions belonging to the authenticated user.
- Returned list is ordered by created_at descending.
- POST automatically sets 'user' to request.user (ignores any 'user' in payload).
- Anonymous users get 401/403 for any endpoint.
- PATCH/DELETE limited to the owner’s transactions; cannot access others’.
'''


User = get_user_model()

class TestHealthCheck(TestCase):
    def test_health_ok(self):
        rf = APIRequestFactory()
        req = rf.get("/api/transactions/health/")
        resp = HealthCheckView.as_view()(req)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data, {"status": "ok"})


class TestTransactionViewSet(TestCase):
    def setUp(self):
        self.rf = APIRequestFactory()
        self.user1 = User.objects.create_user(username="a", email="a@e.com", password="pw")
        self.user2 = User.objects.create_user(username="b", email="b@e.com", password="pw")
        self.card = Card.objects.create(name="Freedom", issuer="CHASE", annual_fee=0, ftf=True)

    def _create_tx(self, user, amount, merchant, created_at=None):
        """helper to seed transactions with controlled created_at ordering"""
        t = Transaction.objects.create(
            user=user,
            card=self.card,
            amount=Decimal(amount),
            merchant=merchant,
            category="DINING",
        )
        if created_at:
            # Update created_at after creation for precise ordering control
            Transaction.objects.filter(id=t.id).update(created_at=created_at)
            t.refresh_from_db()
        return t

    def test_requires_authentication(self):
        view = TransactionViewSet.as_view({"get": "list"})
        req = self.rf.get("/api/transactions/")
        resp = view(req)
        self.assertIn(resp.status_code, (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN))

    def test_list_returns_only_current_user_sorted(self):
        # Create transactions with explicit timestamps to ensure ordering
        now = timezone.now()
        self._create_tx(self.user1, "5.00", "A", created_at=now)
        self._create_tx(self.user1, "9.00", "B", created_at=now + timedelta(seconds=1))
        self._create_tx(self.user2, "11.00", "C")
        view = TransactionViewSet.as_view({"get": "list"})
        req = self.rf.get("/api/transactions/")
        force_authenticate(req, self.user1)
        resp = view(req)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        merchants = [row["merchant"] for row in resp.data]
        self.assertEqual(merchants, ["B", "A"])  # newest first

    def test_create_auto_assigns_user_and_saves(self):
        view = TransactionViewSet.as_view({"post": "create"})
        payload = {
            "card": self.card.id,
            "amount": "15.00",
            "merchant": "Target",
            "category": "GROCERIES",
            "user": self.user2.id,  # should be ignored
        }
        req = self.rf.post("/api/transactions/", payload, format="json")
        force_authenticate(req, self.user1)
        resp = view(req)
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        t = Transaction.objects.get(id=resp.data["id"])
        self.assertEqual(t.user, self.user1)
        self.assertEqual(t.merchant, "Target")

    def test_user_cannot_access_others_transaction(self):
        # belongs to user2
        t = self._create_tx(self.user2, "8.50", "Chipotle")
        # try retrieving as user1
        view = TransactionViewSet.as_view({"get": "retrieve"})
        req = self.rf.get(f"/api/transactions/{t.id}/")
        force_authenticate(req, self.user1)
        resp = view(req, pk=t.id)
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_own_transaction_allowed(self):
        t = self._create_tx(self.user1, "12.00", "Walmart")
        view = TransactionViewSet.as_view({"delete": "destroy"})
        req = self.rf.delete(f"/api/transactions/{t.id}/")
        force_authenticate(req, self.user1)
        resp = view(req, pk=t.id)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Transaction.objects.filter(id=t.id).exists())

# To run the tests:
# python manage.py test transactions.tests.test_views