import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Download,
  LogOut,
  CheckCircle2,
  QrCode,
  ArrowUpDown,
  ShieldAlert,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import { Visitor, VisitorStatus } from '../../types';
import { getStatusBadgeStyle } from '../../utils/formatters';
import { exportVisitorsToCSV } from '../../utils/csvExporter';

interface VisitorsTableProps {
  visitors: Visitor[];
  onSelectVisitor: (visitor: Visitor) => void;
  onUpdateStatus: (id: string, status: VisitorStatus) => void;
  onOpenPass: (visitor: Visitor) => void;
  onOpenRegister: () => void;
}

export const VisitorsTable: React.FC<VisitorsTableProps> = ({
  visitors,
  onSelectVisitor,
  onUpdateStatus,
  onOpenPass,
  onOpenRegister,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'fullName' | 'checkInTime' | 'company'>('fullName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filtered = visitors.filter((v) => {
    const matchesQuery =
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (v.visitorId || v.id).toLowerCase().includes(search.toLowerCase()) ||
      v.company.toLowerCase().includes(search.toLowerCase()) ||
      v.hostName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || v.departmentName === departmentFilter;

    return matchesQuery && matchesStatus && matchesDept;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField] || '';
    const valB = b[sortField] || '';
    if (sortOrder === 'asc') return valA.localeCompare(valB);
    return valB.localeCompare(valA);
  });

  const handleSort = (field: 'fullName' | 'checkInTime' | 'company') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    exportVisitorsToCSV(sorted, `auravms_visitors_${new Date().toISOString().substring(0, 10)}.csv`);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
      {/* Table Controls Header */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/40">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search visitor, host, ID or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPECTED">Expected</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Download CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
            title="Download CSV spreadsheet of visible visitors"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Visitor Data ({sorted.length})
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Visitor</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">
                  Company <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Host Staff</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Purpose</th>
              <th className="py-3.5 px-4">Check-In</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs font-medium text-slate-200">
            {sorted.length > 0 ? (
              sorted.map((visitor, idx) => {
                const badge = getStatusBadgeStyle(visitor.status);
                return (
                  <motion.tr
                    key={visitor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => onSelectVisitor(visitor)}
                  >
                    {/* Visitor */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={visitor.photoUrl}
                          alt={visitor.fullName}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all"
                        />
                        <div>
                          <p className="font-extrabold text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {visitor.fullName}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400">{visitor.visitorId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-3 px-4 text-slate-300 font-semibold">{visitor.company}</td>

                    {/* Host */}
                    <td className="py-3 px-4">
                      <p className="text-slate-200 font-semibold">{visitor.hostName}</p>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-bold text-indigo-400">
                        {visitor.departmentName}
                      </span>
                    </td>

                    {/* Purpose */}
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{visitor.purpose}</td>

                    {/* Check In Time */}
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {visitor.checkInTime || visitor.expectedCheckIn || '—'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                        {badge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPass(visitor)}
                          className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                          title="Print / View Digital Pass"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {visitor.status === 'CHECKED_IN' ? (
                          <button
                            onClick={() => onUpdateStatus(visitor.id, 'CHECKED_OUT')}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            title="Check Out Visitor"
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateStatus(visitor.id, 'CHECKED_IN')}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            title="Check In Visitor"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <ShieldAlert className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="text-sm font-bold text-slate-300">No matching visitor entries found</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your filters or search query.</p>
                    <button
                      onClick={onOpenRegister}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg"
                    >
                      + Register Visitor
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
