import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Dashboard } from './pages/Dashboard';
import { VisitorGatepassWizard } from './pages/VisitorGatepassWizard';
import { VisitorList } from './pages/VisitorList';
import { VisitorDatabaseSQL } from './pages/VisitorDatabaseSQL';
import { MasterSettings } from './pages/MasterSettings';
import { Login } from './pages/Login';
import { Visitor, DashboardStats, UserProfile, VisitorStatus, MasterItem } from './types';
import { 
  INITIAL_VISITORS, 
  INITIAL_STATS,
  DEMO_USERS,
  INITIAL_COMPANIES,
  INITIAL_BRANCHES,
  INITIAL_DEPARTMENTS
} from './data/mockData';
import { X, QrCode, Printer } from 'lucide-react';
import { AMSVisitorGatePass } from './components/pass/AMSVisitorGatePass';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const VALID_TABS = [
  'dashboard',
  'sql-database',
  'visitor-gatepass',
  'all-visitors',
  'company-master',
  'branch-master',
  'department-master'
];

export function App() {
  // Auth & Role State - Always start at Login screen
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);

  // Active Tab View - Persisted to LocalStorage with validation
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('ams_active_tab');
    if (saved && VALID_TABS.includes(saved)) {
      return saved;
    }
    return 'dashboard';
  });

  // Master Data - Production Clean Initialization: Purges any old dummy cached records
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    if (!localStorage.getItem('ams_prod_clean_2026_v1')) {
      localStorage.removeItem('ams_saved_visitors');
      localStorage.removeItem('ams_gatepass_seq');
      localStorage.setItem('ams_prod_clean_2026_v1', 'true');
      return [];
    }
    const saved = localStorage.getItem('ams_saved_visitors');
    if (saved !== null) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  });

  const [companies, setCompanies] = useState<MasterItem[]>(() => {
    const saved = localStorage.getItem('ams_saved_companies');
    if (saved !== null) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_COMPANIES;
  });

  const [branches, setBranches] = useState<MasterItem[]>(() => {
    const saved = localStorage.getItem('ams_saved_branches');
    if (saved !== null) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return INITIAL_BRANCHES;
  });

  const [departments, setDepartments] = useState<MasterItem[]>(() => {
    const saved = localStorage.getItem('ams_saved_departments');
    if (saved !== null) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) return parsed;
      } catch {}
    }
    return INITIAL_DEPARTMENTS;
  });

  // Selected Pass Modal
  const [selectedPassVisitor, setSelectedPassVisitor] = useState<Visitor | null>(null);

  // Sync visitors to LocalStorage whenever visitors state changes
  useEffect(() => {
    try {
      localStorage.setItem('ams_saved_visitors', JSON.stringify(visitors));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [visitors]);

  // Remove any legacy stored auth state so user starts at Login screen
  useEffect(() => {
    localStorage.removeItem('ams_is_auth');
    if (!isAuthenticated && window.location.pathname !== '/login') {
      window.history.replaceState(null, '', '/login');
    }
  }, []);

  // Synchronize browser URL bar with auth state and navigation
  useEffect(() => {
    if (!isAuthenticated) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState(null, '', '/login');
      }
    } else {
      const targetPath = `/${activeTab}`;
      if (window.location.pathname !== targetPath) {
        window.history.replaceState(null, '', targetPath);
      }
    }
  }, [isAuthenticated, activeTab]);

  // Sync active tab
  useEffect(() => {
    localStorage.setItem('ams_active_tab', activeTab);
  }, [activeTab]);

  // Guard: if non-Super Admin is on a master tab or unknown tab, redirect to dashboard
  useEffect(() => {
    const isMasterTab = ['company-master', 'branch-master', 'department-master', 'access-groups'].includes(activeTab);
    if (!VALID_TABS.includes(activeTab) || (isMasterTab && currentUser.role !== 'Super Admin')) {
      setActiveTab('dashboard');
    }
  }, [activeTab, currentUser.role]);

  // Sync masters
  useEffect(() => {
    localStorage.setItem('ams_saved_companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('ams_saved_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('ams_saved_departments', JSON.stringify(departments));
  }, [departments]);

  // On App Mount: Fetch latest saved records from backend API and merge seamlessly
  useEffect(() => {
    const syncBackendVisitors = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/custom-visitors`);
        if (res.ok) {
          const data = await res.json();
          if (data.visitors && Array.isArray(data.visitors)) {
            setVisitors((prev) => {
              const existingIds = new Set(prev.map((v) => v.id));
              const newItems = data.visitors.filter((v: Visitor) => !existingIds.has(v.id));
              if (newItems.length > 0) {
                return [...newItems, ...prev];
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.log('Backend sync offline mode:', err);
      }
    };
    syncBackendVisitors();
  }, []);

  // Recalculate stats dynamically
  const stats: DashboardStats = {
    totalVisitors: visitors.length,
    inPremise: visitors.filter((v) => v.status === 'In Premise').length,
    pending: visitors.filter((v) => v.status === 'Pending').length,
    rejected: visitors.filter((v) => v.status === 'Rejected').length,
    upcoming: visitors.filter((v) => v.status === 'Approved').length,
    visited: visitors.filter((v) => v.status === 'Visited').length
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ams_is_auth');
    localStorage.removeItem('ams_current_user');
  };

  const handleUpdateVisitorStatus = (
    id: string, 
    newStatus: VisitorStatus, 
    actionTakenBy?: string, 
    rejectionReason?: string
  ) => {
    const defaultName = currentUser.role === 'Super Admin' ? 'Super Admin' : currentUser.name;
    const updaterName = actionTakenBy || defaultName;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const isCheckingOut = newStatus === 'Visited' || newStatus === 'CHECKED_OUT';
    const currentOutTime = isCheckingOut ? timestamp : undefined;

    setVisitors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: newStatus,
              finalStatus: newStatus,
              employeeStatus: newStatus,
              actionTakenBy: updaterName,
              actionTakenAt: timestamp,
              rejectionReason: rejectionReason || v.rejectionReason,
              outTime: isCheckingOut ? currentOutTime! : v.outTime
            }
          : v
      )
    );

    // Sync to Express MySQL Backend API
    fetch(`${API_BASE_URL}/api/visitors/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        actionTakenBy: updaterName,
        rejectionReason,
        outTime: currentOutTime
      })
    }).catch((err) => console.log('Saved to memory:', err));
  };

  // Fresh deployment cleanup: clear old test visitors once
  useEffect(() => {
    if (!localStorage.getItem('ams_prod_clean_2026_v1')) {
      localStorage.removeItem('ams_saved_visitors');
      localStorage.removeItem('ams_gatepass_seq');
      localStorage.setItem('ams_prod_clean_2026_v1', 'true');
      setVisitors([]);
    }
  }, []);

  const handleAddVisitor = (newVisData: Partial<Visitor>) => {
    const nextSeq = (parseInt(localStorage.getItem('ams_gatepass_seq') || '0', 10) + 1);
    localStorage.setItem('ams_gatepass_seq', nextSeq.toString());
    const seqStr = nextSeq.toString().padStart(5, '0');

    const created: Visitor = {
      id: newVisData.id || `VIS-${seqStr}`,
      passCode: newVisData.passCode || `VP-2026-${seqStr}`,
      fullName: newVisData.fullName || 'Visitor Name',
      phone: newVisData.phone || '',
      email: newVisData.email || '',
      purpose: newVisData.purpose || 'Guest',
      address: newVisData.address || '',
      idProofType: newVisData.idProofType || 'Aadhaar Card',
      idNumber: newVisData.idNumber || '',
      company: newVisData.company || 'Main Company',
      hostName: newVisData.hostName || 'Employee Name',
      hostId: newVisData.hostId || 'EMP-101',
      department: newVisData.department || 'IT',
      inTime: newVisData.inTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      outTime: newVisData.outTime || '--',
      validFrom: newVisData.validFrom || new Date().toISOString().slice(0, 10),
      validTill: newVisData.validTill || new Date().toISOString().slice(0, 10),
      duration: newVisData.duration || '7 hrs',
      status: newVisData.status || 'In Premise',
      employeeStatus: newVisData.employeeStatus || 'Approved',
      finalStatus: newVisData.finalStatus || 'Approved',
      assets: newVisData.assets,
      photoUrl: newVisData.photoUrl
    };

    setVisitors((prev) => [created, ...prev]);

    // Send to backend API to write to Database_MySQL_SQL
    fetch(`${API_BASE_URL}/api/visitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created)
    }).catch((err) => console.log('Saved to memory:', err));
  };

  const handleDeleteVisitor = (id: string) => {
    setVisitors((prev) => prev.filter((v) => v.id !== id));

    // Delete from backend API and disk storage (Database_MySQL_SQL)
    fetch(`${API_BASE_URL}/api/visitors/${id}`, {
      method: 'DELETE'
    }).catch((err) => console.warn('Could not sync delete to backend:', err));
  };

  const handleClearAllVisitors = () => {
    setVisitors([]);
    localStorage.removeItem('ams_saved_visitors');
    localStorage.removeItem('ams_gatepass_seq');
    fetch(`${API_BASE_URL}/api/visitors/purge-all`, {
      method: 'POST'
    }).catch((err) => console.warn('Could not sync purge to backend:', err));
  };

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#f4f6fb] overflow-hidden font-sans text-slate-800 selection:bg-purple-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Tab Pages */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <ErrorBoundary onReset={() => setActiveTab('dashboard')}>
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                visitors={visitors}
                onNavigate={setActiveTab}
                onOpenPass={(vis) => setSelectedPassVisitor(vis)}
              />
            )}

            {activeTab === 'sql-database' && (
              <VisitorDatabaseSQL
                currentUser={currentUser}
                onOpenPass={(vis) => setSelectedPassVisitor(vis)}
                onNavigate={setActiveTab}
                onUpdateStatus={handleUpdateVisitorStatus}
                onDeleteVisitor={handleDeleteVisitor}
              />
            )}

            {activeTab === 'visitor-gatepass' && (
              <VisitorGatepassWizard
                onAddVisitor={handleAddVisitor}
                onNavigate={setActiveTab}
              />
            )}

            {activeTab === 'all-visitors' && (
              <VisitorList
                visitors={visitors}
                setVisitors={setVisitors}
                onNavigate={setActiveTab}
                onOpenPass={(vis) => setSelectedPassVisitor(vis)}
                onUpdateStatus={handleUpdateVisitorStatus}
                onDeleteVisitor={handleDeleteVisitor}
                onClearAllVisitors={handleClearAllVisitors}
              />
            )}

            {/* MASTER SETTINGS (Only accessible if Super Admin) */}
            {currentUser.role === 'Super Admin' && (
              <>
                {activeTab === 'company-master' && (
                  <MasterSettings type="company" items={companies} setItems={setCompanies} />
                )}
                {activeTab === 'branch-master' && (
                  <MasterSettings type="branch" items={branches} setItems={setBranches} />
                )}
                {activeTab === 'department-master' && (
                  <MasterSettings type="department" items={departments} setItems={setDepartments} />
                )}
              </>
            )}

            {/* Fallback View: Guarantees website view never renders an empty white screen */}
            {(!VALID_TABS.includes(activeTab) || (currentUser.role !== 'Super Admin' && ['company-master', 'branch-master', 'department-master'].includes(activeTab))) && (
              <Dashboard
                stats={stats}
                visitors={visitors}
                onNavigate={setActiveTab}
                onOpenPass={(vis) => setSelectedPassVisitor(vis)}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Pass Badge Print Modal */}
      {selectedPassVisitor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 w-full max-w-3xl max-h-[94vh] rounded-3xl shadow-2xl p-6 flex flex-col font-sans my-auto">
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-800 font-mono tracking-tight uppercase">
                  AMS Visitor Gate Pass — Print Preview
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPassVisitor(null)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Gate Pass Body Area */}
            <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4 print-container">
              <AMSVisitorGatePass visitor={selectedPassVisitor} />
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-200 shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedPassVisitor(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold font-mono text-xs transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setSelectedPassVisitor(null);
                }}
                className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
              >
                <Printer className="w-4 h-4" />
                Print Visitor Gatepass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
