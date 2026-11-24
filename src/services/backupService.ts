import { BackupRecord, ArchiveRecord } from '../types';
import { mockBackups, mockArchives } from '../data/mockData';

class BackupService {
  private backups: BackupRecord[] = [...mockBackups];
  private archives: ArchiveRecord[] = [...mockArchives];

  async getBackups(): Promise<BackupRecord[]> {
    return Promise.resolve([...this.backups]);
  }

  async triggerBackup(createdBy: string = 'Admin'): Promise<BackupRecord> {
    const created: BackupRecord = {
      id: `bak-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      size: '1.82 GB',
      status: 'Successful',
      createdBy,
    };
    this.backups.unshift(created);
    return Promise.resolve(created);
  }

  async getArchives(): Promise<ArchiveRecord[]> {
    return Promise.resolve([...this.archives]);
  }
}

export const backupService = new BackupService();
