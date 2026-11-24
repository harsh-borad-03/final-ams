import { Gate, GateStatus } from '../types';
import { mockGates } from '../data/mockData';

class GateService {
  private gates: Gate[] = [...mockGates];

  async getGates(locationId?: string): Promise<Gate[]> {
    if (locationId && locationId !== 'ALL') {
      return Promise.resolve(this.gates.filter((g) => g.locationId === locationId));
    }
    return Promise.resolve([...this.gates]);
  }

  async updateGateStatus(id: string, status: GateStatus): Promise<Gate | null> {
    const idx = this.gates.findIndex((g) => g.id === id);
    if (idx !== -1) {
      this.gates[idx] = { ...this.gates[idx], status };
      return Promise.resolve(this.gates[idx]);
    }
    return Promise.resolve(null);
  }

  async addGate(data: Partial<Gate>): Promise<Gate> {
    const created: Gate = {
      id: `gate-${Date.now()}`,
      name: data.name || 'New Security Gate',
      locationId: data.locationId || 'loc-1',
      locationName: data.locationName || 'Head Office HQ',
      gateType: data.gateType || 'Main Entrance',
      securityOfficer: data.securityOfficer || 'Security Guard',
      status: 'OPEN',
      visitorsToday: 0,
      currentlyInside: 0,
    };
    this.gates.push(created);
    return Promise.resolve(created);
  }
}

export const gateService = new GateService();
