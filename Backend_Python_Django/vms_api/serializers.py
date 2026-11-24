from rest_framework import serializers
from .models import User, Location, Gate, Department, Employee, Visitor, AuditLog, RecycleRecord, BackupRecord

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'location', 'avatar', 'online_status']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class GateSerializer(serializers.ModelSerializer):
    location_name = serializers.ReadOnlyField(source='location.name')

    class Meta:
        model = Gate
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = Employee
        fields = '__all__'

class VisitorSerializer(serializers.ModelSerializer):
    host_name = serializers.ReadOnlyField(source='host_employee.full_name')
    department_name = serializers.ReadOnlyField(source='department.name')
    location_name = serializers.ReadOnlyField(source='location.name')
    gate_name = serializers.ReadOnlyField(source='gate.name')

    class Meta:
        model = Visitor
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'

class RecycleRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecycleRecord
        fields = '__all__'

class BackupRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackupRecord
        fields = '__all__'
