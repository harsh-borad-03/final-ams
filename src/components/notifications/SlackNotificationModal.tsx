import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, MessageSquare, Bell, Sparkles } from 'lucide-react';
import { Visitor } from '../../types';

interface SlackNotificationModalProps {
  visitor: Visitor | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (visitorId: string) => void;
  onReject: (visitorId: string) => void;
}

export const SlackNotificationModal: React.FC<SlackNotificationModalProps> = ({
  visitor,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !visitor) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          className="p-5 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl space-y-4 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* Slack/Teams Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
                #
              </div>
              <div>
                <p className="text-xs font-extrabold text-white flex items-center gap-1">
                  Slack Bot Notification <Sparkles className="w-3 h-3 text-cyan-400" />
                </p>
                <p className="text-[10px] text-slate-400">#aura-visitor-alerts</p>
              </div>
            </div>

            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message Body */}
          <div className="space-y-2 text-xs">
            <p className="font-bold text-indigo-300">👋 Host Alert: Your visitor has arrived at Reception!</p>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <p>Visitor: <strong className="text-white">{visitor.fullName}</strong></p>
              <p>Company: <span className="text-slate-300">{visitor.company}</span></p>
              <p>Purpose: <span className="italic text-slate-400">{visitor.purpose}</span></p>
              <p>Gate: <span className="font-mono text-cyan-400">Tower A Lobby Kiosk #1</span></p>
            </div>
          </div>

          {/* One-Click Approval Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onApprove(visitor.id);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Entry
            </button>
            <button
              onClick={() => {
                onReject(visitor.id);
                onClose();
              }}
              className="py-2 px-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Reject Entry
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
