import React, { useState } from 'react';
import { Shield, Trash2, RefreshCw, AlertTriangle, FileText, Search, CheckCircle2 } from 'lucide-react';
import { mockAuditLogs, mockRecycleBin } from '../../data/mockData';
import { AuditLog, RecycleRecord } from '../../types';

export const AuditLogsAndRecycleBin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'recycle'>('audit');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [recycleRecords, setRecycleRecords] = useState<RecycleRecord[]>(mockRecycleBin);
  const [search, setSearch] = useState('');

  const handleRestore = (id: string) => {
    setRecycleRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handlePermanentDelete = (id: string) => {
    setRecycleRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Audit Trail & Soft Delete Recycle Bin
          </h2>
          <p className="text-xs text-slate-400">Complete compliance logging & soft-deleted record restoration</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs
          </button>
          <button
            onClick={() => setActiveTab('recycle')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recycle'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recycle Bin ({recycleRecords.length})
          </button>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-medium text-slate-200">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-bold text-white">{log.user}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">{log.action}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-300">{log.entityId}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{log.timestamp}</td>
                    <td className="py-3.5 px-4 text-slate-400">{log.location}</td>
                    <td className="py-3.5 px-4 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-medium text-slate-200">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Record Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Deleted By</th>
                  <th className="py-3 px-4">Deletion Time</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recycleRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-bold text-white">{rec.entityName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {rec.entityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{rec.deletedBy}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{rec.deletedAt}</td>
                    <td className="py-3.5 px-4 italic text-slate-400">{rec.reason}</td>
                    <td className="py-3.5 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestore(rec.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1 hover:bg-emerald-600/40"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(rec.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1 hover:bg-rose-600/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
