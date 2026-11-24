import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, Building, MapPin, Search, Filter, ShieldCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { Visitor } from '../types';

interface CurrentlyInsidePageProps {
  visitors: Visitor[];
  onUpdateStatus: (id: string, status: Visitor['status']) => void;
  onSelectVisitor: (visitor: Visitor) => void;
}

export const CurrentlyInsidePage: React.FC<CurrentlyInsidePageProps> = ({
  visitors,
  onUpdateStatus,
  onSelectVisitor,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Visitors' | 'Employees' | 'Contractors'>('All');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Live timer tick
  const [elapsedMinutes, setElapsedMinutes] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedMinutes((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const checkedInVisitors = visitors.filter((v) => v.status === 'In Premise' || v.status === 'Approved' || v.status === 'CHECKED_IN');

  const filtered = checkedInVisitors.filter((v) => {
    const matchesTab =
      activeTab === 'All' ||
      (activeTab === 'Visitors' && v.category !== 'Contractor') ||
      (activeTab === 'Contractors' && v.category === 'Contractor');

    const matchesSearch =
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.company.toLowerCase().includes(search.toLowerCase()) ||
      v.hostName.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || (v.departmentName || v.department) === selectedDept;

    return matchesTab && matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Currently Inside Facility Roster
          </h1>
          <p className="text-xs text-slate-400">
            Real-time live occupancy list of verified guests currently inside corporate gates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{checkedInVisitors.length} Persons Inside</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {(['All', 'Visitors', 'Employees', 'Contractors'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab} Occupancy
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search active guest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance & Accounts">Finance & Accounts</option>
            <option value="Corporate Sales">Corporate Sales</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((visitor, idx) => (
          <motion.div
            key={visitor.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 shadow-xl space-y-4 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={visitor.photoUrl}
                  alt={visitor.fullName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300">{visitor.fullName}</h4>
                  <p className="text-xs text-slate-400">{visitor.company}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Host Employee:</span>
                <span className="font-bold text-slate-200">{visitor.hostName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Department:</span>
                <span className="font-bold text-indigo-300">{visitor.departmentName || visitor.department}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Entry Gate:</span>
                <span className="font-mono text-cyan-400">{visitor.gateName || 'Main Turnstile 1'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold">
                <Clock className="w-4 h-4" />
                <span>Inside for {elapsedMinutes + idx * 15}m</span>
              </div>

              <button
                onClick={() => onUpdateStatus(visitor.id, 'Visited')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <LogOut className="w-3.5 h-3.5" /> Check Out
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
