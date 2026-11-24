import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertTriangle, Monitor, Key, LogOut, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import { mockLoginActivity, mockSecurityAlerts, mockSessions } from '../../data/mockData';
import { LoginActivity, SecurityAlert, UserSession } from '../../types';

export const SecurityCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'activity' | 'sessions'>('overview');
  const [loginLogs] = useState<LoginActivity[]>(mockLoginActivity);
  const [alerts] = useState<SecurityAlert[]>(mockSecurityAlerts);
  const [sessions, setSessions] = useState<UserSession[]>(mockSessions);

  const handleForceLogout = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Super Admin Security Command Center</h2>
            <p className="text-xs text-slate-400">Zero-Trust Threat Monitoring, Login Audit & Session Security</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Security Overview
          </button>
          <button
            onClick={() => setActiveSubTab('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'activity'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Login Activity
          </button>
          <button
            onClick={() => setActiveSubTab('sessions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'sessions'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Active Sessions ({sessions.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Security Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Failed Logins</span>
              <span className="text-3xl font-black text-rose-400 block mt-1">24</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Suspicious Accounts</span>
              <span className="text-3xl font-black text-amber-400 block mt-1">3</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Active Sessions</span>
              <span className="text-3xl font-black text-emerald-400 block mt-1">87</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Suspended Users</span>
              <span className="text-3xl font-black text-orange-400 block mt-1">7</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Security Alerts</span>
              <span className="text-3xl font-black text-purple-400 block mt-1">3</span>
            </div>
          </div>

          {/* Security Alerts Timeline */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Active Security Anomaly Alerts
            </h3>

            <div className="space-y-3">
              {alerts.map((alt) => (
                <div key={alt.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alt.severity === 'high'
                          ? 'bg-rose-500 animate-ping'
                          : alt.severity === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <div>
                      <p className="font-extrabold text-sm text-white">{alt.title}</p>
                      <p className="text-xs text-slate-400">{alt.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500">{alt.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'activity' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400" /> Authentication Login Activity Log
          </h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-medium text-slate-200">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Device & OS</th>
                  <th className="py-3.5 px-4">Browser</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Login Time</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loginLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-bold text-white">{log.userName} ({log.userEmail})</td>
                    <td className="py-3.5 px-4 text-slate-300">{log.device}</td>
                    <td className="py-3.5 px-4 text-slate-400">{log.browser}</td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400">{log.ip}</td>
                    <td className="py-3.5 px-4 text-slate-300">{log.location}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{log.loginTime}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          log.status === 'Successful'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : log.status === 'Blocked'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'sessions' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" /> Live Concurrent Active User Sessions
          </h3>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div key={sess.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-extrabold text-sm text-white">{sess.device}</p>
                    <p className="text-xs text-slate-400">{sess.location} • IP: {sess.ip}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleForceLogout(sess.id)}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Force Logout Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
