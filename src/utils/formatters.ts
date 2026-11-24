import { VisitorStatus } from '../types';

export const getStatusBadgeStyle = (status: VisitorStatus) => {
  switch (status) {
    case 'CHECKED_IN':
      return {
        label: 'Checked In',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300',
        dotClass: 'bg-emerald-500 animate-pulse',
      };
    case 'CHECKED_OUT':
      return {
        label: 'Checked Out',
        badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20 dark:bg-slate-800 dark:text-slate-300',
        dotClass: 'bg-slate-400',
      };
    case 'PENDING':
      return {
        label: 'Pending Approval',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300',
        dotClass: 'bg-amber-500 animate-ping',
      };
    case 'REJECTED':
      return {
        label: 'Rejected',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300',
        dotClass: 'bg-rose-500',
      };
    case 'EXPECTED':
      return {
        label: 'Expected',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300',
        dotClass: 'bg-blue-400',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        dotClass: 'bg-slate-400',
      };
  }
};

export const getDepartmentColor = (colorName: string) => {
  switch (colorName) {
    case 'indigo':
      return {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/20',
        text: 'text-indigo-400',
        gradient: 'from-indigo-600 to-violet-600',
        glow: 'shadow-indigo-500/20',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        text: 'text-emerald-400',
        gradient: 'from-emerald-600 to-teal-600',
        glow: 'shadow-emerald-500/20',
      };
    case 'amber':
      return {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        gradient: 'from-amber-500 to-orange-600',
        glow: 'shadow-amber-500/20',
      };
    case 'blue':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        gradient: 'from-blue-600 to-cyan-600',
        glow: 'shadow-blue-500/20',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        text: 'text-cyan-400',
        gradient: 'from-cyan-600 to-teal-500',
        glow: 'shadow-cyan-500/20',
      };
    case 'violet':
      return {
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        text: 'text-violet-400',
        gradient: 'from-violet-600 to-fuchsia-600',
        glow: 'shadow-violet-500/20',
      };
    case 'pink':
      return {
        bg: 'bg-pink-500/10',
        border: 'border-pink-500/20',
        text: 'text-pink-400',
        gradient: 'from-pink-600 to-rose-600',
        glow: 'shadow-pink-500/20',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        border: 'border-slate-500/20',
        text: 'text-slate-400',
        gradient: 'from-slate-600 to-slate-800',
        glow: 'shadow-slate-500/20',
      };
  }
};

export const formatStatusWithApprover = (status: string, actionTakenBy?: string) => {
  if (!actionTakenBy || status === 'Pending') return status;
  let cleanName = actionTakenBy.split('(')[0].trim();
  if (cleanName === 'SA') cleanName = 'Super Admin';
  return `${status} (${cleanName})`;
};
