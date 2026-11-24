import React, { useState } from 'react';
import { Visitor } from '../../types';

interface AMSVisitorGatePassProps {
  visitor: Partial<Visitor>;
  defaultMode?: 'front' | 'back' | 'both';
  hideTabs?: boolean;
}

export const AMSVisitorGatePass: React.FC<AMSVisitorGatePassProps> = ({ 
  visitor, 
  defaultMode = 'both',
  hideTabs = false
}) => {
  const [activeTab, setActiveTab] = useState<'front' | 'back' | 'both'>(defaultMode);

  const getSystemLocalDate = (): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getSystemLocalTime = (): string => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const todayDate = visitor.validFrom || getSystemLocalDate();
  const currentTime = visitor.inTime || getSystemLocalTime();
  const rawId = (visitor.passCode || visitor.id || '00001').replace(/[^0-9]/g, '').slice(-5).padStart(5, '0') || '00001';

  // Front Side Component (Centered Details, Bold Typography, Clean Gate Pass Layout - 20cm x 8.5cm)
  const FrontSide = () => (
    <div className="gate-pass-card bg-white text-slate-950 border-2 border-slate-950 rounded-xl p-2 sm:p-2.5 max-w-[20cm] w-full mx-auto shadow-sm font-sans text-xs select-none relative flex flex-col justify-between box-border overflow-hidden">
      {/* Top Header: Centered Large Logo & Title */}
      <div className="text-center pb-1 border-b-2 border-slate-950 shrink-0">
        <div className="flex items-center justify-center py-0.5">
          <img 
            src="/ams-logo.jpg" 
            alt="AMS Logo" 
            className="h-7 sm:h-8 max-w-[170px] object-contain mx-auto" 
          />
        </div>
        <h1 className="text-[12px] sm:text-[12.5px] font-black tracking-tight uppercase text-slate-950 mt-0.5 leading-tight font-mono">
          ADVANCED MEDTECH SOLUTIONS PVT LTD
        </h1>
        <h2 className="text-[10.5px] sm:text-[11px] font-black tracking-wider uppercase text-slate-950 leading-tight font-mono">
          VISITOR GATE PASS
        </h2>
        <div className="flex items-center justify-center gap-6 text-[9px] sm:text-[9.5px] font-mono text-slate-900 font-extrabold mt-0.5">
          <span>PASS NO : <b className="text-slate-950 font-black text-[9.5px]">#{rawId}</b></span>
          <span>DATE : <b className="text-slate-950 font-black">{todayDate}</b></span>
          <span>TIME IN : <b className="text-slate-950 font-black">{currentTime}</b></span>
        </div>
      </div>

      {/* Main Body: Centered Details Table & Framed Visitor Face Photo */}
      <div className="py-0.5 flex-1 flex items-center justify-center">
        <div className="w-full max-w-[18.5cm] mx-auto flex items-center justify-between gap-3">
          {/* Left: Bold Monospace Details Table */}
          <div className="flex-1 min-w-0">
            <table className="w-full text-[10px] sm:text-[10.5px] font-mono text-slate-950 border-collapse leading-tight">
              <tbody>
                {/* 1. Name */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Name</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950 truncate">{visitor.fullName || 'MR ANKIT KUMAR'}</td>
                </tr>

                {/* 2. Company Name */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Company Name</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950 truncate">{visitor.company || visitor.address || 'ADVANCED MEDTECH SOLUTIONS'}</td>
                </tr>

                {/* 3. Contact No */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Contact No</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black text-slate-950">{visitor.phone || '9996995117'}</td>
                </tr>

                {/* 4. Visitor Type */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Visitor Type</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950 truncate">{visitor.visitorType || visitor.category || 'GUEST'}</td>
                </tr>

                {/* 5. Purpose of Visit */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Purpose of Visit</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950 truncate">{visitor.purpose || 'OFFICIAL MEETING'}</td>
                </tr>

                {/* 6. To Meet */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">To Meet</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950 truncate">{visitor.hostName || 'MR RAHUL SINGH'}</td>
                </tr>

                {/* 7. Devices Carrying */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Devices Carrying</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950 truncate">{visitor.assets || 'NONE'}</td>
                </tr>

                {/* 8. Time Out */}
                <tr className="align-top">
                  <td className="py-0.5 pr-1 font-black text-slate-800 whitespace-nowrap w-32">Time Out</td>
                  <td className="py-0.5 px-0.5 font-black text-slate-900 w-2 text-center">:</td>
                  <td className="py-0.5 pl-1 font-black uppercase text-slate-950">{visitor.outTime && visitor.outTime !== '--' ? visitor.outTime : ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right: Large Framed Visitor Webcam Photo */}
          <div className="shrink-0 flex flex-col items-center justify-center">
            <div className="w-18 h-22 sm:w-20 sm:h-24 border-2 border-slate-950 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shadow-md relative">
              {visitor.photoUrl ? (
                <img src={visitor.photoUrl} alt="Visitor" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 text-[8.5px] text-center font-sans font-bold">VISITOR PHOTO</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section: 3 Roomy Signature Boxes for Pen Signing */}
      <div className="shrink-0 pt-0.5 pb-0.5 border-t-2 border-slate-950 grid grid-cols-3 gap-3 text-center text-[8.5px] sm:text-[9px] font-mono font-black text-slate-950">
        <div className="flex flex-col justify-end">
          <div className="h-6 sm:h-7 border-b-2 border-dashed border-slate-700 mb-0.5"></div>
          <span className="uppercase tracking-tight">Sign of Security</span>
        </div>
        <div className="flex flex-col justify-end">
          <div className="h-6 sm:h-7 border-b-2 border-dashed border-slate-700 mb-0.5"></div>
          <span className="uppercase tracking-tight">Sign of Visitor</span>
        </div>
        <div className="flex flex-col justify-end">
          <div className="h-6 sm:h-7 border-b-2 border-dashed border-slate-700 mb-0.5"></div>
          <span className="uppercase tracking-tight">Sign of Host</span>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="shrink-0 text-center pt-0.5 border-t border-slate-300 text-[7px] font-mono text-slate-800 font-extrabold uppercase tracking-tight">
        NOTE : This visitor pass is only valid for 1 Day, please return it at the exit !
      </div>
    </div>
  );

  // Back Side Component: Exact Rules from Official Card (20cm x 8.5cm - Full Height & Crisp Large Fonts)
  const BackSide = () => (
    <div className="gate-pass-card bg-white text-slate-950 border-2 border-slate-950 rounded-xl p-2 sm:p-2.5 max-w-[20cm] w-full mx-auto shadow-sm font-sans text-xs select-none relative flex flex-col justify-between box-border overflow-hidden">
      {/* Top Header: Logo on left, vertical divider, tagline on right */}
      <div className="flex items-center justify-between pb-1 border-b-2 border-slate-950 shrink-0 px-1">
        <div className="flex items-center gap-2.5">
          <img 
            src="/ams-logo.jpg" 
            alt="Advanced MedTech Solutions" 
            className="h-6 sm:h-7 max-w-[140px] object-contain" 
          />
          <div className="h-5 w-[2px] bg-slate-400" />
          <span className="text-[11px] sm:text-[11.5px] font-sans font-bold text-amber-700 tracking-tight italic">
            advancing the way we care
          </span>
        </div>
        <span className="text-[8.5px] font-mono font-black text-slate-500 uppercase tracking-wide">
          VISITOR SAFETY & PREMISES RULES
        </span>
      </div>

      {/* Main 2-Column Rules Grid with Center Vertical Divider */}
      <div className="py-1 px-1 flex-1 grid grid-cols-2 divide-x-2 divide-slate-300 font-sans items-start">
        {/* Left Column (Do's & Don'ts) */}
        <div className="pr-3 space-y-1.5">
          {/* Top-Left: Do's (Green) */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-700 font-black text-[11px] sm:text-[11.5px]">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-black shrink-0">✓</span>
              <span className="font-extrabold uppercase tracking-tight text-emerald-700">Do's</span>
            </div>
            <ul className="text-[9.5px] sm:text-[10px] font-bold text-slate-900 space-y-0.5 pl-4 list-disc marker:text-emerald-600 leading-tight">
              <li>Always wear badge visibly.</li>
              <li>Stay with host/escort; enter only approved areas.</li>
              <li>Follow all safety & security instructions.</li>
            </ul>
          </div>

          {/* Bottom-Left: Don'ts (Red) */}
          <div className="space-y-0.5 pt-0.5">
            <div className="flex items-center gap-1.5 text-rose-700 font-black text-[11px] sm:text-[11.5px]">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] font-black shrink-0">✕</span>
              <span className="font-extrabold uppercase tracking-tight text-rose-700">DON'TS (PROHIBITED)</span>
            </div>
            <ul className="text-[9px] sm:text-[9.5px] font-bold text-slate-900 space-y-0.5 pl-4 list-disc marker:text-rose-600 leading-tight">
              <li>Do not enter restricted areas without authorization.</li>
              <li>Do not take photos/videos unless permitted.</li>
              <li>Do not touch machinery or equipment.</li>
              <li>Do not smoke or consume tobacco.</li>
              <li>Do not transfer badge to others.</li>
            </ul>
          </div>
        </div>

        {/* Right Column (Validity & Return + Emergency Instructions) */}
        <div className="pl-3 space-y-1.5">
          {/* Top-Right: Validity & Return (Dark Blue) */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-blue-900 font-black text-[11px] sm:text-[11.5px]">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[9px] font-black shrink-0">ℹ</span>
              <span className="font-extrabold uppercase tracking-tight text-blue-900">Validity & Return</span>
            </div>
            <ul className="text-[9.5px] sm:text-[10px] font-bold text-slate-900 space-y-0.5 pl-4 list-disc marker:text-blue-800 leading-tight">
              <li>Badge valid for date of visit only.</li>
              <li>Must be returned at security before exit.</li>
              <li>You are responsible for your own safety – please cooperate.</li>
            </ul>
          </div>

          {/* Bottom-Right: Emergency Instructions (Cyan/Blue) */}
          <div className="space-y-0.5 pt-0.5">
            <div className="flex items-center gap-1.5 text-sky-700 font-black text-[11px] sm:text-[11.5px]">
              <span className="w-3.5 h-3.5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] font-black shrink-0">!</span>
              <span className="font-extrabold uppercase tracking-tight text-sky-700">Emergency Instructions</span>
            </div>
            <ul className="text-[9.5px] sm:text-[10px] font-bold text-slate-900 space-y-0.5 pl-4 list-disc marker:text-sky-600 leading-tight">
              <li>Remain calm, do not panic.</li>
              <li>Follow your host/security/emergency team.</li>
              <li>Use designated emergency exits only.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Contact Footer */}
      <div className="shrink-0 pt-1 border-t-2 border-slate-950 grid grid-cols-2 gap-4 text-[9px] sm:text-[9.5px] font-mono text-slate-900 font-bold px-1">
        <div>
          <span className="text-slate-600 font-bold">Emergency Number:</span> <strong className="text-slate-950 font-black text-[10px]">0266-7671301, 8015 (Speed Dial)</strong>
        </div>
        <div className="text-right">
          <span className="text-slate-600 font-bold">First-aid / OHC:</span> <strong className="text-slate-950 font-black text-[10px]">0266-7671355, 8011 (Speed Dial)</strong>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Interactive Tab Switch for Screen Preview (hidden in print) */}
      {!hideTabs && (
        <div className="no-print flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('front')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'front'
                ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            🪪 Front Pass (20cm × 9.3cm)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('back')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'back'
                ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            🛡️ Back Side (Safety Xerox)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`flex-1 py-1.5 px-3 rounded-lg transition-all ${
              activeTab === 'both'
                ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            📄 Both Sides (Front + Back)
          </button>
        </div>
      )}

      {/* Display Content Based on Tab & Print Handling */}
      {activeTab === 'front' && (
        <div>
          <FrontSide />
        </div>
      )}

      {activeTab === 'back' && (
        <div>
          <BackSide />
        </div>
      )}

      {activeTab === 'both' && (
        <div className="space-y-2">
          <FrontSide />
          <div className="no-print flex items-center justify-center gap-2 my-1 text-[9px] font-mono text-slate-400 border-t border-dashed border-slate-300 pt-1 select-none">
            <span>✂ - - - - - - - - - - - - - - - CUT HERE (49% HALF PAGE) - - - - - - - - - - - - - - - ✂</span>
          </div>
          <div className="print-cut-line hidden" />
          <BackSide />
        </div>
      )}
    </div>
  );
};
