import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  UserX,
  Building,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Key,
  Database,
  Lock,
  ArrowRight,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountRequest, UserRole } from '../types';
import { UserApprovalModal } from '../components/admin/UserApprovalModal';

interface SuperAdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, accountRequests, approveUserAccount, rejectUserAccount } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingRequests = accountRequests.filter((r) => r.status === 'PENDING');

  const stats = [
    { label: 'Pending User Requests', value: pendingRequests.length || 14, color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300', icon: Clock },
    { label: 'Active Users', value: 248, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300', icon: UserCheck },
    { label: 'Suspended Users', value: 7, color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300', icon: UserX },
    { label: 'Total Employees', value: 1842, color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300', icon: Users },
    { label: 'Visitors Today', value: 1248, color: 'from-violet-500/20 to-purple-500/20 border-violet-500/40 text-violet-300', icon: Building },
    { label: 'Security Alerts', value: 3, color: 'from-red-500/20 to-rose-500/20 border-red-500/40 text-red-300', icon: ShieldAlert },
  ];

  const quickActionCards = [
    { title: 'Review User Requests', tab: 'pending_users', color: 'from-amber-600 to-orange-600', icon: Clock },
    { title: 'Manage Users', tab: 'users', color: 'from-indigo-600 to-violet-600', icon: Users },
    { title: 'Manage Roles', tab: 'roles', color: 'from-purple-600 to-pink-600', icon: ShieldCheck },
    { title: 'Manage Permissions', tab: 'settings', color: 'from-cyan-600 to-blue-600', icon: Lock },
    { title: 'Security Center', tab: 'security_center', color: 'from-rose-600 to-red-600', icon: ShieldAlert },
    { title: 'Audit Logs', tab: 'audit', color: 'from-emerald-600 to-teal-600', icon: FileText },
    { title: 'System Settings', tab: 'settings', color: 'from-slate-700 to-slate-800', icon: Sparkles },
    { title: 'Backup Management', tab: 'retention', color: 'from-blue-600 to-cyan-600', icon: Database },
  ];

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Super Admin Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            Good Morning, {currentUser.name} 👋
          </h1>
          <p className="text-xs text-indigo-300 font-semibold mt-1">
            Super Admin Control Center • Zero-Trust System Overview
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-extrabold text-xs flex items-center gap-2 w-fit">
          <Sparkles className="w-4 h-4 text-cyan-400" /> CISO Master Privileges Active
        </span>
      </div>

      {/* 6 Metric Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-3xl bg-slate-900 border ${st.color} shadow-xl flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{st.label}</span>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black text-white">{st.value.toLocaleString()}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Prominent Pending User Requests Table Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border-2 border-amber-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">🔔 Pending Account Requests</h2>
              <p className="text-xs text-slate-400">Review & approve new employee/staff registration requests</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
            {pendingRequests.length} Requests Awaiting Clearance
          </span>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-medium text-slate-200">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3.5 px-4">Applicant Name</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Requested Role</th>
                  <th className="py-3.5 px-4">Request Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
                {pendingRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-white flex items-center gap-3">
                      <img src={req.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'} alt={req.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p>{req.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{req.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{req.employeeId || 'EMP-1042'}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">{req.department}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                        {req.desiredRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{req.timestamp}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        PENDING
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Details
                        </button>

                        <button
                          onClick={() => approveUserAccount(req.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>

                        <button
                          onClick={() => rejectUserAccount(req.id, 'Incorrect information')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-slate-300">All Account Requests Processed</p>
            <p className="text-[11px]">No pending access approval requests at this time.</p>
          </div>
        )}
      </div>

      {/* Quick Action Colorful Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white">Super Admin Command Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActionCards.map((qc) => {
            const Icon = qc.icon;
            return (
              <button
                key={qc.title}
                onClick={() => onNavigate(qc.tab)}
                className={`p-5 rounded-3xl bg-gradient-to-r ${qc.color} text-white font-extrabold text-xs shadow-2xl flex flex-col justify-between h-28 group transition-all hover:scale-105 text-left`}
              >
                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="flex items-center justify-between w-full">
                  {qc.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <UserApprovalModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
