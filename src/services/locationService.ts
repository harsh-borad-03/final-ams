import { Location } from '../types';
import { mockLocations } from '../data/mockData';

class LocationService {
  private locations: Location[] = [...mockLocations];

  async getLocations(): Promise<Location[]> {
    return Promise.resolve([...this.locations]);
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    return Promise.resolve(this.locations.find((l) => l.id === id));
  }

  async addLocation(data: Partial<Location>): Promise<Location> {
    const created: Location = {
      id: `loc-${Date.now()}`,
      name: data.name || 'New Facility Location',
      address: data.address || '100 Main Campus Way',
      managerName: data.managerName || 'Operations Manager',
      status: 'Active',
      gateCount: data.gateCount || 1,
      visitorsToday: 0,
    };
    this.locations.push(created);
    return Promise.resolve(created);
  }
}

export const locationService = new LocationService();
