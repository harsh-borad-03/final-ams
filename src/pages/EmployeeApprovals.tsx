import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Mail, 
  UserCheck, 
  Clock, 
  Building2, 
  AlertCircle, 
  Send, 
  ShieldCheck,
  Sparkles,
  User,
  Phone,
  FileText,
  HardDrive
} from 'lucide-react';
import { Visitor, VisitorStatus, UserProfile } from '../types';

interface EmployeeApprovalsProps {
  currentUser: UserProfile;
  visitors: Visitor[];
  onUpdateStatus: (id: string, newStatus: VisitorStatus) => void;
}

interface EmailLog {
  id: string;
  recipient: string;
  visitorName: string;
  type: 'Approved' | 'Rejected';
  timestamp: string;
}

export const EmployeeApprovals: React.FC<EmployeeApprovalsProps> = ({
  currentUser,
  visitors,
  onUpdateStatus
}) => {
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([
    {
      id: 'LOG-01',
      recipient: 'visitor1@example.com',
      visitorName: 'Guest Visitor 1',
      type: 'Approved',
      timestamp: '10:05 AM Today'
    }
  ]);

  const [rejectReasonModalVisitor, setRejectReasonModalVisitor] = useState<Visitor | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState<string>('Host Employee unavailable at requested time.');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Host-targeted Notification & Approval Filtering:
  // If a visitor wants to meet Dhaval Sir, send/show notification ONLY to Dhaval Sir, Super Admin, and Admin User.
  // Do NOT show to Aashis or other unrelated employees.
  const isSuperAdminOrAdmin = 
    currentUser.role === 'Super Admin' || 
    currentUser.name === 'SA' || 
    currentUser.name === 'Admin User' ||
    currentUser.role === 'Security';

  const pendingRequests = visitors.filter((v) => {
    const isPending = v.status === 'Pending' || v.employeeStatus === 'Pending';
    if (!isPending) return false;

    if (isSuperAdminOrAdmin) {
      return true;
    }

    const vHost = (v.hostName || '').toLowerCase().trim();
    const uName = (currentUser.name || '').toLowerCase().trim();

    return vHost === uName || vHost.includes(uName) || uName.includes(vHost);
  });

  const handleApprove = (vis: Visitor) => {
    onUpdateStatus(vis.id, 'In Premise');

    // Trigger automated email simulation
    const newLog: EmailLog = {
      id: `LOG-${Date.now()}`,
      recipient: vis.email || `${vis.fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      visitorName: vis.fullName,
      type: 'Approved',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEmailLogs((prev) => [newLog, ...prev]);

    setToastMessage(`✅ Request Approved! Automated email approval sent to ${newLog.recipient}`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleConfirmReject = () => {
    if (!rejectReasonModalVisitor) return;

    onUpdateStatus(rejectReasonModalVisitor.id, 'Rejected');

    const newLog: EmailLog = {
      id: `LOG-${Date.now()}`,
      recipient: rejectReasonModalVisitor.email || `${rejectReasonModalVisitor.fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      visitorName: rejectReasonModalVisitor.fullName,
      type: 'Rejected',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEmailLogs((prev) => [newLog, ...prev]);

    setToastMessage(`❌ Request Rejected. Rejection email sent to ${newLog.recipient}`);
    setRejectReasonModalVisitor(null);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-7xl mx-auto space-y-6 font-sans"
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-purple-500 flex items-center gap-3 font-mono text-xs animate-bounce">
          <Mail className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">Host Employee Approvals</h1>
            <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-mono font-bold border border-purple-200 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Email Workflow Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Logged in as <span className="font-bold text-slate-800">{currentUser.name}</span> ({currentUser.role}). Review visitor entry requests and send automated email approvals/denials.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-4 py-2 bg-purple-50 text-purple-700 font-bold rounded-2xl border border-purple-200">
            Pending Requests: <strong className="text-purple-900">{pendingRequests.length}</strong>
          </div>
        </div>
      </div>

      {/* Grid: Pending Requests (Left 2 cols) & Live Email Log Stream (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pending Requests Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-purple-600" />
            Pending Visitor Requests Needing Approval ({pendingRequests.length})
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-3 font-sans">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">All Visitor Requests Approved!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No pending visitor requests waiting for employee authorization at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((vis) => (
                <div 
                  key={vis.id} 
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm font-mono shadow-inner">
                        {vis.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 capitalize font-heading">{vis.fullName}</h3>
                        <p className="text-[11px] font-mono text-purple-600 font-bold">{vis.passCode} • {vis.phone}</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending Approval
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[9px]">EMAIL:</span>
                      <strong className="text-slate-800 truncate block">{vis.email || 'visitor@example.com'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">PURPOSE:</span>
                      <strong className="text-slate-800">{vis.purpose}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">TO MEET (HOST):</span>
                      <strong className="text-slate-800">{vis.hostName} ({vis.department})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">BELONGINGS LOGGED:</span>
                      <strong className="text-purple-600">{vis.assets || 'None'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">DATE:</span>
                      <strong className="text-slate-800">{vis.validFrom}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px]">SCHEDULED TIME:</span>
                      <strong className="text-slate-800">{vis.inTime}</strong>
                    </div>
                  </div>

                  {/* Approval / Denial Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Mail className="w-3.5 h-3.5 text-purple-500" />
                      <span>Action triggers automated email notice</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      {/* DENY BUTTON */}
                      <button
                        onClick={() => setRejectReasonModalVisitor(vis)}
                        className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Deny / Reject
                      </button>

                      {/* APPROVE BUTTON */}
                      <button
                        onClick={() => handleApprove(vis)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve & Send Email
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Live Email Dispatch Log Stream */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
            <Send className="w-4 h-4 text-purple-600" />
            Live Email Dispatch Log
          </h2>

          <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                SMTP Mail Gateway
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {emailLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${
                      log.type === 'Approved' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      [{log.type.toUpperCase()} NOTICE]
                    </span>
                    <span className="text-slate-500 text-[9px]">{log.timestamp}</span>
                  </div>

                  <p className="text-slate-300 text-[11px] truncate">
                    To: <strong className="text-slate-100">{log.recipient}</strong>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Subject: Gatepass {log.type} for {log.visitorName}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
              Automated visitor email notification engine
            </div>
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectReasonModalVisitor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 font-sans">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-800 font-mono">Reject Visitor Request</h3>
              <button onClick={() => setRejectReasonModalVisitor(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Specify rejection reason for <strong className="text-slate-900">{rejectReasonModalVisitor.fullName}</strong>. An email notification will be sent automatically.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 font-mono">Rejection Reason *</label>
                <textarea
                  rows={3}
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-rose-600 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 font-mono">
              <button
                onClick={() => setRejectReasonModalVisitor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                Confirm Rejection & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
