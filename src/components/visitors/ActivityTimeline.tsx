import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, UserCheck, ShieldAlert, FileText, QrCode } from 'lucide-react';
import { mockActivityLogs } from '../../data/mockData';

interface ActivityTimelineProps {
  visitorId: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ visitorId }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {mockActivityLogs.map((log: any, idx: number) => {
        const getIcon = (type: string) => {
          switch (type) {
            case 'Checked In':
              return CheckCircle2;
            case 'Pass Issued':
              return QrCode;
            case 'Approved':
              return UserCheck;
            case 'Arrived':
              return Clock;
            case 'Rejected':
              return ShieldAlert;
            default:
              return FileText;
          }
        };

        const Icon = getIcon(log.eventType);

        return (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="relative flex items-start gap-4 group"
          >
            {/* Timeline Node Icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 shadow-md">
              <Icon className="w-3 h-3" />
            </div>

            {/* Event Card */}
            <div className="flex-1 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">{log.eventType}</span>
                <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mb-2">{log.description}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/50">
                <span>By: <strong className="text-indigo-300">{log.performedBy}</strong></span>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                  {visitorId}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
