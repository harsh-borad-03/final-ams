import React, { useState } from 'react';
import { Search, UserCheck, Shield, Key, LogOut, Trash2, AlertTriangle, CheckCircle2, Lock, Edit3 } from 'lucide-react';
import { User, UserRole, AccountStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UserManagementTable: React.FC = () => {
  const { users, updateUserAccountStatus, changeRole, forceLogoutUser } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || u.accountStatus === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleResetPassword = (email: string) => {
    setResetNotice(`Password reset instructions link dispatched to ${email}.`);
    setTimeout(() => setResetNotice(null), 4000);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search user by name, email, or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="ALL">All System Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Administrator</option>
            <option value="receptionist">Receptionist</option>
            <option value="security">Security Guard</option>
            <option value="employee">Employee Host</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending Approval</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DISABLED">Disabled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {resetNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {resetNotice}
        </div>
      )}

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs font-medium text-slate-200">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
            <tr>
              <th className="py-3.5 px-4">User Name</th>
              <th className="py-3.5 px-4">Employee ID</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredUsers.map((u) => {
              const isSuperAdmin = u.role === 'super_admin';

              return (
                <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30" />
                    <div>
                      <p>{u.name}</p>
                      <p className="text-[10px] font-normal text-slate-400">{u.email}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-cyan-400">{u.employeeId || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-slate-300">{u.department || 'General'}</td>

                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      disabled={isSuperAdmin}
                      onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold text-indigo-300 focus:outline-none"
                    >
                      <option value="super_admin">SUPER ADMIN</option>
                      <option value="admin">ADMIN</option>
                      <option value="receptionist">RECEPTIONIST</option>
                      <option value="security">SECURITY</option>
                      <option value="employee">EMPLOYEE</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase ${
                        u.accountStatus === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : u.accountStatus === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : u.accountStatus === 'SUSPENDED'
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          : u.accountStatus === 'DISABLED'
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {u.accountStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono">{u.lastLogin || 'Never'}</td>

                  <td className="py-3.5 px-4 text-right">
                    {!isSuperAdmin ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {u.accountStatus === 'APPROVED' ? (
                          <>
                            <button
                              onClick={() => updateUserAccountStatus(u.id, 'SUSPENDED')}
                              className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold"
                              title="Suspend User Account"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => updateUserAccountStatus(u.id, 'DISABLED')}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold"
                              title="Disable User Account"
                            >
                              Disable
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateUserAccountStatus(u.id, 'APPROVED')}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold"
                            title="Activate User Account"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() => handleResetPassword(u.email)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700"
                          title="Reset Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => forceLogoutUser(u.id)}
                          className="p-1 rounded-lg bg-slate-800 hover:bg-purple-600/30 text-purple-300 border border-slate-700"
                          title="Force Logout Active Sessions"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-purple-400 font-extrabold uppercase">Protected Role</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
