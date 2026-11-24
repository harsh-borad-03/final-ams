import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, CheckCircle2, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('To install AuraVMS app, tap your browser menu (⋮ or Share) and select "Add to Home Screen" or "Install App".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner || installed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-3xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl backdrop-blur-xl text-slate-100 flex items-center justify-between gap-3 glow-border-indigo"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              Install AuraVMS App
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold uppercase">PWA</span>
            </h4>
            <p className="text-[11px] text-slate-400">Add to Home Screen for fast offline access & push alerts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1 hover:brightness-110 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" /> Install
          </button>
          <button onClick={() => setShowBanner(false)} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
