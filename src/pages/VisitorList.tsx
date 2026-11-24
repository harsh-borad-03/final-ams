import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  X, 
  Edit3, 
  Printer, 
  CheckCircle2, 
  LogOut, 
  UserCheck, 
  Clock,
  ShieldCheck,
  XCircle,
  Trash2
} from 'lucide-react';
import { Visitor, VisitorStatus } from '../types';

interface VisitorListProps {
  visitors: Visitor[];
  setVisitors: React.Dispatch<React.SetStateAction<Visitor[]>>;
  onNavigate: (tab: string) => void;
  onOpenPass: (visitor: Visitor) => void;
  onUpdateStatus: (id: string, newStatus: VisitorStatus, actionTakenBy?: string, reason?: string) => void;
  onDeleteVisitor?: (id: string) => void;
  onClearAllVisitors?: () => void;
}

export const VisitorList: React.FC<VisitorListProps> = ({
  visitors,
  setVisitors,
  onNavigate,
  onOpenPass,
  onUpdateStatus,
  onDeleteVisitor,
  onClearAllVisitors
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const isSearchEmpty = searchQuery.trim() === '';

  // Only filter and show visitors when a search query is typed!
  const filteredVisitors = isSearchEmpty 
    ? [] 
    : visitors.filter((v) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          v.fullName.toLowerCase().includes(query) ||
          v.phone.includes(query) ||
          (v.passCode || '').toLowerCase().includes(query) ||
          v.company.toLowerCase().includes(query) ||
          v.hostName.toLowerCase().includes(query);
        const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
        return matchesQuery && matchesStatus;
      });

  // Export CSV
  const handleExportCSV = () => {
    const headers = "ID,PassCode,Name,Phone,Company,Purpose,InTime,OutTime,Status,ActionTakenBy\n";
    const rows = visitors.map(v => `${v.id},${v.passCode},"${v.fullName}",${v.phone},"${v.company}",${v.purpose},${v.inTime},${v.outTime},${v.status},"${v.actionTakenBy || 'N/A'}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Visitor_List_Export_${Date.now()}.csv`;
    a.click();
  };

  // Export PDF / Print
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">Visitor Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Search-Only Mode: Enter details below to look up visitor records & approval audit trail.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 font-mono">
          {/* Excel Export */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Export to Excel CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>

          {/* PDF Export */}
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Export / Print PDF"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>

          {/* Clear All Records Button */}
          {onClearAllVisitors && (
            <button
              onClick={() => {
                if (window.confirm('Delete all visitor records permanently? This will reset the database to 0 records for fresh server deployment.')) {
                  onClearAllVisitors();
                }
              }}
              className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl border border-rose-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Delete all visitors and clear database"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              Clear All Data
            </button>
          )}

          {/* Add Visitor Button */}
          <button
            onClick={() => onNavigate('visitor-gatepass')}
            className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-purple-600/30 transition-all"
            title="Add Visitor Gatepass"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prominent Search Bar & Filter Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Prominent Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-purple-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus
            placeholder="🔍 Type Visitor Name, Phone Number (e.g. 9876543210), or Pass Code (VP-2026-1001)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border-2 border-purple-200 text-slate-900 text-xs rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-purple-600 focus:bg-white font-mono shadow-inner transition-all font-bold"
          />
        </div>
      </div>

      {/* Main Data Table or Search Required Prompt */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-3">
        {isSearchEmpty ? (
          /* Blank Lookup Prompt */
          <div className="p-16 text-center space-y-4 font-sans">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 font-heading">Search Visitor Directory</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Visitor records are hidden by default. Type the visitor's <span className="font-bold text-purple-600">Name</span>, <span className="font-bold text-purple-600">Phone Number</span>, or <span className="font-bold text-purple-600">Pass Code</span> in the search bar above to look up their information.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Search Lookup Mode Active</span>
            </div>
          </div>
        ) : (
          /* Render Matching Visitor Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">CONTACT</th>
                  <th className="p-4">COMPANY</th>
                  <th className="p-4">TYPE</th>
                  <th className="p-4">TO MEET</th>
                  <th className="p-4">TIME</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">APPROVAL TRAIL</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400 font-mono">
                      No visitor records found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map((vis) => (
                    <tr key={vis.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{vis.phone}</div>
                        <div className="text-[11px] text-slate-500 capitalize font-sans">{vis.fullName}</div>
                      </td>

                      <td className="p-4 font-semibold text-slate-700">{vis.company}</td>

                      <td className="p-4 font-sans font-medium text-slate-600">{vis.purpose}</td>

                      <td className="p-4 font-bold text-slate-800">{vis.hostName}</td>

                      {/* Time Column */}
                      <td className="p-4 font-mono text-[11px]">
                        <div className="text-slate-800 font-bold">In: {vis.inTime}</div>
                        <div className={vis.outTime && vis.outTime !== '--' ? "text-purple-700 font-bold" : "text-slate-400 font-normal"}>
                          Out: {vis.outTime || '--'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold ${
                          vis.status === 'In Premise'
                            ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300 shadow-sm'
                            : vis.status === 'Approved'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : vis.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : vis.status === 'Visited'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {vis.status === 'In Premise' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                          <span>
                            {vis.status === 'In Premise' ? 'Inside Company' : vis.status}
                            {vis.actionTakenBy && vis.status !== 'Pending' && vis.status !== 'In Premise' && (
                              <strong className="ml-1 text-purple-900">
                                ({vis.actionTakenBy.split('(')[0].trim() === 'SA' ? 'Super Admin' : vis.actionTakenBy.split('(')[0].trim()})
                              </strong>
                            )}
                          </span>
                        </span>
                      </td>

                      {/* Audit Trail Badge */}
                      <td className="p-4">
                        {vis.actionTakenBy ? (
                          <div className="text-[11px] font-mono">
                            <span className="font-bold text-slate-800 block">
                              {vis.status === 'Approved' || vis.status === 'In Premise'
                                ? 'Approved by:'
                                : vis.status === 'Visited' || vis.status === 'CHECKED_OUT'
                                ? 'Checked out by:'
                                : vis.status === 'Rejected'
                                ? 'Rejected by:'
                                : 'Action taken by:'}
                            </span>
                            <span className="text-purple-600 font-bold">
                              {vis.actionTakenBy.split('(')[0].trim() === 'SA' ? 'Super Admin' : vis.actionTakenBy.split('(')[0].trim()}
                            </span>
                            {(vis.status === 'Visited' || vis.status === 'CHECKED_OUT') && vis.outTime && vis.outTime !== '--' && (
                              <span className="block text-[10px] text-emerald-700 font-extrabold mt-0.5">
                                at {vis.outTime}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Awaiting Host</span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Check-In / Check-Out Actions */}
                          {vis.status !== 'In Premise' && vis.status !== 'Approved' && vis.status !== 'Visited' && (
                            <button
                              onClick={() => onUpdateStatus(vis.id, 'In Premise')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm"
                              title="Check In Visitor"
                            >
                              Check-In
                            </button>
                          )}

                          {(vis.status === 'In Premise' || vis.status === 'Approved' || vis.status === 'CHECKED_IN') && (
                            <button
                              onClick={() => onUpdateStatus(vis.id, 'Visited')}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-extrabold shadow-sm transition-colors"
                              title="Security Check Out: Record Out-Time and Mark as Departed"
                            >
                              Check-Out
                            </button>
                          )}

                          {vis.status !== 'Rejected' && vis.status !== 'Visited' && (
                            <button
                              onClick={() => onUpdateStatus(vis.id, 'Rejected')}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-sm"
                              title="Reject Visitor"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            onClick={() => onOpenPass(vis)}
                            className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            title="Print Gatepass Badge"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {onDeleteVisitor && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete visitor ${vis.fullName} (${vis.id})? This will permanently remove the record.`)) {
                                  onDeleteVisitor(vis.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Visitor Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
