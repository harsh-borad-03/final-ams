import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X, ShieldCheck, UserCheck, AlertTriangle, HelpCircle } from 'lucide-react';
import { User, UserRole, AccountRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface UserApprovalModalProps {
  request: AccountRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserApprovalModal: React.FC<UserApprovalModalProps> = ({ request, isOpen, onClose }) => {
  const { approveUserAccount, rejectUserAccount } = useAuth();
  const [assignedRole, setAssignedRole] = useState<UserRole>('employee');
  const [step, setStep] = useState<'details' | 'confirm_approve' | 'reject_reason'>('details');
  const [rejectReason, setRejectReason] = useState('Incorrect information');
  const [customReason, setCustomReason] = useState('');

  if (!isOpen || !request) return null;

  const currentAssignedRole = assignedRole || request.desiredRole;

  const handleApprove = async () => {
    await approveUserAccount(request.id, currentAssignedRole);
    onClose();
    setStep('details');
  };

  const handleReject = async () => {
    const finalReason = rejectReason === 'Other' ? customReason : rejectReason;
    await rejectUserAccount(request.id, finalReason);
    onClose();
    setStep('details');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-5 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">USER REGISTRATION REQUEST</h3>
                <p className="text-xs text-slate-400">Super Admin Security Clearance Review</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Step */}
          {step === 'details' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <img
                  src={request.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300'}
                  alt={request.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40"
                />
                <div>
                  <h4 className="text-lg font-extrabold text-white">{request.fullName}</h4>
                  <p className="text-xs text-indigo-300 font-semibold">{request.email}</p>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block mt-1">
                    Status: PENDING APPROVAL
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Employee ID</span>
                  <span className="font-mono font-bold text-cyan-400">{request.employeeId || 'EMP-1042'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Department</span>
                  <span className="font-bold text-slate-200">{request.department}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Designation</span>
                  <span className="font-bold text-slate-200">{request.designation || 'Staff Member'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Registration Date</span>
                  <span className="font-bold text-slate-200">{request.timestamp}</span>
                </div>
              </div>

              {/* Role Assignment Selector */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Requested Role: <strong className="text-white capitalize">{request.desiredRole}</strong></span>
                  <span className="text-indigo-400 font-bold">Assign System Role:</span>
                </div>

                <select
                  value={currentAssignedRole}
                  onChange={(e) => setAssignedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="super_admin">SUPER ADMIN (Full System Access)</option>
                  <option value="admin">ADMIN (Administrative Access)</option>
                  <option value="receptionist">RECEPTIONIST (Front Desk Visitor Control)</option>
                  <option value="security">SECURITY (Turnstile & Gate Control)</option>
                  <option value="employee">EMPLOYEE (Visitor Invites & Approvals)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('reject_reason')}
                  className="flex-1 py-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject Request
                </button>
                <button
                  type="button"
                  onClick={() => setStep('confirm_approve')}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve User Account
                </button>
              </div>
            </div>
          )}

          {/* Confirm Approval Step */}
          {step === 'confirm_approve' && (
            <div className="p-6 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">Approve User Account?</h4>
                <p className="text-xs text-slate-300 mt-2">
                  You are about to activate <strong className="text-white">{request.fullName}</strong>.
                </p>
                <div className="my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-indigo-300">
                  Assigned Role: <span className="uppercase font-black text-white">{currentAssignedRole}</span> • Department: {request.department}
                </div>
                <p className="text-[11px] text-slate-400">
                  Once approved, this user will be allowed to log in and access authorized features.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-3 rounded-2xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-xl"
                >
                  ✓ Confirm & Activate Account
                </button>
              </div>
            </div>
          )}

          {/* Reject Reason Step */}
          {step === 'reject_reason' && (
            <div className="p-6 space-y-4">
              <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Reject Registration Request
              </h4>
              <p className="text-xs text-slate-400">Select reason for rejecting account registration for {request.fullName}:</p>

              <div className="space-y-2">
                {[
                  'Incorrect information',
                  'User not recognized',
                  'Invalid employee ID',
                  'Wrong department',
                  'Security concern',
                  'Other',
                ].map((reasonOption) => (
                  <label
                    key={reasonOption}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                      rejectReason === reasonOption
                        ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectionReason"
                      value={reasonOption}
                      checked={rejectReason === reasonOption}
                      onChange={() => setRejectReason(reasonOption)}
                      className="accent-rose-500"
                    />
                    {reasonOption}
                  </label>
                ))}
              </div>

              {rejectReason === 'Other' && (
                <div>
                  <textarea
                    rows={2}
                    placeholder="Enter custom rejection reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-3 rounded-2xl bg-slate-800 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="w-2/3 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl"
                >
                  ✕ Reject Request
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
