import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Copy, CheckCircle2, X, QrCode, ShieldCheck, Printer, Send, Clock, Sparkles } from 'lucide-react';
import { Visitor } from '../../types';

interface WifiVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitor: Visitor | null;
}

export const WifiVoucherModal: React.FC<WifiVoucherModalProps> = ({ isOpen, onClose, visitor }) => {
  const [copied, setCopied] = useState(false);
  const [sentSMS, setSentSMS] = useState(false);

  if (!isOpen || !visitor) return null;

  const wifiSSID = 'AuraGuest-HighSpeed-5G';
  const wifiPass = `GUEST-${Math.floor(1000 + Math.random() * 9000)}-${visitor.fullName.substring(0, 3).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`SSID: ${wifiSSID}\nPassword: ${wifiPass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSMS = () => {
    setSentSMS(true);
    setTimeout(() => setSentSMS(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Guest Wi-Fi Access Voucher</h3>
                <p className="text-xs text-slate-400">Temporary high-speed network credentials</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Pass */}
          <div className="p-6 space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/30 shadow-xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  WPA3 Enterprise Secure
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Valid 12 Hrs
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold">Issued For:</p>
                <h4 className="text-lg font-black text-white">{visitor.fullName}</h4>
                <p className="text-xs text-cyan-300 font-mono">{visitor.company}</p>
              </div>

              {/* Wi-Fi Credentials Box */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Network (SSID):</span>
                  <span className="font-bold text-cyan-300">{wifiSSID}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Password Key:</span>
                  <span className="font-bold text-amber-300">{wifiPass}</span>
                </div>
              </div>

              {/* QR Code Auto Connect */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-800/80">
                <div className="p-2 rounded-xl bg-white text-slate-950 shadow-md">
                  <QrCode className="w-14 h-14" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-extrabold text-white">Scan to Connect Automatically</p>
                  <p className="text-[11px] text-slate-400">Point phone camera at QR code to join Wi-Fi without typing password.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Wi-Fi Key'}
                </button>

                <button
                  onClick={handleSendSMS}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-cyan-400" />
                  {sentSMS ? 'Sent SMS!' : 'Send SMS to Phone'}
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold text-xs hover:text-white flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-indigo-400" /> Print Wi-Fi Slip
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
