import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { Visitor } from '../../types';

interface DigitalVisitorPassProps {
  visitor: Visitor | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPrintBadge?: (v: Visitor) => void;
  onOpenWifiVoucher?: (v: Visitor) => void;
}

export const DigitalVisitorPass: React.FC<DigitalVisitorPassProps> = ({
  visitor,
  isOpen,
  onClose,
  onOpenPrintBadge,
  onOpenWifiVoucher,
}) => {
  if (!isOpen || !visitor) return null;

  const handlePrint = () => {
    if (onOpenPrintBadge) {
      onOpenPrintBadge(visitor);
    } else {
      window.print();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-6"
        >
          {/* Header Controls */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Digital Security Pass
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Badge Card */}
          <div className="p-6 bg-slate-950 print:bg-white print:text-black">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-indigo-500/40 p-6 shadow-2xl text-slate-100 flex flex-col items-center text-center">
              {/* Badge Top Header */}
              <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xs">
                    AV
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white">AuraVMS Enterprise</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded uppercase">
                  ACTIVE PASS
                </span>
              </div>

              {/* Photo & Name */}
              <div className="relative mb-3">
                <img
                  src={visitor.photoUrl}
                  alt={visitor.fullName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
                />
                {visitor.isVip && (
                  <span className="absolute -top-2 -right-2 p-1.5 bg-amber-500 text-slate-950 rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-white tracking-tight">{visitor.fullName}</h2>
              <p className="text-xs font-semibold text-indigo-300 mb-4">{visitor.company}</p>

              {/* Badge Details Grid */}
              <div className="w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 mb-4 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Visitor ID:</span>
                  <span className="font-mono font-bold text-indigo-300">{visitor.visitorId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Host Employee:</span>
                  <span className="font-bold text-slate-200">{visitor.hostName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-bold text-cyan-400">{visitor.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Access Level:</span>
                  <span className="font-bold text-emerald-400">Standard HQ Floor Access</span>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="p-2.5 bg-white rounded-2xl shadow-inner mb-2 flex items-center justify-center border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(visitor.passCode || visitor.id)}`}
                  alt={`QR Code ${visitor.passCode || visitor.id}`}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">SCAN AT TURNSTILE SECURITY</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Badge
              </button>
              {onOpenWifiVoucher && (
                <button
                  onClick={() => onOpenWifiVoucher(visitor)}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2"
                >
                  Guest Wi-Fi Pass
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
