import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  growth: number;
  description: string;
  icon: LucideIcon;
  gradientTheme: 'indigo' | 'emerald' | 'amber' | 'blue' | 'violet' | 'rose';
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  growth,
  description,
  icon: Icon,
  gradientTheme,
  delay = 0,
}) => {
  const isPositive = growth >= 0;

  const themeStyles = {
    indigo: {
      cardClass: 'bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-950/90 border-indigo-500/30 hover:border-indigo-500/70 shadow-indigo-500/10 hover:shadow-indigo-500/25',
      iconBg: 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/20',
      accentBar: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400',
    },
    emerald: {
      cardClass: 'bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-950/90 border-emerald-500/30 hover:border-emerald-500/70 shadow-emerald-500/10 hover:shadow-emerald-500/25',
      iconBg: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20',
      accentBar: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400',
    },
    amber: {
      cardClass: 'bg-gradient-to-br from-amber-950/60 via-slate-900/90 to-slate-950/90 border-amber-500/30 hover:border-amber-500/70 shadow-amber-500/10 hover:shadow-amber-500/25',
      iconBg: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20',
      accentBar: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500',
    },
    blue: {
      cardClass: 'bg-gradient-to-br from-blue-950/60 via-slate-900/90 to-slate-950/90 border-blue-500/30 hover:border-blue-500/70 shadow-blue-500/10 hover:shadow-blue-500/25',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/20',
      accentBar: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400',
    },
    violet: {
      cardClass: 'bg-gradient-to-br from-violet-950/60 via-slate-900/90 to-slate-950/90 border-violet-500/30 hover:border-violet-500/70 shadow-violet-500/10 hover:shadow-violet-500/25',
      iconBg: 'bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 text-violet-300 border-violet-500/40 shadow-violet-500/20',
      accentBar: 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500',
    },
    rose: {
      cardClass: 'bg-gradient-to-br from-rose-950/60 via-slate-900/90 to-slate-950/90 border-rose-500/30 hover:border-rose-500/70 shadow-rose-500/10 hover:shadow-rose-500/25',
      iconBg: 'bg-gradient-to-br from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20',
      accentBar: 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500',
    },
  }[gradientTheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border ${themeStyles.cardClass} shadow-2xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-300 group`}
    >
      {/* Top Animated Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${themeStyles.accentBar} shadow-sm`} />

      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate pr-1">{title}</span>
        <div className={`p-2 sm:p-2.5 rounded-2xl border ${themeStyles.iconBg} shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3 flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Number Display */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:scale-105 transition-transform origin-left drop-shadow-md">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        <div
          className={`flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-extrabold shadow-sm ${
            isPositive
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-rose-500/10'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          <span>{isPositive ? `+${growth}%` : `${growth}%`}</span>
        </div>
      </div>

      {/* Footer Description */}
      <p className="text-[11px] font-semibold text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span>{description}</span>
        <span className="text-[10px] text-slate-500 font-mono">vs yesterday</span>
      </p>
    </motion.div>
  );
};
