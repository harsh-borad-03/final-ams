import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ShieldCheck, RefreshCw, X, CheckCircle2, UserCheck, Sparkles, AlertTriangle, UserPlus, Flashlight } from 'lucide-react';
import { Visitor } from '../../types';

interface FaceScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingVisitors?: Visitor[];
  onVerifiedCheckIn: (visitor: Partial<Visitor>) => void;
}

const PRESET_VIP_MATCHES: Partial<Visitor>[] = [
  {
    fullName: 'Dr. Marcus Vance',
    company: 'Quantum Dynamics',
    email: 'm.vance@quantumdyn.com',
    phone: '+1 (555) 019-2834',
    purpose: 'Executive Board Review',
    hostName: 'Dr. Sarah Jenkins',
    category: 'VIP',
    status: 'CHECKED_IN',
  },
  {
    fullName: 'Elena Rostova',
    company: 'Apex CyberSec Solution',
    email: 'e.rostova@apexcyber.io',
    phone: '+1 (555) 014-9921',
    purpose: 'Security Audit & Compliance',
    hostName: 'Alex Mercer',
    category: 'Vendor',
    status: 'CHECKED_IN',
  },
  {
    fullName: 'Sophia Chen',
    company: 'Biotech Global Corp',
    email: 'sophia.c@biotechglobal.org',
    phone: '+1 (555) 017-4482',
    purpose: 'R&D Partnership Summit',
    hostName: 'Rachel Green',
    category: 'Guest',
    status: 'CHECKED_IN',
  },
];

