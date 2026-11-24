import React, { useState } from 'react';
import { Database, Archive, HardDrive, Download, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { mockArchives, mockBackups } from '../../data/mockData';
import { ArchiveRecord, BackupRecord } from '../../types';

export const DataRetentionAndBackups: React.FC = () => {
  const [retentionPolicy, setRetentionPolicy] = useState('7 Years');
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);
  const [archives] = useState<ArchiveRecord[]>(mockArchives);

  const handleCreateBackup = () => {
    const newBak: BackupRecord = {
      id: `bak-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      size: '1.82 GB',
      status: 'Successful',
      createdBy: 'Manual Trigger (Admin)',
    };
    setBackups([newBak, ...backups]);
  };

  return (
    <div className="space-y-8">
      {/* Retention Policy Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Visitor Data Retention Policy Settings
          </h3>
          <p className="text-xs text-slate-400">Automated deletion and archiving policies managed by Django/PostgreSQL backend</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Keep Forever', '5 Years', '7 Years', '10 Years', 'Custom Policy'].map((policy) => (
            <button
              key={policy}
              onClick={() => setRetentionPolicy(policy)}
              className={`p-4 rounded-2xl border text-xs font-bold transition-all text-center ${
                retentionPolicy === policy
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {policy}
            </button>
          ))}
        </div>
      </div>

      {/* Backup Management */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" /> Database Backup & Snapshot Management
            </h3>
            <p className="text-xs text-slate-400">PostgreSQL automated daily backups and point-in-time recovery</p>
          </div>

          <button
            onClick={handleCreateBackup}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Trigger Immediate Backup
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs font-medium text-slate-200">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">Backup Timestamp</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created By</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {backups.map((bak) => (
                <tr key={bak.id} className="hover:bg-slate-800/50">
                  <td className="py-3.5 px-4 font-bold text-white">{bak.timestamp}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{bak.size}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ {bak.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{bak.createdBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 ml-auto">
                      <Download className="w-3.5 h-3.5" /> Download Snapshot
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yearly Data Archives */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-purple-400" /> Yearly Visitor Data Archives
          </h3>
          <p className="text-xs text-slate-400">Historical records partitioned by calendar year for long-term compliance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {archives.map((arc) => (
            <div key={arc.year} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-white">{arc.year} Archive</span>
                <span className="text-xs font-mono text-indigo-400 font-bold">{arc.fileSize}</span>
              </div>
              <p className="text-xs text-slate-400 font-bold">{(arc.totalRecords || arc.recordCount || 0).toLocaleString()} Visitor Records</p>
              <p className="text-[10px] text-slate-500">Archived on: {arc.archivedDate}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
