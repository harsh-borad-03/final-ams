import { Visitor, Employee, AccessGroup, DashboardStats, UserProfile, MasterItem } from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'USR-01',
    name: 'SA',
    email: 'SA',
    role: 'Super Admin',
    avatar: 'SA',
    password: 'admin123'
  },
  {
    id: 'USR-04',
    name: 'Admin User',
    email: 'admin',
    role: 'Super Admin',
    avatar: 'AD',
    password: 'admin@123'
  },
  {
    id: 'USR-02',
    name: 'Security Officer',
    email: 'security',
    role: 'Security',
    avatar: 'S',
    password: 'AMS@1234'
  }
];

export const INITIAL_COMPANIES: MasterItem[] = [
  { id: 'CMP-01', code: 'HQ', name: 'Main Enterprise HQ', status: 'Active' },
  { id: 'CMP-02', code: 'TECH', name: 'Tech Innovations', status: 'Active' },
  { id: 'CMP-03', code: 'LOG', name: 'Global Logistics', status: 'Active' }
];

export const INITIAL_BRANCHES: MasterItem[] = [
  { id: 'BR-01', code: 'HQ', name: 'Main Building HQ', location: 'Tower A', status: 'Active' },
  { id: 'BR-02', code: 'WEST', name: 'West Gate Terminal', location: 'Gate 2', status: 'Active' }
];

export const INITIAL_DEPARTMENTS: MasterItem[] = [
  { id: 'DEP-01', code: 'PUR', name: 'Purchase', headName: 'Purchase Manager', status: 'Active' },
  { id: 'DEP-02', code: 'QA', name: 'Quality', headName: 'Quality Head', status: 'Active' },
  { id: 'DEP-03', code: 'PRD', name: 'Production', headName: 'Production Head', status: 'Active' },
  { id: 'DEP-04', code: 'FAC', name: 'Facility', headName: 'Facility Manager', status: 'Active' },
  { id: 'DEP-05', code: 'IT', name: 'IT', headName: 'IT Administrator', status: 'Active' },
  { id: 'DEP-06', code: 'IC', name: 'IC', headName: 'IC Lead', status: 'Active' },
  { id: 'DEP-07', code: 'ACC', name: 'Accounts', headName: 'Accounts Head', status: 'Active' },
  { id: 'DEP-08', code: 'LOG', name: 'Logistics', headName: 'Logistics Head', status: 'Active' },
  { id: 'DEP-09', code: 'WHS', name: 'Warehouse', headName: 'Warehouse Head', status: 'Active' },
  { id: 'DEP-10', code: 'R&D', name: 'R&D', headName: 'R&D Director', status: 'Active' },
  { id: 'DEP-11', code: 'MKT', name: 'Marketing', headName: 'Marketing Head', status: 'Active' },
  { id: 'DEP-12', code: 'CLN', name: 'Clinical', headName: 'Clinical Affairs Lead', status: 'Active' },
  { id: 'DEP-13', code: 'ENG', name: 'Engineering', headName: 'Chief Engineer', status: 'Active' },
  { id: 'DEP-14', code: 'NDL', name: 'Needle', headName: 'Needle Division Head', status: 'Active' },
  { id: 'DEP-15', code: 'OTH', name: 'Other', headName: 'General Management', status: 'Active' }
];

const getRelativeDate = (offsetDays: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
};

export const INITIAL_VISITORS: Visitor[] = [];


export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-101',
    empCode: 'EMP-101',
    name: 'Dhaval Sir',
    department: 'IT',
    designation: 'IT Department Lead',
    email: 'dhaval@vms.com',
    phone: '9800000001',
    accessGroup: 'ALL Access',
    status: 'Active'
  },
  {
    id: 'EMP-102',
    empCode: 'EMP-102',
    name: 'Aashis',
    department: 'Medical',
    designation: 'Medical Officer',
    email: 'aashis@vms.com',
    phone: '9800000002',
    accessGroup: 'Test Device',
    status: 'Active'
  }
];

export const INITIAL_ACCESS_GROUPS: AccessGroup[] = [
  {
    id: 'AG-01',
    name: 'ALL Access',
    company: 'Enterprise HQ',
    assignedDevices: ['Main Gate Device', 'D-P1-Left', 'D-P1-Right'],
    status: 'Active',
    employeeCount: 25
  }
];

export const INITIAL_STATS: DashboardStats = {
  totalVisitors: 2,
  inPremise: 1,
  pending: 1,
  rejected: 0,
  upcoming: 0,
  visited: 0
};

export const mockUsers = DEMO_USERS;
export const mockAccountRequests = [];
export const mockAuditLogs = [];
export const mockRecycleBin = [];
export const mockBackups = [];
export const mockArchives = [];
export const mockGates = [
  { id: 'GT-01', name: 'Main Front Gate Turnstile', location: 'Tower A Lobby', status: 'Active' },
  { id: 'GT-02', name: 'West Gate Terminal', location: 'Gate 2 Entrance', status: 'Active' }
];
export const mockLocations = [
  { id: 'LOC-01', name: 'Main Enterprise HQ', address: 'Tower A, Business District', totalGates: 4 }
];
export const mockSessions = [];
export const mockActivityLogs = [];
export const mockAppointments = [];
export const mockNotifications = [];
export const mockDepartments = INITIAL_DEPARTMENTS;
export const mockEmployees = INITIAL_EMPLOYEES;
export const mockDashboardStats = INITIAL_STATS;
export const mockPermissionMatrices = [];
export const mockLoginActivity = [];
export const mockSecurityAlerts = [];
