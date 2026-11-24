from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Location, Gate, Department, Employee, Visitor, AuditLog, RecycleRecord, BackupRecord
from .serializers import (
    UserSerializer, LocationSerializer, GateSerializer, DepartmentSerializer,
    EmployeeSerializer, VisitorSerializer, AuditLogSerializer, RecycleRecordSerializer,
    BackupRecordSerializer
)

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all().order_by('-created_at')
    serializer_class = VisitorSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def currently_inside(self, request):
        inside = self.queryset.filter(status='CHECKED_IN')
        serializer = self.get_serializer(inside, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        visitor = self.get_object()
        visitor.status = 'CHECKED_IN'
        visitor.save()
        return Response({'status': 'CHECKED_IN', 'visitor': self.get_serializer(visitor).data})

    @action(detail=True, methods=['post'])
    def check_out(self, request, pk=None):
        visitor = self.get_object()
        visitor.status = 'CHECKED_OUT'
        visitor.save()
        return Response({'status': 'CHECKED_OUT', 'visitor': self.get_serializer(visitor).data})

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

class GateViewSet(viewsets.ModelViewSet):
    queryset = Gate.objects.all()
    serializer_class = GateSerializer
    permission_classes = [permissions.AllowAny]

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.AllowAny]

class RecycleRecordViewSet(viewsets.ModelViewSet):
    queryset = RecycleRecord.objects.all().order_by('-deleted_at')
    serializer_class = RecycleRecordSerializer
    permission_classes = [permissions.AllowAny]

class BackupRecordViewSet(viewsets.ModelViewSet):
    queryset = BackupRecord.objects.all().order_by('-timestamp')
    serializer_class = BackupRecordSerializer
    permission_classes = [permissions.AllowAny]
