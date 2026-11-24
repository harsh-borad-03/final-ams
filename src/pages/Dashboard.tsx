import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Bell, 
  ShieldAlert, 
  Calendar, 
  LogOut, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  Zap
} from 'lucide-react';
import { Visitor, DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
  visitors: Visitor[];
  onNavigate: (tab: string) => void;
  onOpenPass: (visitor: Visitor) => void;
}

type TimeRangeFilter = 'today' | 'week' | 'month' | 'all';

export const Dashboard: React.FC<DashboardProps> = ({
  stats: initialStats,
  visitors,
  onNavigate,
  onOpenPass
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('today');

  // Helper function to extract a valid Date from a visitor record
  const getVisitorDate = (v: Visitor): { dateStr: string; dateObj: Date } | null => {
    let raw = v.validFrom;
    if (!raw || raw.toLowerCase().includes('check') || raw.toLowerCase().includes('until')) {
      raw = v.validTill;
    }
    if (!raw || raw.toLowerCase().includes('check') || raw.toLowerCase().includes('until')) {
      return null;
    }

    const isoMatch = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const year = parseInt(isoMatch[1], 10);
      const month = parseInt(isoMatch[2], 10);
      const day = parseInt(isoMatch[3], 10);
      const dateObj = new Date(year, month - 1, day);
      const normalizedStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { dateStr: normalizedStr, dateObj };
    }

    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = parsed.getMonth() + 1;
      const day = parsed.getDate();
      const normalizedStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return { dateStr: normalizedStr, dateObj: new Date(year, month - 1, day) };
    }

    return null;
  };

  // Helper function to check if a visitor date falls within selected timeRange
  const isDateInRange = (v: Visitor, range: TimeRangeFilter): boolean => {
    if (range === 'all') return true;

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDateNum = now.getDate();
    const todayStr = `${todayYear}-${String(todayMonth + 1).padStart(2, '0')}-${String(todayDateNum).padStart(2, '0')}`;
    const todayObj = new Date(todayYear, todayMonth, todayDateNum);

    const vDateInfo = getVisitorDate(v);

    if (!vDateInfo) {
      if (range === 'today') {
        return v.status === 'In Premise' || v.status === 'Pending';
      }
      return range === 'week' || range === 'month';
    }

    const { dateStr, dateObj } = vDateInfo;

    if (range === 'today') {
      return dateStr === todayStr || dateObj.getTime() === todayObj.getTime();
    }

    const diffDays = Math.round((todayObj.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

    if (range === 'week') {
      return diffDays >= 0 && diffDays <= 7;
    }

    if (range === 'month') {
      const isSameMonth = dateObj.getFullYear() === todayYear && dateObj.getMonth() === todayMonth;
      return isSameMonth || (diffDays >= 0 && diffDays <= 30);
    }

    return true;
  };

  // Filter visitors dynamically according to timeRange
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => isDateInRange(v, timeRange));
  }, [visitors, timeRange]);

  // Compute live stats based on filtered data
  const currentStats = useMemo<DashboardStats>(() => {
    return {
      totalVisitors: filteredVisitors.length,
      inPremise: filteredVisitors.filter((v) => v.status === 'In Premise').length,
      pending: filteredVisitors.filter((v) => v.status === 'Pending').length,
      rejected: filteredVisitors.filter((v) => v.status === 'Rejected').length,
      upcoming: filteredVisitors.filter((v) => v.status === 'Approved').length,
      visited: filteredVisitors.filter((v) => v.status === 'Visited' || v.status === 'CHECKED_OUT').length
    };
  }, [filteredVisitors]);

  // Dynamic trend labels depending on timeRange
  const getTrend = (type: 'total' | 'premise' | 'pending' | 'rejected' | 'upcoming' | 'visited') => {
    switch (timeRange) {
      case 'today':
        if (type === 'total') return "Today's Live Flow";
        if (type === 'premise') return 'Live Active';
        if (type === 'pending') return 'Action Required';
        if (type === 'rejected') return '0% Flags';
        if (type === 'upcoming') return 'Scheduled Today';
        return 'Checked Out Today';
      case 'week':
        if (type === 'total') return '+14% this week';
        if (type === 'premise') return 'Active This Week';
        if (type === 'pending') return 'Awaiting Host';
        if (type === 'rejected') return 'Weekly Rejected';
        if (type === 'upcoming') return 'Scheduled This Week';
        return 'Completed This Week';
      case 'month':
        if (type === 'total') return '+28% this month';
        if (type === 'premise') return 'Monthly Active';
        if (type === 'pending') return 'Pending Queue';
        if (type === 'rejected') return 'Monthly Refusals';
        if (type === 'upcoming') return 'Scheduled This Month';
        return 'Completed This Month';
      default:
        if (type === 'total') return 'Cumulative Records';
        if (type === 'premise') return 'Currently Inside';
        if (type === 'pending') return 'Total Pending';
        if (type === 'rejected') return 'Total Rejected';
        if (type === 'upcoming') return 'Total Upcoming';
        return 'Total Completed';
    }
  };

  const cards = [
    {
      title: 'TOTAL VISITORS',
      value: currentStats.totalVisitors,
      icon: Users,
      trend: getTrend('total'),
      subtext: timeRange === 'today' ? 'Entries recorded today' : timeRange === 'week' ? 'Entries recorded this week' : timeRange === 'month' ? 'Entries recorded this month' : 'All cumulative records',
      gradient: 'from-violet-600 to-purple-600',
      bgColor: 'bg-violet-500/10 text-violet-600'
    },
    {
      title: 'IN PREMISE',
      value: currentStats.inPremise,
      icon: Building2,
      trend: getTrend('premise'),
      subtext: 'Currently inside facility',
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10 text-emerald-600',
      isLive: true
    },
    {
      title: 'PENDING',
      value: currentStats.pending,
      icon: Bell,
      trend: getTrend('pending'),
      subtext: 'Awaiting host check-in',
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10 text-amber-600'
    },
    {
      title: 'REJECTED',
      value: currentStats.rejected,
      icon: ShieldAlert,
      trend: getTrend('rejected'),
      subtext: 'Refused entry attempts',
      gradient: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-500/10 text-rose-600'
    },
    {
      title: 'UPCOMING',
      value: currentStats.upcoming,
      icon: Calendar,
      trend: getTrend('upcoming'),
      subtext: 'Pre-registered visits',
      gradient: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10 text-blue-600'
    },
    {
      title: 'VISITED',
      value: currentStats.visited,
      icon: LogOut,
      trend: getTrend('visited'),
      subtext: 'Completed site visits',
      gradient: 'from-indigo-600 to-purple-700',
      bgColor: 'bg-indigo-500/10 text-indigo-600'
    }
  ];

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'today': return "Today's Activity";
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      default: return 'All Time';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 space-y-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">Dashboard Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-mono font-bold uppercase tracking-wider border border-purple-200">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Welcome back, <span className="font-semibold text-slate-800">Security Officer</span>. Showing metrics for{' '}
            <span className="font-bold text-purple-700">{getTimeRangeLabel()}</span>.
          </p>
        </div>

        {/* Time Filter & Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 hover:border-purple-500 rounded-2xl px-3.5 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-purple-500">
            <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRangeFilter)}
              className="bg-transparent text-slate-800 text-xs font-bold font-mono focus:outline-none cursor-pointer pr-1"
            >
              <option value="today">Today's Activity</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('visitor-gatepass')}
            className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Gatepass</span>
          </button>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={`${idx}-${timeRange}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all space-y-4 relative overflow-hidden group"
            >
              {/* Subtle top bar accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />

              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${card.bgColor} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 font-medium">
                  {card.isLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-emerald" />
                  )}
                  <span>{card.trend}</span>
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{card.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 font-mono">{card.title}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between font-sans">
                <span>{card.subtext}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-purple-600 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Visitors Table Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 font-heading">
                Visitor Entries ({getTimeRangeLabel()})
              </h2>
              <p className="text-[11px] text-slate-400">
                {filteredVisitors.length} record{filteredVisitors.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('all-visitors')}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold font-mono transition-colors flex items-center gap-1"
          >
            <span>View All Visitors</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {filteredVisitors.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs space-y-3">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <p>No visitor entries recorded for <strong className="text-slate-700">{getTimeRangeLabel()}</strong>.</p>
              <button
                onClick={() => setTimeRange('all')}
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold font-mono transition-colors"
              >
                View All Time Records
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3">VISITOR INFO</th>
                  <th className="pb-3">HOST / TO MEET</th>
                  <th className="pb-3">DATE / IN TIME</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">GATEPASS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {filteredVisitors.slice(0, 6).map((vis) => (
                  <tr key={vis.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900 capitalize font-sans">{vis.fullName}</div>
                      <div className="text-[11px] text-slate-400">{vis.phone} • <span className="font-semibold text-slate-600">{vis.company}</span></div>
                    </td>

                    <td className="py-3.5 font-sans">
                      <div className="font-bold text-slate-800">{vis.hostName}</div>
                      <div className="text-[11px] text-slate-400">{vis.department}</div>
                    </td>

                    <td className="py-3.5 text-slate-600">
                      <div className="font-bold text-slate-800">{vis.inTime}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{vis.validFrom || 'Today'}</div>
                    </td>

                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        vis.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : vis.status === 'In Premise'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : vis.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {vis.status === 'In Premise' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        <span>
                          {vis.status}
                          {vis.actionTakenBy && vis.status !== 'Pending' && (
                            <strong className="ml-1 text-purple-900">
                              ({vis.actionTakenBy.split('(')[0].trim() === 'SA' ? 'Super Admin' : vis.actionTakenBy.split('(')[0].trim()})
                            </strong>
                          )}
                        </span>
                      </span>
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onOpenPass(vis)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        Print Pass
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};
