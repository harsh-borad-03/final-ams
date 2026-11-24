import React from 'react';
import { Plus, CheckCircle2, XCircle, Clock, UserCheck, Calendar } from 'lucide-react';
import { Visitor, Appointment } from '../../types';

interface EmployeeDashboardProps {
  currentUser?: any;
  visitors: Visitor[];
  appointments: Appointment[];
  onOpenInvite: () => void;
  onUpdateStatus: (id: string, status: Visitor['status']) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  visitors,
  appointments,
  onOpenInvite,
  onUpdateStatus,
}) => {
  const isSuperAdminOrAdmin = 
    currentUser?.role === 'Super Admin' || 
    currentUser?.name === 'SA' || 
    currentUser?.name === 'Admin User';

  const pendingApprovals = visitors.filter((v) => {
    const isPending = v.status === 'Pending' || v.status === 'PENDING';
    if (!isPending) return false;
    if (isSuperAdminOrAdmin || !currentUser) return true;
    const vHost = (v.hostName || '').toLowerCase().trim();
    const uName = (currentUser.name || '').toLowerCase().trim();
    return vHost === uName || vHost.includes(uName) || uName.includes(vHost);
  });
  const myCheckedInVisitors = visitors.filter((v) => v.status === 'CHECKED_IN' || v.status === 'In Premise');

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Employee Host Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white">Employee Host Portal</h2>
          <p className="text-xs text-slate-400">Dr. Sarah Jenkins • Information Technology (Tower A - Floor 8)</p>
        </div>

        <button
          onClick={onOpenInvite}
          className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Invite Pre-Registered Guest
        </button>
      </div>

      {/* Visitor Approvals Waiting for Employee */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" /> Visitors Arrived & Waiting for Your Approval ({pendingApprovals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.map((v) => (
            <div key={v.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img src={v.photoUrl} alt={v.fullName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-extrabold text-sm text-white">{v.fullName}</p>
                  <p className="text-xs text-slate-400">{v.company} • {v.purpose}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => onUpdateStatus(v.id, 'CHECKED_IN')}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve Entry
                </button>
                <button
                  onClick={() => onUpdateStatus(v.id, 'REJECTED')}
                  className="flex-1 py-2 rounded-xl bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Deny Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
