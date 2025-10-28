from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns = [
    path('health/', views.HealthCheckView.as_view(), name='health'),
]