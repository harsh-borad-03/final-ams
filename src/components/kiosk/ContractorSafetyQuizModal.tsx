import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, CheckCircle2, X, AlertTriangle, ShieldCheck, ArrowRight, Award } from 'lucide-react';

interface ContractorSafetyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPassedQuiz: () => void;
}

export const ContractorSafetyQuizModal: React.FC<ContractorSafetyQuizModalProps> = ({
  isOpen,
  onClose,
  onPassedQuiz,
}) => {
  const [step, setStep] = useState(1);
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState<string | null>(null);
  const [q3, setQ3] = useState<string | null>(null);
  const [passed, setPassed] = useState(false);

  if (!isOpen) return null;

  const handleSubmitQuiz = () => {
    if (q1 === 'yes' && q2 === 'yes' && q3 === 'yes') {
      setPassed(true);
    } else {
      alert('Please review safety guidelines and accept all mandatory site safety requirements.');
    }
  };

  const handleComplete = () => {
    onPassedQuiz();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Contractor Safety & Compliance Quiz</h3>
                <p className="text-xs text-slate-400">Mandatory site induction verification before gate badge issuance</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quiz Content */}
          <div className="p-6 space-y-5">
            {!passed ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Mandatory Site Safety Rules
                  </p>
                  <p>All contractors, vendors, and service engineers must acknowledge facility safety standards.</p>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Q1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="font-bold text-white">1. Are you wearing required PPE (Hard Hat, High-Vis Vest, Steel Toe Shoes)?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setQ1('yes')}
                        className={`flex-1 py-2 rounded-xl font-bold border transition ${
                          q1 === 'yes' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Yes, Full PPE Compliant
                      </button>
                    </div>
                  </div>

                  {/* Q2 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="font-bold text-white">2. Have you identified primary emergency evacuation assembly points & fire exits?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setQ2('yes')}
                        className={`flex-1 py-2 rounded-xl font-bold border transition ${
                          q2 === 'yes' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Yes, I Know Assembly Area
                      </button>
                    </div>
                  </div>

                  {/* Q3 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className="font-bold text-white">3. Do you agree to comply with facility NDA & zero-hazard work permits?</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setQ3('yes')}
                        className={`flex-1 py-2 rounded-xl font-bold border transition ${
                          q3 === 'yes' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Yes, I Agree & Sign NDA
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!q1 || !q2 || !q3}
                  onClick={handleSubmitQuiz}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  Verify Compliance & Issue Safety Stamp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Success Certificate Card */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-xl font-black text-white">Safety Induction Certified!</h4>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    Contractor Safety Compliance Certificate #STAMP-8894 Verified
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Check-In <CheckCircle2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
