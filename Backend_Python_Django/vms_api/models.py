from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('receptionist', 'Receptionist'),
        ('security', 'Security Guard'),
        ('employee', 'Employee Host'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    department = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    online_status = models.BooleanField(default=True)

class Location(models.Model):
    name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    manager_name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='Active')
    gate_count = models.IntegerField(default=1)
    visitors_today = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Gate(models.Model):
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('BUSY', 'Busy'),
        ('CLOSED', 'Closed'),
    )
    name = models.CharField(max_length=150)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='gates')
    gate_type = models.CharField(max_length=50, default='Main Entrance')
    security_officer = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='OPEN')
    visitors_today = models.IntegerField(default=0)
    currently_inside = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.location.name})"

class Department(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    icon_name = models.CharField(max_length=50, default='Building')
    color = models.CharField(max_length=30, default='indigo')
    head_name = models.CharField(max_length=100)
    employee_count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Employee(models.Model):
    employee_id = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    designation = models.CharField(max_length=100)
    avatar_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, default='Active')
    visitors_count_today = models.IntegerField(default=0)
    location = models.CharField(max_length=150, default='Tower A - Floor 8')

    def __str__(self):
        return self.full_name

class Visitor(models.Model):
    STATUS_CHOICES = (
        ('CHECKED_IN', 'Checked In'),
        ('CHECKED_OUT', 'Checked Out'),
        ('PENDING', 'Pending Approval'),
        ('REJECTED', 'Rejected'),
        ('EXPECTED', 'Expected'),
    )
    visitor_code = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30)
    company = models.CharField(max_length=150)
    category = models.CharField(max_length=50, default='Client')
    photo_url = models.URLField(blank=True, null=True)
    id_type = models.CharField(max_length=50, default='National ID')
    id_number = models.CharField(max_length=50)
    vehicle_number = models.CharField(max_length=30, blank=True, null=True)
    vehicle_type = models.CharField(max_length=20, default='None')
    purpose = models.TextField()
    host_employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, related_name='hosted_visitors')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='department_visitors')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    gate = models.ForeignKey(Gate, on_delete=models.SET_NULL, null=True, blank=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    expected_duration = models.CharField(max_length=30, default='2 hours')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_vip = models.BooleanField(default=False)
    is_blacklisted = models.BooleanField(default=False)
    badge_number = models.CharField(max_length=30, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.company})"

class AuditLog(models.Model):
    user = models.CharField(max_length=100)
    user_role = models.CharField(max_length=20)
    action = models.CharField(max_length=100)
    entity = models.CharField(max_length=50)
    entity_id = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField()
    location = models.CharField(max_length=100)

class RecycleRecord(models.Model):
    entity_type = models.CharField(max_length=50)
    entity_name = models.CharField(max_length=150)
    deleted_by = models.CharField(max_length=100)
    deleted_at = models.DateTimeField(auto_now_add=True)
    reason = models.TextField()
    original_data = models.JSONField()

class BackupRecord(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    size = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default='Successful')
    created_by = models.CharField(max_length=100)
