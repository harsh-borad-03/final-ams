import React from 'react';
import { ChevronLeft, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onLogout: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout 
}) => {
  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'sql-database':
        return 'Visitors / MySQL Database (500k)';
      case 'all-visitors':
        return 'Visitors / All Visitors';
      case 'visitor-gatepass':
        return 'Visitors / Add';
      case 'company-master':
        return 'Master Settings / Company';
      case 'branch-master':
        return 'Master Settings / Branch';
      case 'department-master':
        return 'Master Settings / Department';
      case 'access-groups':
        return 'Master Settings / Access Groups';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="hover:text-purple-600 flex items-center gap-1 transition-colors font-medium"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{getBreadcrumb()}</span>
        </button>
      </div>

      {/* Right Controls: Read-only Logged-in User Badge & Logout */}
      <div className="flex items-center gap-3">
        {/* Read-Only Role & User Info */}
        <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
            {currentUser.avatar}
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
            <span className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider block">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Top Navbar Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
