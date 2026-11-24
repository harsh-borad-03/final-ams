import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserPlus,
  Users,
  Calendar,
  Building,
  QrCode,
  FileText,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Visitor, Employee, Department } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: Visitor[];
  employees: Employee[];
  departments: Department[];
  onSelectVisitor: (visitor: Visitor) => void;
  onOpenRegister: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  visitors,
  employees,
  departments,
  onSelectVisitor,
  onOpenRegister,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredVisitors = query
    ? visitors.filter(
        (v) =>
          v.fullName.toLowerCase().includes(query.toLowerCase()) ||
          (v.visitorId || v.id).toLowerCase().includes(query.toLowerCase()) ||
          v.company.toLowerCase().includes(query.toLowerCase()) ||
          v.hostName.toLowerCase().includes(query.toLowerCase())
      )
    : visitors.slice(0, 5);

  const filteredEmployees = query
    ? employees.filter(
        (e) =>
          (e.fullName || e.name).toLowerCase().includes(query.toLowerCase()) ||
          (e.departmentName || e.department).toLowerCase().includes(query.toLowerCase())
      )
    : employees.slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 md:pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Input */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search visitors, host staff, visitor IDs, departments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 font-medium text-sm focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Quick Actions:</span>
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Register New Visitor
            </button>
          </div>

          {/* Results List */}
          <div className="p-3 max-h-96 overflow-y-auto space-y-4 custom-scrollbar">
            {/* Visitors Group */}
            <div>
              <div className="px-2 mb-2 flex items-center justify-between text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Visitors ({filteredVisitors.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredVisitors.length > 0 ? (
                  filteredVisitors.map((visitor) => (
                    <button
                      key={visitor.id}
                      onClick={() => {
                        onSelectVisitor(visitor);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={visitor.photoUrl}
                          alt={visitor.fullName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100">{visitor.fullName}</span>
                            <span className="text-[10px] font-mono text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/20">
                              {visitor.visitorId}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {visitor.company} • Host: {visitor.hostName} ({visitor.departmentName})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-400 flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 px-3 py-2">No matching visitors found.</p>
                )}
              </div>
            </div>

            {/* Employees Group */}
            <div>
              <div className="px-2 mb-2 flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Staff Hosts ({filteredEmployees.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/30 border border-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatarUrl}
                        alt={emp.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{emp.fullName}</p>
                        <p className="text-[11px] text-slate-400">
                          {emp.designation} • {emp.departmentName}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {emp.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">ESC</kbd> to exit</span>
            <span className="flex items-center gap-1 text-indigo-400">
              <ShieldAlert className="w-3.5 h-3.5" /> Real-time Enterprise Indexing Active
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
