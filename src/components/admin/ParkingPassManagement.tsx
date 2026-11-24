import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, ShieldCheck, Printer, Plus, Search, CheckCircle2, Clock, MapPin, Tag } from 'lucide-react';
import { Visitor } from '../../types';

interface ParkingPassManagementProps {
  visitors: Visitor[];
}

export const ParkingPassManagement: React.FC<ParkingPassManagementProps> = ({ visitors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'EV' | 'Car' | 'Bike'>('ALL');

  // Filter visitors with vehicles
  const vehicleVisitors = visitors.filter((v) => v.vehicleNumber || v.vehicleType);

  const filtered = vehicleVisitors.filter((v) => {
    const matchesSearch =
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || v.vehicleType === filterType;
    return matchesSearch && matchesType;
  });

  const totalBays = 40;
  const occupiedBays = vehicleVisitors.length + 12;
  const evChargersInUse = 4;
  const evChargersTotal = 8;

  return (
    <div className="space-y-6 select-none">
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-wider">
              Smart Parking Hub
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">Visitor Parking & Vehicle Gate Pass</h2>
          <p className="text-xs text-slate-400">Track visitor vehicle bay assignments, EV charging spots & parking permits</p>
        </div>

        {/* Live Occupancy Counters */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">General Parking</span>
            <div className="text-lg font-black text-emerald-400 mt-0.5">
              {occupiedBays} / {totalBays} <span className="text-xs font-normal text-slate-400">Bays</span>
            </div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase">EV Charging</span>
            <div className="text-lg font-black text-cyan-400 mt-0.5 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" /> {evChargersInUse} / {evChargersTotal}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search plate, visitor or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'EV', 'Car', 'Bike'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type === 'EV' ? '⚡ EV Vehicles' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v, idx) => (
          <motion.div
            key={v.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">{v.fullName}</h4>
                  <p className="text-[11px] text-slate-400">{v.company}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-black text-amber-300">
                {v.vehicleNumber || `PLATE-${100 + idx}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Assigned Bay</span>
                <span className="font-extrabold text-indigo-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-indigo-400" /> Bay A-{10 + idx}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Vehicle Type</span>
                <span className="font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
                  {v.vehicleType === 'EV' ? <Zap className="w-3 h-3 text-cyan-400" /> : <Car className="w-3 h-3" />}
                  {v.vehicleType || 'Car'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 font-mono text-[11px]">Host: {v.hostName}</span>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-400" /> Print Permit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
