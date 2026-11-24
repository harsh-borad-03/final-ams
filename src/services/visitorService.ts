import { Visitor } from '../types';

const LOCAL_STORAGE_KEY = 'auravms_visitors_db';

class VisitorService {
  private visitors: Visitor[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        this.visitors = JSON.parse(saved);
      } catch {
        this.visitors = [];
      }
    } else {
      this.visitors = [];
    }
  }

  private saveToStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.visitors));
  }

  async getVisitors(): Promise<Visitor[]> {
    return Promise.resolve([...this.visitors]);
  }

  async addVisitor(visitorData: Partial<Visitor>): Promise<Visitor> {
    const newId = `v-${Date.now()}`;
    const visitorCode = `VMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const createdStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const created: Visitor = {
      id: newId,
      passCode: visitorData.passCode || visitorCode,
      address: visitorData.address || 'Company Premises',
      inTime: visitorData.inTime || nowStr,
      outTime: visitorData.outTime || '--',
      department: visitorData.department || visitorData.departmentName || 'General Management',
      visitorId: visitorCode,
      fullName: visitorData.fullName || 'New Visitor',
      email: visitorData.email || '',
      phone: visitorData.phone || '',
      company: visitorData.company || 'External Organization',
      category: visitorData.category || 'Client',
      photoUrl: visitorData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      idType: visitorData.idType || 'National ID',
      idNumber: visitorData.idNumber || 'NID-000000',
      vehicleNumber: visitorData.vehicleNumber,
      vehicleType: visitorData.vehicleType || 'None',
      purpose: visitorData.purpose || 'Business Visit',
      hostEmployeeId: visitorData.hostEmployeeId || 'emp-101',
      hostName: visitorData.hostName || 'Staff Host',
      departmentId: visitorData.departmentId || 'dept-1',
      departmentName: visitorData.departmentName || 'General Management',
      expectedDuration: visitorData.expectedDuration || '2 hours',
      status: visitorData.status || 'CHECKED_IN',
      checkInTime: nowStr,
      badgeNumber: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: createdStr,
    };

    this.visitors.unshift(created);
    this.saveToStorage();
    return Promise.resolve(created);
  }

  async updateVisitorStatus(id: string, status: Visitor['status']): Promise<Visitor | null> {
    const idx = this.visitors.findIndex((v) => v.id === id);
    if (idx !== -1) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.visitors[idx] = {
        ...this.visitors[idx],
        status,
        ...(status === 'CHECKED_OUT' ? { checkOutTime: nowStr } : {}),
      };
      this.saveToStorage();
      return Promise.resolve(this.visitors[idx]);
    }
    return Promise.resolve(null);
  }

  async clearAllData(): Promise<void> {
    this.visitors = [];
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return Promise.resolve();
  }
}

export const visitorService = new VisitorService();
