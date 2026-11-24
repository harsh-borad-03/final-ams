import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, User, Building, Phone, Mail, CheckCircle2, ArrowRight, X, Sparkles, Camera, ScanFace, HardHat } from 'lucide-react';
import { Visitor } from '../types';
import { SignaturePad } from '../components/common/SignaturePad';
import { FaceScanModal } from '../components/kiosk/FaceScanModal';
import { LanguageSelector, SupportedLanguage } from '../components/kiosk/LanguageSelector';
import { ContractorSafetyQuizModal } from '../components/kiosk/ContractorSafetyQuizModal';

interface KioskModeProps {
  onCloseKiosk: () => void;
  onRegisterVisitor: (visitorData: Partial<Visitor>) => void;
}

export const KioskMode: React.FC<KioskModeProps> = ({ onCloseKiosk, onRegisterVisitor }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('Executive Meeting');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFaceScanOpen, setIsFaceScanOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [completedVisitor, setCompletedVisitor] = useState<Partial<Visitor> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visitorObj = {
      fullName,
      company,
      phone,
      email,
      purpose,
      category: 'Guest' as const,
      status: 'CHECKED_IN' as const,
    };
    onRegisterVisitor(visitorObj);
    setCompletedVisitor(visitorObj);
    setIsCompleted(true);
  };

  const handleFaceCheckInSuccess = (visitorData: Partial<Visitor>) => {
    onRegisterVisitor(visitorData);
    setCompletedVisitor(visitorData);
    setIsCompleted(true);
  };

  const handleReset = () => {
    setFullName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setSignatureData(null);
    setCompletedVisitor(null);
    setIsCompleted(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 overflow-y-auto select-none bg-mesh-pattern font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Modals */}
      <FaceScanModal
        isOpen={isFaceScanOpen}
        onClose={() => setIsFaceScanOpen(false)}
        onVerifiedCheckIn={handleFaceCheckInSuccess}
      />

      <ContractorSafetyQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onPassedQuiz={() => {
          setIsQuizOpen(false);
        }}
      />

      {/* Kiosk Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[2px] shadow-xl shadow-indigo-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">AuraVMS Lobby Kiosk</h1>
            <p className="text-xs text-indigo-300 font-semibold">Self-Service Visitor Check-In Suite</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <LanguageSelector currentLanguage={language} onSelectLanguage={setLanguage} />

          <button
            onClick={() => setIsQuizOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold text-xs shadow-md flex items-center gap-1.5"
          >
            <HardHat className="w-4 h-4 text-amber-400" /> Safety Quiz
          </button>

          <button
            onClick={() => setIsFaceScanOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 hover:brightness-110 transition"
          >
            <ScanFace className="w-4 h-4 text-cyan-200 animate-pulse" /> AI Face Recognition
          </button>

          <button
            onClick={onCloseKiosk}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white flex items-center gap-2"
          >
            <X className="w-4 h-4" /> Exit Kiosk Mode
          </button>
        </div>
      </div>

      {/* Main Kiosk Content */}
      <div className="my-auto max-w-2xl mx-auto w-full">
        {!isCompleted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                  Welcome Guest • Step {step} of 2
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">Welcome to Aura Solutions HQ</h2>
                <p className="text-xs text-slate-400">Please enter your details below or use AI Face Scan for instant check-in.</p>
              </div>

              <button
                onClick={() => setIsFaceScanOpen(true)}
                className="hidden sm:flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition text-center group"
              >
                <ScanFace className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-extrabold mt-1 uppercase tracking-wider">Instant Face Scan</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nexus Cloud Technologies"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 (415) 892-1044"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Purpose of Visit *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="e.g. Executive Meeting, Site Inspection, Client Visit..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!fullName || !company || !phone}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    Continue to NDA Signature <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <SignaturePad onSaveSignature={(sig) => setSignatureData(sig)} />

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 rounded-2xl bg-slate-800 text-xs font-bold text-slate-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!signatureData}
                      className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      Complete & Print Digital Badge <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Check-In Successful!</h2>
              <p className="text-xs text-emerald-300 mt-1 font-semibold">Host Dr. Sarah Jenkins has been notified via Slack.</p>
            </div>

            <p className="text-xs text-slate-400">Please take your printed QR Visitor Pass from the printer tray below.</p>

            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs shadow-lg"
            >
              Done / Return to Welcome Screen
            </button>
          </motion.div>
        )}
      </div>

      {/* Kiosk Footer */}
      <div className="border-t border-slate-800/80 pt-4 flex justify-between text-[11px] text-slate-500">
        <span>Touch Screen Active</span>
        <span>AuraVMS Lobby Kiosk Suite v1.0</span>
      </div>
    </div>
  );
};
