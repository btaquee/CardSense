from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer, TransactionCSVRowSerializer
from rest_framework import viewsets, permissions
import csv
import io


class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # AI help me understand the concept of two functions below, what is does in detail
    
    # Records the API should return when a user makes a GET request
    # No filter. Will return all transactions for that user, sorted by created_at in descending order
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related('card').order_by("-created_at")

    # Saves the transaction to the database
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionCSVImportView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def post(self, request):
        if 'file' not in request.FILES:
            return Response(
                {"detail": "No file uploaded under 'file'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        uploaded_file = request.FILES['file']
        
        try:
            file_content = uploaded_file.read().decode('utf-8')
        except UnicodeDecodeError as e:
            return Response(
                {"detail": f"File encoding error: {str(e)}. Please ensure the file is UTF-8 encoded."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            csv_reader = csv.DictReader(io.StringIO(file_content))
        except Exception as e:
            return Response(
                {"detail": f"CSV parsing error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        imported_count = 0
        failed_count = 0
        results = []
        
        for row_num, row_data in enumerate(csv_reader, start=2):
            serializer = TransactionCSVRowSerializer(
                data=row_data,
                context={"user": request.user}
            )
            
            if serializer.is_valid():
                try:
                    transaction = serializer.save()
                    results.append({
                        "row": row_num,
                        "status": "imported",
                        "transaction_id": transaction.id
                    })
                    imported_count += 1
                except Exception as e:
                    results.append({
                        "row": row_num,
                        "status": "error",
                        "errors": {"non_field_errors": [str(e)]}
                    })
                    failed_count += 1
            else:
                results.append({
                    "row": row_num,
                    "status": "error",
                    "errors": serializer.errors
                })
                failed_count += 1
        
        return Response({
            "imported_count": imported_count,
            "failed_count": failed_count,
            "results": results
        }, status=status.HTTP_200_OK)