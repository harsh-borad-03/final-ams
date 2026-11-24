import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Search, 
  FileSpreadsheet, 
  FileCode, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Printer, 
  CheckCircle2, 
  Zap, 
  Server, 
  RefreshCw,
  Lock,
  ShieldCheck,
  UserCheck,
  XCircle,
  ShieldAlert,
  LogOut,
  Trash2,
  Link2,
  Copy,
  Check,
  X
} from 'lucide-react';
import { Visitor, VisitorStatus, UserProfile } from '../types';
import { API_BASE_URL } from '../config';

interface VisitorDatabaseSQLProps {
  currentUser: UserProfile;
  onOpenPass: (visitor: Visitor) => void;
  onNavigate: (tab: string) => void;
  onUpdateStatus?: (id: string, newStatus: VisitorStatus, actionTakenBy?: string, reason?: string) => void;
  onDeleteVisitor?: (id: string) => void;
}

export const VisitorDatabaseSQL: React.FC<VisitorDatabaseSQLProps> = ({
  currentUser,
  onOpenPass,
  onNavigate,
  onUpdateStatus,
  onDeleteVisitor
}) => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const [queryTimeMs, setQueryTimeMs] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dbConfig, setDbConfig] = useState<any>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [inputConnString, setInputConnString] = useState<string>('');
  const [connMessage, setConnMessage] = useState<string>('');
  const [isTestingConn, setIsTestingConn] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const isSecurity = currentUser.role === 'Security';
  const isSuperAdmin = currentUser.role === 'Super Admin';
  const isSearchRequired = isSecurity && searchQuery.trim() === '';

  const handleCopyConnectionString = () => {
    const textToCopy = dbConfig?.rawConnectionString || dbConfig?.connectionString || inputConnString;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveConnectionString = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingConn(true);
    setConnMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/database/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionString: inputConnString })
      });
      const data = await res.json();
      if (data.status) {
        setDbConfig(data.status);
      }
      setConnMessage(data.message || (data.success ? 'Connected successfully!' : 'Connection failed.'));
      if (data.success) {
        fetchVisitors();
      }
    } catch (err: any) {
      setConnMessage(`Configuration Error: ${err.message}`);
    } finally {
      setIsTestingConn(false);
    }
  };

  // Fetch database status
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/database/config`)
      .then(res => res.json())
      .then(data => setDbConfig(data))
      .catch(() => {});
  }, []);

  // Fetch from Express SQL Server 2014 Backend API
  const fetchVisitors = async () => {
    // If Security role and search query is empty, do NOT show database bulk records
    if (isSearchRequired) {
      setVisitors([]);
      setFilteredCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const url = `${API_BASE_URL}/api/visitors?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&page=${currentPage}&limit=${limit}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors);
        setTotalRecords(data.totalRecords);
        setFilteredCount(data.filteredCount);
        setTotalPages(data.totalPages);
        setQueryTimeMs(data.queryTimeMs);
      }
    } catch (err) {
      console.warn('Backend API connection warning, fallback to client indexing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [searchQuery, statusFilter, currentPage, limit, isSearchRequired]);

  const handleUpdateStatus = async (id: string, newStatus: VisitorStatus) => {
    const updaterName = `${currentUser.name} (${currentUser.role})`;
    const isCheckingOut = newStatus === 'Visited' || newStatus === 'CHECKED_OUT';
    const nowTime = isCheckingOut 
      ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) 
      : undefined;

    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus, updaterName);
    }

    try {
      await fetch(`${API_BASE_URL}/api/visitors/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actionTakenBy: updaterName,
          outTime: nowTime
        })
      });
      fetchVisitors();
    } catch (err) {
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status: newStatus,
                finalStatus: newStatus,
                employeeStatus: newStatus,
                actionTakenBy: updaterName,
                outTime: isCheckingOut ? nowTime! : v.outTime
              }
            : v
        )
      );
    }
  };

  const handleDeleteVisitorRecord = async (id: string, name: string) => {
    if (!window.confirm(`Delete visitor record for "${name}" (${id}) permanently?`)) {
      return;
    }
    if (onDeleteVisitor) {
      onDeleteVisitor(id);
    }
    try {
      await fetch(`${API_BASE_URL}/api/visitors/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete error:', err);
    }
    fetchVisitors();
  };

  const handleDownloadSQLDump = () => {
    window.location.href = `${API_BASE_URL}/api/export/sql`;
  };

  const handleDownloadCSV = () => {
    const headers = "ID,PassCode,Name,Phone,Company,Purpose,InTime,OutTime,Status,ActionTakenBy\n";
    const rows = visitors.map(v => `${v.id},${v.passCode},"${v.fullName}",${v.phone},"${v.company}",${v.purpose},${v.inTime},${v.outTime},${v.status},"${v.actionTakenBy || 'N/A'}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Visitor_Management_SQLServer_Export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-7xl mx-auto space-y-6 font-sans"
    >
      {/* Title & Database Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">Visitor Database</h1>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
              <Server className="w-3.5 h-3.5 text-purple-600" />
              {isSecurity ? 'Security Gate Search Mode' : `SQL Server 2014 (${totalRecords.toLocaleString()} Records)`}
            </span>
            {dbConfig && (
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm border ${
                dbConfig.isConnected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-blue-50 text-blue-700 border-blue-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dbConfig.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                {dbConfig.isConnected ? 'SQL Server Live' : 'SQL Server 2014 File Store'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isSecurity 
              ? 'Security Officer Mode: Enter visitor details below to verify host approval & action trail.' 
              : 'Microsoft SQL Server 2014 Enterprise Visitor Vault • Real-Time Employee & Admin Approval Audit Trail'}
          </p>
        </div>

        {/* Export & Connection String Buttons (Visible for Super Admin / Admin) */}
        {!isSecurity && (
          <div className="flex items-center gap-2 font-mono flex-wrap">
            <button
              onClick={() => {
                setInputConnString(dbConfig?.rawConnectionString || dbConfig?.connectionString || '');
                setIsConfigModalOpen(true);
                setConnMessage('');
              }}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
              title="Configure SQL Server Connection String"
            >
              <Link2 className="w-4 h-4" />
              Connection String
            </button>

            <button
              onClick={handleDownloadSQLDump}
              className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02]"
              title="Download Microsoft SQL Server 2014 T-SQL (.sql) File"
            >
              <FileCode className="w-4 h-4" />
              Export SQL Server (.sql)
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:scale-[1.02]"
              title="Export CSV Log"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Performance & Security Indicator Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between font-mono text-xs border border-purple-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10 overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            {isSecurity ? <Lock className="w-6 h-6 text-purple-400" /> : <Zap className="w-6 h-6 text-amber-400" />}
          </div>
          <div className="overflow-hidden">
            <div className="font-extrabold text-slate-100 text-base font-heading tracking-wide">
              {isSecurity ? (
                <span>Security Search Mode: <span className="text-purple-400">Search to View Visitor Info</span></span>
              ) : (
                <span>Total Database Index: <span className="text-purple-400">{totalRecords.toLocaleString()}</span> Visitors</span>
              )}
            </div>
            <div className="text-slate-400 text-[11px] mt-0.5 truncate">
              {isSecurity 
                ? '🔒 Gate Security: Type visitor name/phone to verify if approved by Employee or Admin.' 
                : (
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span>Speed: {queryTimeMs} ms • Connection:</span>
                    <code className="text-purple-300 font-mono text-[10px] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/60 truncate max-w-sm inline-block">
                      {dbConfig?.connectionString || 'Loading...'}
                    </code>
                  </span>
                )}
            </div>
          </div>
        </div>

        <button
          onClick={fetchVisitors}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Bar & Filters */}
      <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            autoFocus={isSecurity}
            placeholder={isSecurity ? "🔍 Type Visitor Name, Phone (e.g. 9876543210), or Pass Code (VP-2026-00001)..." : "Search database records (Name, Phone, Pass Code...)"}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 border-2 border-purple-200 text-slate-900 text-xs rounded-2xl pl-10 pr-4 py-3 focus:outline-none focus:border-purple-600 focus:bg-white font-mono shadow-inner transition-all font-bold"
          />
        </div>

        {/* Status Filter Pills */}
        {!isSecurity && (
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl font-mono text-xs">
            {['All', 'Pending', 'In Premise', 'Visited', 'Approved', 'Rejected'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Database Table or Security Prompt */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-2">
        {isSearchRequired ? (
          /* Blank Security Lookup Prompt */
          <div className="p-16 text-center space-y-4 font-sans">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 font-heading">Security Visitor Lookup Required</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Type the arriving visitor's <span className="font-bold text-purple-600">Name</span>, <span className="font-bold text-purple-600">Phone Number</span>, or <span className="font-bold text-purple-600">Pass Code</span> in the search bar above to verify employee approval.
              </p>
            </div>
          </div>
        ) : (
          /* Main Table View when searching or for Super Admin */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">ID / PASS CODE</th>
                  <th className="p-4">FULL NAME</th>
                  <th className="p-4">PHONE NUMBER</th>
                  <th className="p-4">PURPOSE</th>
                  <th className="p-4">HOST / TO MEET</th>
                  <th className="p-4">TIME</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">APPROVAL AUDIT TRAIL</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-400 font-mono">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-600" />
                      Searching Visitor Database...
                    </td>
                  </tr>
                ) : visitors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-slate-400 font-mono">
                      No visitor records found matching "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  visitors.map((vis) => (
                    <tr key={vis.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="p-4">
                        <div className="font-extrabold text-purple-600 font-mono">{vis.passCode}</div>
                        <div className="text-[10px] text-slate-400">{vis.id}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900 font-sans capitalize">{vis.fullName}</div>
                        <div className="text-[10px] text-slate-400">{vis.email}</div>
                      </td>

                      <td className="p-4 font-bold text-slate-700">{vis.phone}</td>

                      <td className="p-4 font-sans font-medium text-slate-600">{vis.purpose}</td>

                      <td className="p-4 font-bold text-slate-800">{vis.hostName}</td>

                      {/* In & Out Time Column */}
                      <td className="p-4 font-mono text-[11px]">
                        <div className="text-slate-800 font-bold">In: {vis.inTime}</div>
                        <div className={vis.outTime && vis.outTime !== '--' ? "text-purple-700 font-bold" : "text-slate-400 font-normal"}>
                          Out: {vis.outTime || '--'}
                        </div>
                      </td>

                      {/* Live Synchronized Status Badge */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          vis.status === 'Approved' || vis.status === 'In Premise'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : vis.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : vis.status === 'Visited'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
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

                      {/* Audit Trail Badge (Who Approved, Checked Out, or Rejected it) */}
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
                          <span className="text-slate-400 text-[10px] italic">Awaiting Host Action</span>
                        )}
                      </td>

                      {/* Actions Column with Admin Override */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Allow Admin / Super Admin to approve or override */}
                          {(!isSecurity || vis.status === 'Pending') && (
                            <>
                              {vis.status !== 'In Premise' && vis.status !== 'Approved' && (
                                <button
                                  onClick={() => handleUpdateStatus(vis.id, 'In Premise')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm"
                                  title="Approve / Check-In Visitor"
                                >
                                  Check-In
                                </button>
                              )}
                              {vis.status !== 'Rejected' && vis.status !== 'Visited' && (
                                <button
                                  onClick={() => handleUpdateStatus(vis.id, 'Rejected')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-sm"
                                  title="Deny / Reject Visitor"
                                >
                                  Reject
                                </button>
                              )}
                            </>
                          )}

                          {(vis.status === 'In Premise' || vis.status === 'Approved' || vis.status === 'CHECKED_IN') && (
                            <button
                              onClick={() => handleUpdateStatus(vis.id, 'Visited')}
                              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                              title="Check Out Visitor from Building & Record Exact Time"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Check-Out
                            </button>
                          )}

                          <button
                            onClick={() => onOpenPass(vis)}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                            title="Print Pass Badge"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {!isSecurity && (
                            <button
                              onClick={() => handleDeleteVisitorRecord(vis.id, vis.fullName)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Delete Record Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* High-Volume Pagination Control Bar */}
        {!isSearchRequired && (
          <div className="p-4.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-600">
            <div>
              Showing <strong className="text-slate-900">{((currentPage - 1) * limit) + 1}</strong> - <strong className="text-slate-900">{Math.min(currentPage * limit, filteredCount)}</strong> of <strong className="text-purple-600 font-extrabold">{filteredCount.toLocaleString()}</strong> matching records
            </div>

            <div className="flex items-center gap-3">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-mono font-bold text-xs"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1.5 bg-purple-50 text-purple-700 font-extrabold rounded-xl border border-purple-200">
                  Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Microsoft SQL Server Connection String Configuration Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 w-full max-w-2xl rounded-3xl shadow-2xl p-6 flex flex-col font-sans space-y-5 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-heading">
                    Microsoft SQL Server Connection String
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Configure live database connection for IIS and Express API
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Connection Status Badge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono ${
              dbConfig?.isConnected 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${dbConfig?.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <div>
                  <strong className="block font-bold">
                    {dbConfig?.isConnected ? 'Connected: Live SQL Server Engine Active' : 'Status: File Persistence Mode (Dual Storage)'}
                  </strong>
                  <span className="text-[10px] text-slate-600 block mt-0.5">
                    {dbConfig?.isConnected 
                      ? `Database [${dbConfig?.database}] on ${dbConfig?.server}:${dbConfig?.port}` 
                      : (dbConfig?.lastError || 'SQL Server host offline. Changes are saved to .sql / .json files.')}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border">
                {dbConfig?.engine || 'SQL Server 2014'}
              </span>
            </div>

            {/* Connection String Form */}
            <form onSubmit={handleSaveConnectionString} className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 text-xs">
                    SQL Server Connection String:
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyConnectionString}
                    className="inline-flex items-center gap-1 text-[11px] text-purple-600 hover:text-purple-800 font-bold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Connection String'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={inputConnString}
                  onChange={(e) => setInputConnString(e.target.value)}
                  placeholder="Server=localhost;Database=vms_of_ams;User Id=sa;Password=your_password;TrustServerCertificate=True;Encrypt=False;"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {/* Quick Template Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets / Examples:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setInputConnString("Server=localhost;Database=vms_of_ams;User Id=sa;Password=;TrustServerCertificate=True;Encrypt=False;")}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-left text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    <strong>Standard SQL Auth (sa)</strong>
                    <div className="text-[9px] text-slate-400 truncate">Server=localhost;User Id=sa;...</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputConnString("Server=localhost;Database=vms_of_ams;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False;")}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-left text-slate-700 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    <strong>Windows Authentication</strong>
                    <div className="text-[9px] text-slate-400 truncate">Trusted_Connection=True;...</div>
                  </button>
                </div>
              </div>

              {/* Status Message Alert */}
              {connMessage && (
                <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 border ${
                  connMessage.toLowerCase().includes('success') 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {connMessage.toLowerCase().includes('success') ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{connMessage}</span>
                </div>
              )}

              {/* IIS / web.config Information Hint */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-[11px] text-slate-600">
                <strong className="block text-slate-800">📌 IIS web.config Integration:</strong>
                <p>
                  This connection string is also configured in <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded">web.config</code> under <code className="text-purple-700 bg-purple-50 px-1 py-0.5 rounded">&lt;connectionStrings&gt;</code> and can be edited directly inside IIS Manager.
                </p>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isTestingConn}
                  className="flex-[2] py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isTestingConn ? 'animate-spin' : ''}`} />
                  <span>{isTestingConn ? 'Testing Connection...' : 'Apply & Test Connection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
