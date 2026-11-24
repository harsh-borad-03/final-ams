import { User, AccountRequest, AccountStatus, UserRole } from '../types';
import { mockUsers, mockAccountRequests } from '../data/mockData';

class UserService {
  private users: User[] = [...mockUsers];
  private accountRequests: AccountRequest[] = [...mockAccountRequests];

  async getUsers(filterStatus?: AccountStatus): Promise<User[]> {
    if (filterStatus) {
      return Promise.resolve(this.users.filter((u) => u.accountStatus === filterStatus));
    }
    return Promise.resolve([...this.users]);
  }

  async getPendingRequests(): Promise<AccountRequest[]> {
    return Promise.resolve(this.accountRequests.filter((r) => r.status === 'PENDING'));
  }

  async registerUser(data: {
    fullName: string;
    email: string;
    phone?: string;
    employeeId?: string;
    department: string;
    designation?: string;
    desiredRole: UserRole;
    reason: string;
  }): Promise<{ user: User; request: AccountRequest }> {
    const createdDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const newRequest: AccountRequest = {
      id: `req-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      employeeId: data.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      desiredRole: data.desiredRole,
      department: data.department,
      designation: data.designation,
      reason: data.reason,
      timestamp: createdDate,
      status: 'PENDING',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    };

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      employeeId: newRequest.employeeId,
      role: data.desiredRole,
      department: data.department,
      designation: data.designation,
      location: 'Main Head Office',
      avatar: newRequest.avatar!,
      onlineStatus: false,
      accountStatus: 'PENDING',
      registrationDate: createdDate,
      activeSessionsCount: 0,
    };

    this.accountRequests.unshift(newRequest);
    this.users.unshift(newUser);

    return Promise.resolve({ user: newUser, request: newRequest });
  }

  async approveUser(requestIdOrUserId: string, assignedRole?: UserRole): Promise<User | null> {
    const reqIndex = this.accountRequests.findIndex((r) => r.id === requestIdOrUserId || r.email === requestIdOrUserId);
    if (reqIndex !== -1) {
      const finalRole = assignedRole || this.accountRequests[reqIndex].desiredRole;
      this.accountRequests[reqIndex] = {
        ...this.accountRequests[reqIndex],
        status: 'APPROVED',
        assignedRole: finalRole,
      };

      const userIndex = this.users.findIndex((u) => u.email === this.accountRequests[reqIndex].email);
      if (userIndex !== -1) {
        this.users[userIndex] = {
          ...this.users[userIndex],
          role: finalRole || 'Employee',
          accountStatus: 'APPROVED',
          approvedBy: 'Super Admin Alex Vance',
        };
        return Promise.resolve(this.users[userIndex]);
      }
    }

    const uIndex = this.users.findIndex((u) => u.id === requestIdOrUserId || u.email === requestIdOrUserId);
    if (uIndex !== -1) {
      this.users[uIndex] = {
        ...this.users[uIndex],
        ...(assignedRole ? { role: assignedRole } : {}),
        accountStatus: 'APPROVED',
        approvedBy: 'Super Admin Alex Vance',
      };
      return Promise.resolve(this.users[uIndex]);
    }

    return Promise.resolve(null);
  }

  async rejectUser(id: string, reason: string): Promise<boolean> {
    const rIndex = this.accountRequests.findIndex((r) => r.id === id || r.email === id);
    if (rIndex !== -1) {
      this.accountRequests[rIndex] = {
        ...this.accountRequests[rIndex],
        status: 'REJECTED',
      };
    }

    const uIndex = this.users.findIndex((u) => u.id === id || u.email === id);
    if (uIndex !== -1) {
      this.users[uIndex] = {
        ...this.users[uIndex],
        accountStatus: 'REJECTED',
        rejectionReason: reason,
        rejectedBy: 'Super Admin Alex Vance',
      };
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  async updateUserStatus(userId: string, newStatus: AccountStatus): Promise<User | null> {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], accountStatus: newStatus };
      return Promise.resolve(this.users[idx]);
    }
    return Promise.resolve(null);
  }

  async changeUserRole(userId: string, newRole: UserRole): Promise<User | null> {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], role: newRole };
      return Promise.resolve(this.users[idx]);
    }
    return Promise.resolve(null);
  }

  async forceLogout(userId: string): Promise<boolean> {
    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], activeSessionsCount: 0, onlineStatus: false };
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}

export const userService = new UserService();
