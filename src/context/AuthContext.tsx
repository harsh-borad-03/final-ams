import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AccountRequest, AccountStatus } from '../types';
import { mockUsers, mockAccountRequests } from '../data/mockData';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  users: User[];
  accountRequests: AccountRequest[];
  registerAccount: (data: {
    fullName: string;
    email: string;
    phone?: string;
    employeeId?: string;
    department: string;
    designation?: string;
    desiredRole: UserRole;
    reason: string;
  }) => Promise<{ user: User; request: AccountRequest }>;
  approveUserAccount: (id: string, assignedRole?: UserRole) => Promise<void>;
  rejectUserAccount: (id: string, reason: string) => Promise<void>;
  updateUserAccountStatus: (id: string, status: AccountStatus) => Promise<void>;
  changeRole: (id: string, role: UserRole) => Promise<void>;
  forceLogoutUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>(mockAccountRequests);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const refreshUsers = async () => {
    const list = await userService.getUsers();
    setUsers(list);
    const reqs = await userService.getPendingRequests();
    setAccountRequests(reqs);
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  const switchRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role) || {
      id: `usr-${role}`,
      name: `${role.toUpperCase()} User`,
      email: `${role}@aurasolutions.com`,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      department: 'General Operations',
      location: 'Main Head Office',
      onlineStatus: true,
      accountStatus: 'APPROVED',
    };
    setCurrentUser(found);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const registerAccount = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    employeeId?: string;
    department: string;
    designation?: string;
    desiredRole: UserRole;
    reason: string;
  }) => {
    const res = await userService.registerUser(data);
    await refreshUsers();
    return res;
  };

  const approveUserAccount = async (id: string, assignedRole?: UserRole) => {
    await userService.approveUser(id, assignedRole);
    await refreshUsers();
  };

  const rejectUserAccount = async (id: string, reason: string) => {
    await userService.rejectUser(id, reason);
    await refreshUsers();
  };

  const updateUserAccountStatus = async (id: string, status: AccountStatus) => {
    await userService.updateUserStatus(id, status);
    await refreshUsers();
  };

  const changeRole = async (id: string, role: UserRole) => {
    await userService.changeUserRole(id, role);
    await refreshUsers();
  };

  const forceLogoutUser = async (id: string) => {
    await userService.forceLogout(id);
    await refreshUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchRole,
        logout,
        isAuthenticated,
        setIsAuthenticated,
        users,
        accountRequests,
        registerAccount,
        approveUserAccount,
        rejectUserAccount,
        updateUserAccountStatus,
        changeRole,
        forceLogoutUser,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
