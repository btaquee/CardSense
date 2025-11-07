# Most of the code is AI generated in this file
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from .models import Card, RewardRule, UserCard, CardBenefit
from .serializers import CardSerializer, RewardRuleSerializer, UserCardSerializer, CardBenefitSerializer

# Create your views here.
# Check API health
class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class CardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Card.objects.all().order_by("issuer", "name")
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

class RewardRuleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RewardRule.objects.select_related("card").all()
    serializer_class = RewardRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserCardViewSet(viewsets.ModelViewSet):
    serializer_class = UserCardSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return UserCard.objects.select_related("card").filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CardBenefitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CardBenefit.objects.select_related("card").all()
    serializer_class = CardBenefitSerializer
    permission_classes = [permissions.IsAuthenticated]