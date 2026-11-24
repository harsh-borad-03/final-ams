export type UserRole = 'Super Admin' | 'Security' | 'Employee' | string;

export type VisitorStatus = 'Pending' | 'Approved' | 'Rejected' | 'Visited' | 'In Premise' | 'CHECKED_IN' | 'CHECKED_OUT' | 'EXPECTED' | 'EXPIRED' | string;
export type VisitPurpose = 'Delivery Personnel' | 'Emergency Services' | 'Guest' | 'Vendor' | string;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  password?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  department?: string;
  phone?: string;
  createdAt?: string;
  accountStatus?: string;
  employeeId?: string;
  activeSessionsCount?: number;
  lastLogin?: string;
  designation?: string;
  approvedBy?: string;
  rejectionReason?: string;
  rejectedBy?: string;
  onlineStatus?: boolean | string;
  location?: string;
  registrationDate?: string;
}

export interface Visitor {
  id: string;
  passCode: string; // e.g. VP-2026-5775
  fullName: string;
  phone: string;
  email: string;
  purpose: VisitPurpose;
  address: string;
  idProofType?: 'Aadhaar Card' | 'Driving License' | 'Passport' | 'PAN Card' | 'Voter ID' | string;
  idNumber?: string;
  company: string;
  hostName: string;
  hostId?: string;
  hostEmployeeId?: string;
  department?: string;
  departmentName?: string;
  departmentId?: string;
  gateName?: string;
  category?: string;
  visitorType?: string;
  idType?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  expectedDuration?: string;
  inTime: string;
  outTime: string;
  checkInTime?: string;
  checkOutTime?: string;
  expectedCheckIn?: string;
  validFrom?: string;
  validTill?: string;
  duration?: string;
  status: VisitorStatus;
  employeeStatus?: VisitorStatus;
  finalStatus?: VisitorStatus;
  photoUrl?: string;
  assets?: string;
  qrCodeUrl?: string;
  actionTakenBy?: string; // e.g. "Aashis (Employee)" or "SA (Super Admin)"
  actionTakenAt?: string;
  rejectionReason?: string;
  isVip?: boolean;
  isBlacklisted?: boolean;
  createdAt?: string;
  visitorId?: string;
  locationName?: string;
  badgeNumber?: string;
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  fullName?: string;
  department: string;
  departmentName?: string;
  departmentId?: string;
  designation: string;
  email: string;
  phone: string;
  accessGroup: string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
  location?: string;
  employeeId?: string;
}

export interface Appointment {
  id: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  hostName: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Confirmed' | string;
  visitorCompany?: string;
  appointmentCode?: string;
  departmentName?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type?: string;
  category?: string;
  avatar?: string;
}

export interface UserSession {
  id: string;
  userName: string;
  device: string;
  ipAddress: string;
  lastActive: string;
  status: 'Active' | 'Revoked';
  isCurrent?: boolean;
  location?: string;
  ip?: string;
}

export interface AccessGroup {
  id: string;
  name: string;
  company: string;
  assignedDevices: string[];
  status: 'Active' | 'Inactive';
  employeeCount: number;
}

export interface DashboardStats {
  totalVisitors: number;
  inPremise: number;
  pending: number;
  rejected: number;
  upcoming: number;
  visited: number;
  totalVisitorsToday?: number;
  currentlyInside?: number;
  completedVisits?: number;
}

export interface MasterItem {
  id: string;
  code: string;
  name: string;
  location?: string;
  headName?: string;
  status: 'Active' | 'Inactive';
}

export type AccountStatus = 'Active' | 'Pending' | 'Suspended' | 'Rejected' | string;
export type User = UserProfile;

export interface AccountRequest {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role?: UserRole;
  reason: string;
  requestedAt?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  avatar?: string;
  employeeId?: string;
  desiredRole?: string;
  timestamp?: string;
  phone?: string;
  assignedRole?: string;
  designation?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName?: string;
  iconName?: string;
  color?: string;
  employeeCount?: number;
  visitorsToday?: number;
  visitorsThisMonth?: number;
}

export type GateStatus = 'Active' | 'Maintenance' | 'Locked' | string;

export interface Gate {
  id: string;
  name: string;
  location?: string;
  status: GateStatus;
  deviceType?: string;
  ipAddress?: string;
  locationId?: string;
  locationName?: string;
  gateType?: string;
  securityOfficer?: string;
  visitorsToday?: number;
  currentlyInside?: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  buildingCode?: string;
  totalGates?: number;
  managerName?: string;
  gateCount?: number;
  status?: string;
  visitorsToday?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy?: string;
  target?: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
  user?: string;
  userRole?: string;
  eventType?: string;
  description?: string;
  entityId?: string;
  location?: string;
  entity?: string;
}

export interface RecycleRecord {
  id: string;
  type?: string;
  name?: string;
  deletedBy: string;
  deletedAt: string;
  restoreData?: any;
  entityType?: string;
  entityName?: string;
  reason?: string;
  originalData?: any;
}

export interface BackupRecord {
  id: string;
  fileName?: string;
  fileSize?: string;
  createdAt?: string;
  type?: 'Full' | 'Incremental' | string;
  status: 'Success' | 'Failed' | string;
  timestamp?: string;
  size?: string;
  createdBy?: string;
}

export interface ArchiveRecord {
  id: string;
  title: string;
  recordCount: number;
  period: string;
  archivedAt: string;
  year?: string | number;
  fileSize?: string;
  totalRecords?: number;
  archivedDate?: string;
}

export interface PermissionMatrix {
  id: string;
  module: string;
  superAdmin: boolean;
  security: boolean;
  employee: boolean;
  [key: string]: any;
}

export interface LoginActivity {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  ip?: string;
  status?: 'Success' | 'Failed' | string;
  timestamp?: string;
  loginTime?: string;
  device?: string;
  browser?: string;
  location?: string;
}

export interface SecurityAlert {
  id: string;
  type?: 'Warning' | 'Critical' | 'Info' | string;
  severity?: 'Warning' | 'Critical' | 'Info' | string;
  title?: string;
  description?: string;
  message?: string;
  timestamp?: string;
  source?: string;
}

export interface ArchiveRecord {
  id: string;
  title: string;
  recordCount: number;
  period: string;
  archivedAt: string;
}

