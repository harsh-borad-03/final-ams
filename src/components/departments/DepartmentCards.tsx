import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Users, DollarSign, TrendingUp, Globe, ShieldAlert, Sparkles, Building, ArrowUpRight } from 'lucide-react';
import { Department } from '../../types';
import { getDepartmentColor } from '../../utils/formatters';

interface DepartmentCardsProps {
  departments: Department[];
}

export const DepartmentCards: React.FC<DepartmentCardsProps> = ({ departments }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return Cpu;
      case 'Users':
        return Users;
      case 'DollarSign':
        return DollarSign;
      case 'TrendingUp':
        return TrendingUp;
      case 'Globe':
        return Globe;
      case 'ShieldAlert':
        return ShieldAlert;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {departments.map((dept, idx) => {
        const Icon = getIcon(dept.iconName || '');
        const theme = getDepartmentColor(dept.color || '');

        return (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            whileHover={{ y: -4 }}
            className={`p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border ${theme.border} shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group`}
          >
            {/* Top Accent Gradient Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.gradient}`} />

            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${theme.bg} ${theme.text} border ${theme.border} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                {dept.code}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-white mb-1 group-hover:text-indigo-300 transition-colors">
              {dept.name}
            </h3>
            <p className="text-xs font-semibold text-slate-400 mb-4">Head: {dept.headName}</p>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-center">
              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Staff</span>
                <span className="text-sm font-extrabold text-white">{dept.employeeCount}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Today</span>
                <span className="text-sm font-extrabold text-emerald-400">{dept.visitorsToday}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Month</span>
                <span className="text-sm font-extrabold text-indigo-400">{dept.visitorsThisMonth}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
