from django.shortcuts import render
# from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response






# Create your views here.
# def HomePage(request):
#     return HttpResponse("Welcome to the Home Page!")

# Check API health
class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"})