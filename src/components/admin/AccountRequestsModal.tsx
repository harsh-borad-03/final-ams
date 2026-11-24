import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCheck, XCircle, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AccountRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountRequestsModal: React.FC<AccountRequestsModalProps> = ({ isOpen, onClose }) => {
  const { accountRequests, approveUserAccount, rejectUserAccount } = useAuth();

  if (!isOpen) return null;

  const pendingRequests = accountRequests.filter((r) => r.status === 'PENDING');
  const processedRequests = accountRequests.filter((r) => r.status !== 'PENDING');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  Super Admin Account Access Requests
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {pendingRequests.length} Pending
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Review & approve new user registration requests</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pending Access Requests List */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              Pending Approval ({pendingRequests.length})
            </h4>

            {pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-extrabold text-sm text-white">{req.fullName}</p>
                        <p className="text-xs text-slate-400">{req.email} • {req.department}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                        Requested: {(req.desiredRole || req.role || '').replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 italic">
                      "{req.reason}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-500">{req.timestamp}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveUserAccount(req.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Approve Account
                        </button>
                        <button
                          onClick={() => rejectUserAccount(req.id, 'Request rejected by super admin')}
                          className="px-4 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-slate-300">All Account Requests Processed</p>
                <p className="text-[11px]">No pending access approval requests at this time.</p>
              </div>
            )}

            {/* Processed History */}
            {processedRequests.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                  Recently Processed Requests ({processedRequests.length})
                </h4>

                <div className="space-y-2">
                  {processedRequests.map((req) => (
                    <div key={req.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{req.fullName}</span> ({req.email})
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
