import React, { useState } from 'react';
import { Shield, Key, Smartphone, Monitor, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';
import { mockSessions } from '../../data/mockData';
import { UserSession } from '../../types';

export const SecuritySessionsTab: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>(mockSessions);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const handleSignOutDevice = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Password Management */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" /> Account Security & Password
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
            />
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg">
          Update Security Password
        </button>
      </div>

      {/* Two-Factor Authentication (2FA) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-emerald-400" />
          <div>
            <h4 className="text-sm font-extrabold text-white">Two-Factor Authentication (2FA / OTP)</h4>
            <p className="text-xs text-slate-400">Require an authenticator app code for security clearance login</p>
          </div>
        </div>

        <button
          onClick={() => setIs2FAEnabled(!is2FAEnabled)}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs transition-all border ${
            is2FAEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {is2FAEnabled ? '✓ 2FA Enabled' : 'Enable 2FA'}
        </button>
      </div>

      {/* Active Login Sessions */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Monitor className="w-5 h-5 text-purple-400" /> Active Login Sessions & Devices
        </h3>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-extrabold text-sm text-white">
                    {sess.device} {sess.isCurrent && <span className="text-[10px] text-emerald-400 font-bold ml-2">(Current Session)</span>}
                  </p>
                  <p className="text-xs text-slate-400">{sess.location} • IP: {sess.ip}</p>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleSignOutDevice(sess.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40 font-bold text-xs hover:bg-rose-600/40"
                >
                  <LogOut className="w-3.5 h-3.5 inline mr-1" /> Sign Out Device
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
