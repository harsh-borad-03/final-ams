import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { ShieldCheck, TrendingUp, Clock, Users, ShieldAlert, CheckCircle2, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { Visitor } from '../../types';

interface SecurityHeatmapDashboardProps {
  visitors: Visitor[];
}

const PEAK_HOURS_DATA = [
  { time: '08:00 AM', visitors: 12, gate: 'Main Entrance' },
  { time: '09:00 AM', visitors: 48, gate: 'Main Entrance' },
  { time: '10:00 AM', visitors: 65, gate: 'Main Entrance' },
  { time: '11:00 AM', visitors: 34, gate: 'Main Entrance' },
  { time: '12:00 PM', visitors: 22, gate: 'Main Entrance' },
  { time: '01:00 PM', visitors: 40, gate: 'Main Entrance' },
  { time: '02:00 PM', visitors: 58, gate: 'Main Entrance' },
  { time: '03:00 PM', visitors: 29, gate: 'Main Entrance' },
  { time: '04:00 PM', visitors: 18, gate: 'Main Entrance' },
  { time: '05:00 PM', visitors: 8, gate: 'Main Entrance' },
];

const GATE_TRAFFIC_DATA = [
  { gate: 'Main Lobby Gate', count: 182, load: 'High' },
  { gate: 'Parking Gate A', count: 94, load: 'Medium' },
  { gate: 'VIP Executive Gate', count: 38, load: 'Optimal' },
  { gate: 'Service Entrance B', count: 24, load: 'Low' },
];

export const SecurityHeatmapDashboard: React.FC<SecurityHeatmapDashboardProps> = ({ visitors }) => {
  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold uppercase tracking-wider">
              Real-Time Security Intelligence
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">Visitor Traffic Heatmap & Response Metrics</h2>
          <p className="text-xs text-slate-400">Peak hour analysis, gate throughput, and host response latency breakdown</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Host Response Time</span>
            <p className="text-sm font-extrabold text-emerald-400">2.4 mins</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">Peak Entry Hour</span>
            <h3 className="text-2xl font-black text-white mt-1">10:00 AM</h3>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> 65 check-ins/hr
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">Busiest Access Point</span>
            <h3 className="text-xl font-black text-white mt-1">Main Entrance</h3>
            <span className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 mt-1">
              <Zap className="w-3.5 h-3.5" /> 54% total volume
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">Security Clearance</span>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">99.8%</h3>
            <span className="text-[11px] font-semibold text-slate-400 mt-1">Passed watchlist check</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">Blacklist Flag Alerts</span>
            <h3 className="text-2xl font-black text-rose-400 mt-1">0 Active</h3>
            <span className="text-[11px] font-semibold text-slate-400 mt-1">Facility secure</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recharts Traffic Bar Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" /> Hourly Visitor Volume Heatmap Breakdown
        </h3>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={PEAK_HOURS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '1rem', color: '#fff' }}
              />
              <Bar dataKey="visitors" radius={[8, 8, 0, 0]}>
                {PEAK_HOURS_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.visitors > 50 ? '#6366f1' : entry.visitors > 30 ? '#38bdf8' : '#34d399'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
