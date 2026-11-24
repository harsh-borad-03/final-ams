import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Sliders, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  Building,
  Building2,
  Database,
  Lock
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  onLogout
}) => {
  const [visitorsOpen, setVisitorsOpen] = useState<boolean>(true);
  const [masterSettingsOpen, setMasterSettingsOpen] = useState<boolean>(true);

  const isSuperAdmin = currentUser.role === 'Super Admin';
  const isSecurity = currentUser.role === 'Security';

  return (
    <aside className="w-64 bg-[#14152a] text-slate-300 flex flex-col h-full border-r border-slate-800 shrink-0 font-mono text-xs select-none">
      {/* Brand Header: Visitor Management */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-600/30">
            VM
          </div>
          <div>
            <span className="font-extrabold tracking-wide text-slate-100 text-sm font-heading block">
              Visitor <span className="text-purple-400 font-bold">Management</span>
            </span>
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">ADMIN PORTAL</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {/* Main Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Navigation</p>
          
          {/* Dashboard */}
          {(isSuperAdmin || isSecurity) && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          )}

          {/* MySQL Database Search (Visible for ALL Users) */}
          <button
            onClick={() => setActiveTab('sql-database')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'sql-database'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Visitor Database</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              {isSecurity ? 'SEARCH' : '500k'}
            </span>
          </button>

        </div>

        {/* Visitor Management Section */}
        <nav className="space-y-3">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Management</p>
          
          {/* Visitors Accordion */}
          <div>
            <button
              onClick={() => setVisitorsOpen(!visitorsOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium transition-all"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Visitors</span>
              </div>
              {visitorsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            {visitorsOpen && (
              <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-3">
                <button
                  onClick={() => setActiveTab('all-visitors')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-all ${
                    activeTab === 'all-visitors'
                      ? 'text-purple-400 font-bold bg-purple-950/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Visitors
                </button>
                <button
                  onClick={() => setActiveTab('visitor-gatepass')}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-all ${
                    activeTab === 'visitor-gatepass'
                      ? 'text-purple-400 font-bold bg-purple-950/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Visitor Gatepass
                </button>
              </div>
            )}
          </div>

          {/* Master Settings Accordion (ONLY VISIBLE FOR SUPER ADMIN!) */}
          {isSuperAdmin ? (
            <div>
              <button
                onClick={() => setMasterSettingsOpen(!masterSettingsOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-medium transition-all"
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4" />
                  <span>Master Settings</span>
                </div>
                {masterSettingsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {masterSettingsOpen && (
                <div className="ml-7 mt-1 space-y-1 border-l border-slate-800 pl-3">
                  <button
                    onClick={() => setActiveTab('company-master')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-all ${
                      activeTab === 'company-master' ? 'text-purple-400 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Company
                  </button>
                  <button
                    onClick={() => setActiveTab('branch-master')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-all ${
                      activeTab === 'branch-master' ? 'text-purple-400 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Branch
                  </button>
                  <button
                    onClick={() => setActiveTab('department-master')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] transition-all ${
                      activeTab === 'department-master' ? 'text-purple-400 font-bold bg-purple-950/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Department
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="px-3 py-2 text-[10px] font-mono text-slate-500 italic border-t border-slate-800/60 mt-2">
              🔒 Master Settings restricted to Super Admin
            </div>
          )}
        </nav>
      </div>

      {/* User Profile & Logout Box */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0f1020] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold font-mono flex items-center justify-center text-xs shadow shrink-0">
              {currentUser.avatar}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-100 font-mono truncate">{currentUser.name}</p>
              <span className={`inline-block text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                currentUser.role === 'Super Admin'
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : currentUser.role === 'Security'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-blue-950 text-blue-300 border border-blue-800'
              }`}>
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 text-rose-300 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
