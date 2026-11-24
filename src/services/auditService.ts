import { AuditLog, RecycleRecord } from '../types';
import { mockAuditLogs, mockRecycleBin } from '../data/mockData';

class AuditService {
  private auditLogs: AuditLog[] = [...mockAuditLogs];
  private recycleBin: RecycleRecord[] = [...mockRecycleBin];

  async getAuditLogs(): Promise<AuditLog[]> {
    return Promise.resolve([...this.auditLogs]);
  }

  async logAction(action: string, entity: string, entityId: string, details: string, user: string = 'Admin'): Promise<AuditLog> {
    const entry: AuditLog = {
      id: `audit-${Date.now()}`,
      user,
      userRole: 'admin',
      action,
      entity,
      entityId,
      timestamp: new Date().toLocaleTimeString(),
      details,
      location: 'Head Office - Turnstile 1',
    };
    this.auditLogs.unshift(entry);
    return Promise.resolve(entry);
  }

  async getRecycleBin(): Promise<RecycleRecord[]> {
    return Promise.resolve([...this.recycleBin]);
  }

  async softDelete(record: Partial<RecycleRecord>): Promise<RecycleRecord> {
    const deleted: RecycleRecord = {
      id: `rec-${Date.now()}`,
      entityType: record.entityType || 'Visitor',
      entityName: record.entityName || 'Deleted Record',
      deletedBy: record.deletedBy || 'Admin',
      deletedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reason: record.reason || 'Manual deletion',
      originalData: record.originalData || {},
    };
    this.recycleBin.unshift(deleted);
    return Promise.resolve(deleted);
  }

  async restoreRecord(id: string): Promise<boolean> {
    this.recycleBin = this.recycleBin.filter((r) => r.id !== id);
    return Promise.resolve(true);
  }

  async permanentDelete(id: string): Promise<boolean> {
    this.recycleBin = this.recycleBin.filter((r) => r.id !== id);
    return Promise.resolve(true);
  }
}

export const auditService = new AuditService();
