import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Clock,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  FileText,
  History,
  CheckCircle2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Visitor } from '../../types';
import { getStatusBadgeStyle } from '../../utils/formatters';
import { ActivityTimeline } from './ActivityTimeline';

interface ProfileDrawerProps {
  visitor: Visitor | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Visitor['status']) => void;
  onOpenPass: (visitor: Visitor) => void;
}

export const VisitorProfileDrawer: React.FC<ProfileDrawerProps> = ({
  visitor,
  onClose,
  onUpdateStatus,
  onOpenPass,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'documents' | 'timeline'>('overview');

  if (!visitor) return null;

  const badgeStyle = getStatusBadgeStyle(visitor.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={visitor.photoUrl}
                  alt={visitor.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-xl"
                />
                {visitor.isVip && (
                  <span className="absolute -top-1 -right-1 p-1 bg-amber-500 rounded-full text-slate-950 shadow-md" title="VIP Guest">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-extrabold text-white">{visitor.fullName}</h3>
                  <span className="text-[10px] font-mono text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/30">
                    {visitor.visitorId}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{visitor.company}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeStyle.badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dotClass}`} />
                    {badgeStyle.label}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold uppercase">
                    {visitor.category}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-4">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'timeline', label: 'Activity Log', icon: History },
              { id: 'documents', label: 'Documents & ID', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status & Quick Actions Card */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {visitor.status === 'CHECKED_IN' ? (
                      <button
                        onClick={() => onUpdateStatus(visitor.id, 'CHECKED_OUT')}
                        className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Checkout Visitor
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(visitor.id, 'CHECKED_IN')}
                        className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Check In Now
                      </button>
                    )}

                    <button
                      onClick={() => onOpenPass(visitor)}
                      className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" /> View Digital Pass
                    </button>
                  </div>
                </div>

                {/* Visit Details Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Visit Specifications</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 block mb-1">Host Employee</span>
                      <span className="font-bold text-slate-200">{visitor.hostName}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 block mb-1">Department</span>
                      <span className="font-bold text-indigo-400">{visitor.departmentName}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 block mb-1">Check-in Time</span>
                      <span className="font-bold text-slate-200">{visitor.checkInTime || 'Not checked in'}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-500 block mb-1">Expected Duration</span>
                      <span className="font-bold text-slate-200">{visitor.expectedDuration}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & ID Info */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Identification & Contact</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-indigo-400" /> Phone
                      </span>
                      <span className="font-bold text-slate-200">{visitor.phone}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-400" /> Email
                      </span>
                      <span className="font-bold text-slate-200">{visitor.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                      <span className="text-slate-400 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> {visitor.idType}
                      </span>
                      <span className="font-mono font-bold text-slate-200">{visitor.idNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Audit Trail</h4>
                <ActivityTimeline visitorId={visitor.visitorId || visitor.id} />
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verified Documents</h4>
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{visitor.idType} Proof Document</p>
                      <p className="text-[11px] text-slate-400">PDF Document • Encrypted Store</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold">
                    Preview PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
