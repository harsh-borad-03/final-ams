import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Lock, Radio, Users, X, CheckCircle2, PhoneCall, Download } from 'lucide-react';
import { Visitor } from '../../types';

interface EmergencyLockdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: Visitor[];
}

export const EmergencyLockdownModal: React.FC<EmergencyLockdownModalProps> = ({ isOpen, onClose, visitors }) => {
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const insideVisitors = visitors.filter((v) => v.status === 'CHECKED_IN');

  const handleTriggerLockdown = () => {
    setIsLockdownActive(true);
    setBroadcastSent(true);
  };

  const handleCancelLockdown = () => {
    setIsLockdownActive(false);
    setBroadcastSent(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/30 bg-rose-950/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  Emergency Security Lockdown & Panic Protocol
                </h3>
                <p className="text-xs text-rose-300">One-click facility perimeter lockdown & turnstile override</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="p-6 space-y-5">
            {!isLockdownActive ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2">
                  <p className="font-extrabold text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" /> WARNING: HIGH SECURITY OVERRIDE
                  </p>
                  <p>
                    Activating lockdown will immediately seal all automated gate turnstiles, sound security alarm sirens, and
                    send emergency SMS notifications to {insideVisitors.length} occupants currently inside the building.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Occupants Inside</span>
                    <span className="font-black text-rose-400 text-lg block">{insideVisitors.length} Visitors</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Gates Standing By</span>
                    <span className="font-black text-emerald-400 text-lg block">4 Security Gates</span>
                  </div>
                </div>

                <button
                  onClick={handleTriggerLockdown}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 hover:brightness-110 animate-pulse"
                >
                  <Lock className="w-5 h-5" /> TRIGGER IMMEDIATE FACILITY LOCKDOWN
                </button>
              </div>
            ) : (
              /* Lockdown Active Status Screen */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
                <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border-2 border-rose-500/60 animate-ping">
                  <ShieldAlert className="w-12 h-12" />
                </div>

                <div>
                  <h4 className="text-2xl font-black text-rose-400 uppercase tracking-widest">FACILITY LOCKDOWN ACTIVE</h4>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">
                    Turnstile gates locked • Emergency Services & SWAT Notified • SMS Broadcast Dispatched
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-rose-400" /> Export Headcount Roster
                  </button>

                  <button
                    onClick={handleCancelLockdown}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Reset Security Clearance
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
