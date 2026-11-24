import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Search, Plus, User } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentListProps {
  appointments: Appointment[];
  onOpenCreate: () => void;
  onOpenPreRegister?: () => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onOpenCreate, onOpenPreRegister }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.visitorName.toLowerCase().includes(search.toLowerCase()) ||
      (apt.visitorCompany || '').toLowerCase().includes(search.toLowerCase()) ||
      apt.hostName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPreRegister && (
            <button
              onClick={onOpenPreRegister}
              className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              + Send Guest Invite Link
            </button>
          )}

          <button
            onClick={onOpenCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      {/* Grid of Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((apt, idx) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 hover:border-slate-700 shadow-xl space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/20">
                  {apt.appointmentCode}
                </span>
                <h4 className="text-base font-extrabold text-white mt-1">{apt.visitorName}</h4>
                <p className="text-xs font-semibold text-slate-400">{apt.visitorCompany}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  apt.status === 'Confirmed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {apt.status}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-indigo-400" /> Host Staff: <strong className="text-white">{apt.hostName}</strong> ({apt.departmentName})
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" /> {apt.date} • {apt.startTime} - {apt.endTime}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400" /> Location: {apt.location}
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">"{apt.purpose}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
