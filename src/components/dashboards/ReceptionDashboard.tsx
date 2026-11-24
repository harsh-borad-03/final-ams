import React from 'react';
import { Plus, Printer, CheckCircle2, Clock, Calendar, Users, QrCode, UserCheck } from 'lucide-react';
import { Visitor, Appointment } from '../../types';

interface ReceptionDashboardProps {
  visitors: Visitor[];
  appointments: Appointment[];
  onOpenRegister: () => void;
  onSelectVisitor: (visitor: Visitor) => void;
  onUpdateStatus: (id: string, status: Visitor['status']) => void;
  onOpenPass: (visitor: Visitor) => void;
}

export const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({
  visitors,
  appointments,
  onOpenRegister,
  onSelectVisitor,
  onUpdateStatus,
  onOpenPass,
}) => {
  const pendingApprovals = visitors.filter((v) => v.status === 'PENDING');
  const checkedIn = visitors.filter((v) => v.status === 'CHECKED_IN');

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Quick Action Reception Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white">Reception Desk Command Center</h2>
          <p className="text-xs text-slate-400">Lobby Front Desk • Quick Check-In & Badge Issuance</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenRegister}
            className="py-2.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register Walk-In Visitor
          </button>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals at Desk */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Pending Reception Approvals ({pendingApprovals.length})
          </h3>

          <div className="space-y-3">
            {pendingApprovals.map((v) => (
              <div key={v.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={v.photoUrl} alt={v.fullName} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="font-extrabold text-sm text-white">{v.fullName}</p>
                    <p className="text-xs text-slate-400">{v.company} • Host: {v.hostName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateStatus(v.id, 'CHECKED_IN')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
                  >
                    Check In
                  </button>
                  <button
                    onClick={() => onOpenPass(v)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs"
                  >
                    <Printer className="w-3.5 h-3.5 inline mr-1" /> Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Appointments Today */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" /> Today's Scheduled Appointments ({appointments.length})
          </h3>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-sm text-white">{apt.visitorName}</p>
                  <p className="text-xs text-slate-400">{apt.visitorCompany} • Host: {apt.hostName}</p>
                  <p className="text-[10px] font-mono text-cyan-400 mt-1">{apt.startTime} - {apt.endTime}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
