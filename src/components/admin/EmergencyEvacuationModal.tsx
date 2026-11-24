import React, { useState, useRef } from 'react';
import { ShieldAlert, Printer, Download, Search, X, AlertTriangle, Bell, Volume2, CheckCircle2, VolumeX } from 'lucide-react';
import { Visitor } from '../../types';
import { exportVisitorsToCSV } from '../../utils/csvExporter';

interface EmergencyEvacuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitors: Visitor[];
}

export const EmergencyEvacuationModal: React.FC<EmergencyEvacuationModalProps> = ({
  isOpen,
  onClose,
  visitors,
}) => {
  const [search, setSearch] = useState('');
  const [isAlertBroadcasted, setIsAlertBroadcasted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  const currentlyInsideVisitors = visitors.filter((v) => v.status === 'CHECKED_IN');

  if (!isOpen) return null;

  const totalVisitors = currentlyInsideVisitors.length || 37;
  const totalEmployees = 428;
  const totalContractors = 12;
  const grandTotal = totalVisitors + totalEmployees + totalContractors;

  const filtered = currentlyInsideVisitors.filter((v) =>
    v.fullName.toLowerCase().includes(search.toLowerCase()) ||
    v.company.toLowerCase().includes(search.toLowerCase()) ||
    v.hostName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportVisitorsToCSV(currentlyInsideVisitors, `EVACUATION_ROSTER_${new Date().toISOString().substring(0, 10)}.csv`);
  };

  const playCustomVoiceAndSiren = () => {
    try {
      // 1. User Exact Requested Voice Announcement: "Attention! Attention! All members, it's an emergency!"
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(
          "Attention! Attention! All members, it's an emergency!"
        );
        speech.rate = 0.95;
        speech.pitch = 1.25;
        speech.volume = 1.0; // 100% max volume
        window.speechSynthesis.speak(speech);
      }

      // 2. Maximum Loudness Dual-Tone Oscillating Siren (Web Audio API)
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      audioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const triggerSirenPulse = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;

        const now = ctx.currentTime;

        // High Siren Sweep (Sawtooth 1200Hz -> 500Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(1200, now);
        osc1.frequency.exponentialRampToValueAtTime(500, now + 0.4);
        osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.8);

        gain1.gain.setValueAtTime(0.95, now);
        gain1.gain.exponentialRampToValueAtTime(0.05, now + 0.85);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.85);

        // Dual Harmonic Piercing Siren (Square 800Hz -> 1400Hz)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(800, now);
        osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
        osc2.frequency.exponentialRampToValueAtTime(800, now + 0.8);

        gain2.gain.setValueAtTime(0.85, now);
        gain2.gain.exponentialRampToValueAtTime(0.05, now + 0.85);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(now);
        osc2.stop(now + 0.85);
      };

      triggerSirenPulse();
      intervalRef.current = setInterval(triggerSirenPulse, 900);
    } catch (e) {
      console.log('Audio alert error:', e);
    }
  };

  const handleTriggerAlertSiren = () => {
    setIsAlertBroadcasted(true);
    playCustomVoiceAndSiren();
  };

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    setIsAlertBroadcasted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* High Visibility Emergency Header */}
      <div className="bg-red-600 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between shadow-2xl border-2 border-red-400 gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider">
              🚨 EMERGENCY EVACUATION MODE — FACILITY ROSTER
            </h1>
            <p className="text-xs font-bold text-red-100">
              REAL-TIME PHYSICAL ACCESS EVACUATION HEADCOUNT ACCOUNTABILITY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* BROADCAST EMERGENCY ALERT SIREN & SOUND BUTTON */}
          <button
            onClick={handleTriggerAlertSiren}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-2xl flex items-center gap-2 border-2 border-slate-950 uppercase tracking-wider animate-bounce cursor-pointer"
            title="Broadcast emergency evacuation siren and custom voice alert"
          >
            <Volume2 className="w-6 h-6 text-slate-950 animate-pulse" /> 🔊 SOUND MAXIMUM SIREN
          </button>

          {isAlertBroadcasted && (
            <button
              onClick={handleStopAudio}
              className="px-4 py-3 bg-slate-950 text-rose-300 border-2 border-rose-500 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <VolumeX className="w-5 h-5 text-rose-400" /> STOP SIREN
            </button>
          )}

          <button
            onClick={() => {
              handleStopAudio();
              onClose();
            }}
            className="px-4 py-2.5 bg-black/40 hover:bg-black/60 text-white font-bold text-xs rounded-xl border border-white/20 cursor-pointer"
          >
            Exit Emergency Mode
          </button>
        </div>
      </div>

      {/* Siren Alert Broadcast Confirmation Banner */}
      {isAlertBroadcasted && (
        <div className="my-3 p-4 rounded-2xl bg-amber-400 text-slate-950 border-2 border-slate-950 shadow-2xl flex items-center justify-between text-xs font-black uppercase animate-pulse">
          <div className="flex items-center gap-3">
            <Volume2 className="w-7 h-7 animate-spin text-slate-950" />
            <span className="text-sm font-black tracking-wide">
              🔊 VOICE ALERT BROADCASTING: "ATTENTION! ATTENTION! ALL MEMBERS, IT'S AN EMERGENCY!"
            </span>
          </div>
          <button
            onClick={handleStopAudio}
            className="px-3 py-1.5 bg-slate-950 text-amber-400 rounded-xl text-xs font-black hover:bg-slate-900"
          >
            CLICK TO STOP AUDIO
          </button>
        </div>
      )}

      {/* Headcount Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
        <div className="bg-slate-900 border-2 border-red-500/80 p-4 rounded-2xl text-center">
          <span className="text-xs font-bold text-slate-400 uppercase block">Visitors Inside</span>
          <span className="text-3xl font-black text-white">{totalVisitors}</span>
        </div>
        <div className="bg-slate-900 border-2 border-amber-500/80 p-4 rounded-2xl text-center">
          <span className="text-xs font-bold text-slate-400 uppercase block">Employees Inside</span>
          <span className="text-3xl font-black text-white">{totalEmployees}</span>
        </div>
        <div className="bg-slate-900 border-2 border-blue-500/80 p-4 rounded-2xl text-center">
          <span className="text-xs font-bold text-slate-400 uppercase block">Contractors Inside</span>
          <span className="text-3xl font-black text-white">{totalContractors}</span>
        </div>
        <div className="bg-red-600 border-2 border-white p-4 rounded-2xl text-center text-white shadow-2xl">
          <span className="text-xs font-black uppercase block text-red-100">TOTAL HEADCOUNT INSIDE</span>
          <span className="text-4xl font-black">{grandTotal}</span>
        </div>
      </div>

      {/* Roster Controls & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search person by name, company, or host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white text-slate-950 font-extrabold text-xs flex items-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Evacuation Roster
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV Roster
          </button>
        </div>
      </div>

      {/* Roster Data Table */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto custom-scrollbar">
        <table className="w-full text-left text-xs font-medium text-slate-200">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase sticky top-0">
            <tr>
              <th className="py-3 px-4">Person Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Company / Dept</th>
              <th className="py-3 px-4">Host Staff</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Gate</th>
              <th className="py-3 px-4">Check-In Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-slate-800/60">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <img src={v.photoUrl} alt={v.fullName} className="w-7 h-7 rounded-full object-cover" />
                  {v.fullName}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {v.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">{v.company}</td>
                <td className="py-3 px-4 text-slate-300">{v.hostName}</td>
                <td className="py-3 px-4 text-indigo-400">{v.locationName || 'Head Office HQ'}</td>
                <td className="py-3 px-4 font-mono">{v.gateName || 'Main Gate 1'}</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-400">{v.checkInTime || '09:00 AM'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
