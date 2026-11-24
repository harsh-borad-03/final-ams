from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    VisitorViewSet, EmployeeViewSet, DepartmentViewSet, LocationViewSet,
    GateViewSet, AuditLogViewSet, RecycleRecordViewSet, BackupRecordViewSet
)

router = DefaultRouter()
router.register(r'visitors', VisitorViewSet, basename='visitor')
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'gates', GateViewSet, basename='gate')
router.register(r'audit-logs', AuditLogViewSet, basename='auditlog')
router.register(r'recycle-bin', RecycleRecordViewSet, basename='recyclerecord')
router.register(r'backups', BackupRecordViewSet, basename='backuprecord')

urlpatterns = [
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
