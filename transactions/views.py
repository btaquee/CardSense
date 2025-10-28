from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer
from rest_framework import viewsets, permissions

# Create your views here.
# Check API health
class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class TransactionViewSet(viewsets.ModelViewSet):
    # queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # AI help me understand the concept of two functions below, what is does in detail
    
    # Records the API should return when a user make a GET request
    # No filter. Will return all transactions for that user, sorted by created_at in descending order
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by("-created_at")

    # Saves the transaction to the database
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)