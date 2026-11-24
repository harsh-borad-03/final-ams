import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, ShieldCheck, CheckCircle2, AlertTriangle, Scan } from 'lucide-react';
import { Visitor } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: Visitor[];
  onVerifyVisitor: (visitor: Visitor) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  visitors,
  onVerifyVisitor,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [scannedVisitor, setScannedVisitor] = useState<Visitor | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (visitor: Visitor) => {
    setScannedVisitor(visitor);
    onVerifyVisitor(visitor);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Security Turnstile QR Scanner</h3>
                <p className="text-xs text-slate-400">Scan digital badge QR or search visitor ID</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scanner View Box */}
          <div className="p-6 flex flex-col items-center space-y-4">
            <div className="relative w-64 h-64 rounded-3xl bg-slate-950 border-2 border-dashed border-indigo-500/50 flex flex-col items-center justify-center overflow-hidden shadow-2xl group">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 animate-pulse-slow shadow-lg" />

              <QrCode className="w-20 h-20 text-indigo-400 animate-pulse mb-2" />
              <span className="text-xs font-bold text-slate-300">Align QR Badge Inside Frame</span>
              <span className="text-[10px] text-slate-500 mt-1">Live Camera Feed Active</span>
            </div>

            {/* Simulated Badge Selection Shortcuts */}
            <div className="w-full space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Simulate Camera Scan for Visitor:
              </span>
              <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                {visitors.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSimulateScan(v)}
                    className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between text-xs text-left group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={v.photoUrl} alt={v.fullName} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-200 group-hover:text-indigo-300">{v.fullName}</p>
                        <p className="text-[10px] font-mono text-slate-400">{v.visitorId}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 text-[10px] font-bold">
                      Scan Pass
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scanned Verification Popup */}
            {scannedVisitor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="font-extrabold text-white">ACCESS GRANTED</p>
                    <p className="text-emerald-300">{scannedVisitor.fullName} ({scannedVisitor.company})</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-slate-950 font-extrabold text-xs"
                >
                  Done
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
