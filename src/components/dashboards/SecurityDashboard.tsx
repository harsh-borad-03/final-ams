import React from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldAlert, AlertTriangle, Users, Clock, LogOut, CheckCircle2, Search, QrCode } from 'lucide-react';
import { Visitor } from '../../types';

interface SecurityDashboardProps {
  visitors: Visitor[];
  onOpenQRScanner: () => void;
  onOpenEmergency: () => void;
  onUpdateStatus: (id: string, status: Visitor['status']) => void;
  onSelectVisitor: (visitor: Visitor) => void;
}

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  visitors,
  onOpenQRScanner,
  onOpenEmergency,
  onUpdateStatus,
  onSelectVisitor,
}) => {
  const currentlyInside = visitors.filter((v) => v.status === 'In Premise' || v.status === 'Approved' || v.status === 'CHECKED_IN');
  const waitingVisitors = visitors.filter((v) => v.status === 'Pending' || v.status === 'PENDING');
  const recentlyCheckedOut = visitors.filter((v) => v.status === 'Visited' || v.status === 'CHECKED_OUT').slice(0, 5);

  return (
    <div className="space-y-6 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* High Visibility Quick Action Gate Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Security Gate Command Portal</h2>
            <p className="text-xs text-slate-400">Gate Turnstile #1 • Active Officer View</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenQRScanner}
            className="flex-1 sm:flex-none py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
          >
            <Scan className="w-5 h-5" /> SCAN QR BADGE
          </button>

          <button
            onClick={onOpenEmergency}
            className="flex-1 sm:flex-none py-3 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 animate-pulse"
          >
            <AlertTriangle className="w-5 h-5" /> 🚨 EMERGENCY MODE
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase">Visitors Inside</span>
          <span className="text-3xl font-black text-emerald-400 block mt-1">{currentlyInside.length}</span>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase">Waiting at Gate</span>
          <span className="text-3xl font-black text-amber-400 block mt-1">{waitingVisitors.length}</span>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase">Expected Today</span>
          <span className="text-3xl font-black text-cyan-400 block mt-1">12</span>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
          <span className="text-xs font-bold text-slate-400 uppercase">Recently Checked Out</span>
          <span className="text-3xl font-black text-purple-400 block mt-1">{recentlyCheckedOut.length}</span>
        </div>
      </div>

      {/* Currently Inside Gate Roster */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" /> Active Guests Inside Building
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentlyInside.map((v) => (
            <div key={v.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={v.photoUrl} alt={v.fullName} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-extrabold text-sm text-white">{v.fullName}</p>
                  <p className="text-xs text-slate-400">{v.company} • Host: {v.hostName}</p>
                </div>
              </div>

              <button
                onClick={() => onUpdateStatus(v.id, 'Visited')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                title="Check Out Visitor from Building"
              >
                <LogOut className="w-3.5 h-3.5" /> Check Out
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
