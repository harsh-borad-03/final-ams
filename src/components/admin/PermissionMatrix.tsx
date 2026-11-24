import React, { useState } from 'react';
import { ShieldCheck, Check, X, Lock, Users, Sparkles } from 'lucide-react';
import { mockPermissionMatrices } from '../../data/mockData';
import { UserRole, PermissionMatrix as IPermissionMatrix } from '../../types';

export const PermissionMatrixUI: React.FC = () => {
  const [matrices, setMatrices] = useState<IPermissionMatrix[]>(mockPermissionMatrices);

  const togglePermission = (role: UserRole, key: keyof IPermissionMatrix) => {
    if (role === 'super_admin') return; // Super admin cannot be changed

    setMatrices((prev) =>
      prev.map((m) => {
        if (m.role === role && typeof m[key] === 'boolean') {
          return { ...m, [key]: !m[key] };
        }
        return m;
      })
    );
  };

  const permissionKeys: { key: keyof IPermissionMatrix; label: string }[] = [
    { key: 'registerVisitors', label: 'Register New Visitors' },
    { key: 'checkIn', label: 'Check In Visitors' },
    { key: 'checkOut', label: 'Check Out Visitors' },
    { key: 'manageUsers', label: 'Manage System Users' },
    { key: 'approveUsers', label: 'Approve User Requests' },
    { key: 'manageRoles', label: 'Manage User Roles' },
    { key: 'manageEmployees', label: 'Manage Employee Hosts' },
    { key: 'viewReports', label: 'View Reports & Analytics' },
    { key: 'viewAuditLogs', label: 'View Audit Security Logs' },
    { key: 'systemSettings', label: 'System Settings' },
    { key: 'backupManagement', label: 'Manage Data Backups' },
    { key: 'emergencyMode', label: 'Trigger Emergency Evacuation' },
  ];

  const roleHeadings: { role: UserRole; label: string; color: string }[] = [
    { role: 'super_admin', label: 'SUPER ADMIN', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { role: 'admin', label: 'ADMIN', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { role: 'receptionist', label: 'RECEPTIONIST', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { role: 'security', label: 'SECURITY GUARD', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { role: 'employee', label: 'EMPLOYEE HOST', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" /> Role-Based Access Control (RBAC) Permission Matrix
          </h3>
          <p className="text-xs text-slate-400">Configure fine-grained system capabilities per user role</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Granular Enterprise Security
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs font-medium text-slate-200">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold uppercase">
            <tr>
              <th className="py-4 px-5 text-slate-400">System Capability Permission</th>
              {roleHeadings.map((rh) => (
                <th key={rh.role} className="py-4 px-4 text-center">
                  <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-extrabold ${rh.color}`}>
                    {rh.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
            {permissionKeys.map(({ key, label }) => (
              <tr key={key} className="hover:bg-slate-800/50 transition-colors">
                <td className="py-3.5 px-5 font-bold text-slate-200">{label}</td>
                {roleHeadings.map((rh) => {
                  const matrix = matrices.find((m) => m.role === rh.role);
                  const isAllowed = matrix ? (matrix[key] as boolean) : false;
                  const isSuperAdmin = rh.role === 'super_admin';

                  return (
                    <td key={rh.role} className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        disabled={isSuperAdmin}
                        onClick={() => togglePermission(rh.role, key)}
                        className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                          isAllowed
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-600 border border-slate-800'
                        } ${isSuperAdmin ? 'cursor-not-allowed opacity-90' : 'hover:scale-110'}`}
                      >
                        {isAllowed ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
