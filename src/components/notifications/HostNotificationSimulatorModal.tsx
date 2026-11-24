import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Clock, XCircle, MessageSquare, ShieldCheck, X, Sparkles, Send } from 'lucide-react';
import { Visitor } from '../../types';

interface HostNotificationSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitor: Visitor | null;
  onApprove: (id: string) => void;
}

export const HostNotificationSimulatorModal: React.FC<HostNotificationSimulatorModalProps> = ({
  isOpen,
  onClose,
  visitor,
  onApprove,
}) => {
  const [platform, setPlatform] = useState<'Slack' | 'MS Teams' | 'SMS' | 'Email'>('Slack');
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  if (!isOpen || !visitor) return null;

  const handleAction = (action: string) => {
    setActionStatus(action);
    if (action === 'APPROVED') {
      onApprove(visitor.id);
    }
    setTimeout(() => {
      setActionStatus(null);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Host Live Arrival Notification</h3>
                <p className="text-xs text-slate-400">Simulate instant host notification push & approval desk</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Tab selector */}
          <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400">Channel Channel:</span>
            <div className="flex items-center gap-1.5">
              {(['Slack', 'MS Teams', 'SMS', 'Email'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    platform === p
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Body Notification Card */}
          <div className="p-6 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-xs text-purple-300">AuraVMS Bot • {platform} Integration</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Just Now</span>
              </div>

              <div className="flex items-start gap-4 pt-2">
                <img
                  src={visitor.photoUrl}
                  alt={visitor.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/30"
                />

                <div>
                  <h4 className="font-black text-white text-base">{visitor.fullName} Has Arrived!</h4>
                  <p className="text-xs text-slate-300 font-semibold">{visitor.company}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Waiting at: <strong className="text-white">{visitor.locationName || 'Main Lobby'}</strong> • Host:{' '}
                    <strong className="text-purple-300">{visitor.hostName}</strong>
                  </p>
                </div>
              </div>

              {actionStatus && (
                <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-center font-bold text-xs text-purple-200 animate-pulse">
                  ✓ Response sent to gate security: {actionStatus}
                </div>
              )}

              {/* Action Buttons */}
              {!actionStatus && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => handleAction('APPROVED')}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Entry
                  </button>

                  <button
                    onClick={() => handleAction('DELAYED 5 MIN')}
                    className="py-2.5 px-3 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" /> Wait 5 Mins
                  </button>

                  <button
                    onClick={() => handleAction('DECLINED')}
                    className="py-2.5 px-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
