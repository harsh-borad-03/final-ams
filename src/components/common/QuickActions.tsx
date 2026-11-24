import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, CalendarPlus, QrCode, UserCheck, FileBarChart, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  onRegisterVisitor: () => void;
  onNavigate: (tab: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onRegisterVisitor, onNavigate }) => {
  const actions = [
    {
      id: 'register',
      title: 'Register Visitor',
      desc: 'Instant check-in & ID upload',
      icon: UserPlus,
      gradient: 'from-indigo-600 to-violet-600',
      border: 'border-indigo-500/30',
      onClick: onRegisterVisitor,
    },
    {
      id: 'appointment',
      title: 'Schedule Appointment',
      desc: 'Book host interview / client meet',
      icon: CalendarPlus,
      gradient: 'from-emerald-600 to-teal-600',
      border: 'border-emerald-500/30',
      onClick: () => onNavigate('appointments'),
    },
    {
      id: 'pass',
      title: 'Create Visitor Pass',
      desc: 'Issue print & digital QR badge',
      icon: QrCode,
      gradient: 'from-violet-600 to-fuchsia-600',
      border: 'border-violet-500/30',
      onClick: () => onNavigate('passes'),
    },
    {
      id: 'employee',
      title: 'Add Employee',
      desc: 'Register staff host member',
      icon: UserCheck,
      gradient: 'from-blue-600 to-cyan-600',
      border: 'border-blue-500/30',
      onClick: () => onNavigate('employees'),
    },
    {
      id: 'report',
      title: 'Generate Report',
      desc: 'Export security & traffic logs',
      icon: FileBarChart,
      gradient: 'from-amber-500 to-orange-600',
      border: 'border-amber-500/30',
      onClick: () => onNavigate('reports'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -3 }}
            onClick={action.onClick}
            className={`p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border ${action.border} shadow-lg hover:shadow-xl transition-all text-left flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                {action.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">{action.desc}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
