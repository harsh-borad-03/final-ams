import React, { useState } from 'react';
import { Building, ShieldCheck, MapPin, Plus, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { mockLocations, mockGates } from '../../data/mockData';
import { Location, Gate, GateStatus } from '../../types';

export const LocationsAndGates: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [gates, setGates] = useState<Gate[]>(mockGates);

  const toggleGateStatus = (gateId: string, currentStatus: GateStatus) => {
    const nextStatus: GateStatus =
      currentStatus === 'OPEN' ? 'BUSY' : currentStatus === 'BUSY' ? 'CLOSED' : 'OPEN';

    setGates((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, status: nextStatus } : g))
    );
  };

  return (
    <div className="space-y-8">
      {/* Locations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-400" /> Enterprise Multi-Location Management
            </h2>
            <p className="text-xs text-slate-400">Headquarters, regional branches, and warehouse facilities</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg">
            + Add New Location
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <div key={loc.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white">{loc.name}</h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    loc.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {loc.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {loc.address}
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Manager: <strong className="text-slate-200">{loc.managerName}</strong></span>
                <span>Gates: <strong className="text-indigo-400">{loc.gateCount}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Multi-Gate Security Portal Control
            </h2>
            <p className="text-xs text-slate-400">Turnstiles, VIP driveways, and loading bays</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gates.map((gate) => (
            <div key={gate.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">{gate.name}</h4>
                  <p className="text-[11px] text-slate-400">{gate.locationName}</p>
                </div>

                <button
                  onClick={() => toggleGateStatus(gate.id, gate.status)}
                  className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                    gate.status === 'OPEN'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : gate.status === 'BUSY'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {gate.status === 'OPEN' ? '🟢 OPEN' : gate.status === 'BUSY' ? '🟡 BUSY' : '🔴 CLOSED'}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Gate Officer:</span>
                  <span className="font-bold text-slate-200">{gate.securityOfficer}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Visitors Today:</span>
                  <span className="font-bold text-indigo-300">{gate.visitorsToday}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Currently Inside:</span>
                  <span className="font-bold text-emerald-400">{gate.currentlyInside}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
