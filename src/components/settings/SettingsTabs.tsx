import React, { useState } from 'react';
import { Building, Shield, Bell, Lock, User, Key } from 'lucide-react';
import { SecuritySessionsTab } from './SecuritySessionsTab';
import { PermissionMatrixUI } from '../admin/PermissionMatrix';

export const SettingsTabs: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'security' | 'permissions'>('general');

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'general'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          General Facility Settings
        </button>
        <button
          onClick={() => setActiveSubTab('permissions')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'permissions'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          RBAC Permission Matrix
        </button>
        <button
          onClick={() => setActiveSubTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activeSubTab === 'security'
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Security & Active Sessions
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'general' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" /> Enterprise Headquarters Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                defaultValue="Aura Solutions HQ"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Timezone</label>
              <input
                type="text"
                defaultValue="Pacific Standard Time (PST)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'permissions' && <PermissionMatrixUI />}

      {activeSubTab === 'security' && <SecuritySessionsTab />}
    </div>
  );
};
