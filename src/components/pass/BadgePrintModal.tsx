import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Download, X, QrCode, ShieldCheck, User, Building, Calendar, Clock, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Visitor } from '../../types';

interface BadgePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitor: Visitor | null;
}

export const BadgePrintModal: React.FC<BadgePrintModalProps> = ({ isOpen, onClose, visitor }) => {
  const [badgeFormat, setBadgeFormat] = useState<'Standard 4x3' | 'Lanyard ID' | 'Sticker Pass'>('Standard 4x3');
  const [colorTheme, setColorTheme] = useState<'Indigo' | 'Emerald' | 'Violet' | 'Dark'>('Indigo');
  const [isPrinting, setIsPrinting] = useState(false);

  if (!isOpen || !visitor) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  };

  const getThemeClasses = () => {
    switch (colorTheme) {
      case 'Emerald':
        return 'from-emerald-600 to-teal-700 text-emerald-300 border-emerald-500/40';
      case 'Violet':
        return 'from-purple-600 to-indigo-700 text-purple-300 border-purple-500/40';
      case 'Dark':
        return 'from-slate-800 to-slate-950 text-slate-300 border-slate-700';
      default:
        return 'from-indigo-600 to-violet-700 text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Print Physical Visitor Badge</h3>
                <p className="text-xs text-slate-400">Custom thermal badge formatting & printer preview</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Controls Bar */}
          <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">Badge Size:</span>
              {(['Standard 4x3', 'Lanyard ID', 'Sticker Pass'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setBadgeFormat(fmt)}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    badgeFormat === fmt
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">Theme:</span>
              {(['Indigo', 'Emerald', 'Violet', 'Dark'] as const).map((thm) => (
                <button
                  key={thm}
                  onClick={() => setColorTheme(thm)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                    colorTheme === thm
                      ? 'bg-slate-800 text-white border-indigo-400'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  {thm}
                </button>
              ))}
            </div>
          </div>

          {/* Badge Preview Area */}
          <div className="p-8 overflow-y-auto flex items-center justify-center bg-slate-950/90 print:p-0">
            {/* Printable Badge Container */}
            <div
              id="printable-visitor-badge"
              className={`w-full max-w-sm rounded-3xl bg-slate-900 border-2 shadow-2xl p-6 relative overflow-hidden transition-all duration-300 ${getThemeClasses()}`}
            >
              {/* Badge Header Header Banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm tracking-tight">AURA SOLUTIONS HQ</h4>
                    <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest">
                      {visitor.category || 'GUEST PASS'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono text-[11px] font-bold">
                  {visitor.badgeNumber || `PASS-${visitor.id.substring(0, 6).toUpperCase()}`}
                </span>
              </div>

              {/* Visitor Details */}
              <div className="flex items-center gap-4 my-4">
                {visitor.photoUrl ? (
                  <img
                    src={visitor.photoUrl}
                    alt={visitor.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-white/20 flex items-center justify-center text-white">
                    <User className="w-10 h-10 text-white/60" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-xl text-white truncate">{visitor.fullName}</h3>
                  <p className="text-xs font-semibold text-white/80 flex items-center gap-1 mt-0.5 truncate">
                    <Building className="w-3.5 h-3.5 flex-shrink-0" /> {visitor.company || 'Independent Visitor'}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-extrabold uppercase">
                    Host: {visitor.hostName}
                  </div>
                </div>
              </div>

              {/* Visit Info Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-white/10 text-xs my-4">
                <div>
                  <span className="text-[10px] text-white/60 font-bold block uppercase">Check-In Time</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-white/70" /> {visitor.checkInTime || '09:30 AM'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-white/60 font-bold block uppercase">Access Level</span>
                  <span className="font-bold text-emerald-300 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Standard
                  </span>
                </div>
              </div>

              {/* QR Code & Barcode */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="p-1.5 rounded-xl bg-white text-slate-950 shadow-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(visitor.passCode || visitor.id)}`}
                    alt={`QR Code ${visitor.passCode || visitor.id}`}
                    className="w-12 h-12 object-contain"
                  />
                </div>

                <div className="text-right font-mono text-[10px] text-white/70">
                  <p className="font-bold text-white text-xs">{visitor.departmentName || 'Main Lobby'}</p>
                  <p>VALID FOR TODAY ONLY</p>
                  <p className="text-[9px] opacity-60">ID: {visitor.idNumber || 'VERIFIED'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Compatible with Dymo, Zebra & Standard Printers
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 hover:brightness-110"
              >
                <Printer className="w-4 h-4" /> Print Badge Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
