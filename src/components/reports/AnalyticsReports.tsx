import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, Calendar, Filter, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Visitor } from '../../types';

interface AnalyticsReportsProps {
  visitors: Visitor[];
}

export const AnalyticsReports: React.FC<AnalyticsReportsProps> = ({ visitors }) => {
  const [dateRange, setDateRange] = useState('30d');
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const triggerExport = (format: string) => {
    setExportMessage(`Exporting ${visitors.length} records to ${format}... Download started.`);
    setTimeout(() => setExportMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Export Controls Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Enterprise Visitor Reports & Analytics
          </h3>
          <p className="text-xs text-slate-400">Generate compliance, security audit, and traffic volume reports</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none"
          >
            <option value="today">Today's Log</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="1y">Year to Date (10k entries)</option>
          </select>

          <button
            onClick={() => triggerExport('CSV')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => triggerExport('Excel')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={() => triggerExport('PDF')}
            className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {exportMessage && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {exportMessage}
        </motion.div>
      )}

      {/* Available Pre-built Security Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Daily Visitor Check-In Audit', desc: 'Detailed log of all entry/exit turnstile scans', count: '1,248 Records' },
          { title: 'Department Traffic Breakdown', desc: 'Monthly visitor load by IT, HR, Sales, Ops', count: '3,890 Visits' },
          { title: 'Blacklist & Threat Audit Log', desc: 'Security flags, watchlists & access rejections', count: '3 Incident Logs' },
        ].map((report, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-lg space-y-3">
            <h4 className="text-sm font-extrabold text-white">{report.title}</h4>
            <p className="text-xs text-slate-400">{report.desc}</p>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400">{report.count}</span>
              <button
                onClick={() => triggerExport('PDF')}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px]"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