export const FaceScanModal: React.FC<FaceScanModalProps> = ({
  isOpen,
  onClose,
  existingVisitors = [],
  onVerifiedCheckIn,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('Position face in frame');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [matchedVisitor, setMatchedVisitor] = useState<Partial<Visitor> | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);

  // Initialize camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetScanState();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return;
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      setHasCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((e) => console.log('FaceScan play error:', e));
        };
      }
    } catch (err) {
      console.warn('Webcam access failed or denied. Falling back to AI Simulator Mode.', err);
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (hasCamera && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => console.log('FaceScan attach error:', e));
    }
  }, [hasCamera]);

  const resetScanState = () => {
    setIsScanning(false);
    setScanProgress(0);
    setScanStage('Position face in frame');
    setCapturedImage(null);
    setMatchedVisitor(null);
    setConfidenceScore(null);
  };

  const captureFrame = (): string | null => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    }
    return null;
  };

  const triggerScan = (simulatedVisitor?: Partial<Visitor>) => {
    setIsScanning(true);
    setScanProgress(0);
    setMatchedVisitor(null);
    setConfidenceScore(null);

    // Flash effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    // Capture photo snapshot if camera available
    const snapshot = captureFrame();
    if (snapshot) {
      setCapturedImage(snapshot);
    }

    // Biometric stages animation
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 5;
        if (next < 25) {
          setScanStage('Locating facial geometry & landmarks...');
        } else if (next < 60) {
          setScanStage('Extracting 128-D facial vector embedding...');
        } else if (next < 90) {
          setScanStage('Searching encrypted VIP database & appointments...');
        } else {
          setScanStage('Identity matched & security cleared!');
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsScanning(false);

          // Select match
          const pool = existingVisitors.length > 0 ? existingVisitors : PRESET_VIP_MATCHES;
          const match = simulatedVisitor || pool[Math.floor(Math.random() * pool.length)];
          const score = Math.floor(Math.random() * 5 + 95) + Math.random(); // 95.0 - 99.9%

          setMatchedVisitor(match);
          setConfidenceScore(parseFloat(score.toFixed(1)));
        }
        return next;
      });
    }, 90);
  };

  const handleConfirmCheckIn = () => {
    if (matchedVisitor) {
      onVerifiedCheckIn({
        ...matchedVisitor,
        photoUrl: capturedImage || matchedVisitor.photoUrl,
        status: 'CHECKED_IN',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                  Aura Vision AI • Face Recognition Kiosk
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] uppercase font-bold">
                    Biometric v2.4
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Contactless instant check-in for registered guests & VIPs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="p-6 space-y-6">
            {/* Viewfinder Canvas / Video container */}
            <div className="relative w-full h-80 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
              {/* Flash effect overlay */}
              {flashActive && <div className="absolute inset-0 bg-white z-40 transition-opacity duration-100" />}

              {/* Hidden canvas for snapshot */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Video or AI Simulation background */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${hasCamera ? 'block' : 'hidden'}`}
              />
              {!hasCamera && (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
                  {/* Cyberpunk grid mesh animation */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30 animate-pulse" />

                  {/* Simulated Cyber Silhouette */}
                  <div className="relative z-10 w-36 h-36 rounded-full border-2 border-dashed border-cyan-500/40 flex items-center justify-center bg-cyan-500/5 backdrop-blur-sm">
                    <UserCheck className="w-16 h-16 text-cyan-400/80" />
                  </div>
                  <p className="relative z-10 text-xs font-semibold text-cyan-300/80 mt-3 flex items-center gap-1.5">
                    <Flashlight className="w-3.5 h-3.5" /> AI Virtual Biometric Stream Active
                  </p>
                </div>
              )}

              {/* Reticle / Face Target Grid Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                {/* Target Bounding Frame */}
                <div
                  className={`relative w-56 h-64 border-2 rounded-3xl transition-all duration-300 ${
                    matchedVisitor
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                      : isScanning
                      ? 'border-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.3)]'
                      : 'border-slate-600/60'
                  }`}
                >
                  {/* Corner Accent Brackets */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

                  {/* Laser Laser Scanner Beam */}
                  {isScanning && (
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
                    />
                  )}

                  {/* Facial Mesh Points Overlay */}
                  {(isScanning || matchedVisitor) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-6 opacity-60 animate-pulse">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Biometric Stats Box */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/20">
                  <span>IRIS-ID: 88F4-99B</span>
                  <span>TEMP: 36.6°C NORMAL</span>
                  <span>CLEARANCE: LEVEL-1</span>
                </div>
              </div>
            </div>

            {/* Scan Status & Match Banner */}
            {!matchedVisitor ? (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-2">
                    {isScanning ? (
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                    {scanStage}
                  </span>
                  {isScanning && <span className="text-cyan-400">{scanProgress}%</span>}
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => triggerScan()}
                    disabled={isScanning}
                    className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-extrabold text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition"
                  >
                    <Camera className="w-4 h-4" /> Start AI Face Recognition Scan
                  </button>
                </div>

                {/* Quick Presets for Demo */}
                <div className="pt-2">
                  <p className="text-[11px] font-semibold text-slate-400 mb-2">Simulate Fast Recognition For:</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_VIP_MATCHES.map((vip, idx) => (
                      <button
                        key={idx}
                        onClick={() => triggerScan(vip)}
                        disabled={isScanning}
                        className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        {vip.fullName} ({vip.company})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Verification Success Panel */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {capturedImage ? (
                      <img
                        src={capturedImage}
                        alt="Face scan snapshot"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-emerald-500 text-[10px] font-black text-slate-950">
                      {confidenceScore}%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-black text-white">{matchedVisitor.fullName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                        {matchedVisitor.category || 'VIP Guest'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">{matchedVisitor.company}</p>
                    <p className="text-xs text-emerald-400/90 font-mono mt-0.5">
                      Host: {matchedVisitor.hostName || 'Dr. Sarah Jenkins'} • Purpose: {matchedVisitor.purpose}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={resetScanState}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Rescan
                  </button>
                  <button
                    onClick={handleConfirmCheckIn}
                    className="flex-1 md:flex-none py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition"
                  >
                    Confirm & Check In Now <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
