import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, ShieldAlert, Clock, UserCheck, Check, Sparkles } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              Notification Center
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded-full">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Real-time arrival alerts, host approvals & security flags</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-indigo-300 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Mark All Read
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.map((notif, idx) => {
          const getCategoryIcon = (category: string) => {
            switch (category) {
              case 'arrival':
                return UserCheck;
              case 'approval':
                return Clock;
              case 'alert':
                return ShieldAlert;
              default:
                return CheckCircle2;
            }
          };
          const Icon = getCategoryIcon(notif.category || '');

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`p-4 rounded-3xl border transition-all flex items-start gap-4 ${
                notif.read
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-900/90 border-indigo-500/30 shadow-lg shadow-indigo-500/10'
              }`}
            >
              <div
                className={`p-3 rounded-2xl ${
                  notif.category === 'alert'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white">{notif.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
              </div>

              {!notif.read && (
                <button
                  onClick={() => onMarkRead(notif.id)}
                  className="p-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-xs font-bold"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
