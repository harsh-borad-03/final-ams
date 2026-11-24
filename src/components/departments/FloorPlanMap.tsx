import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { Visitor } from '../../types';

interface FloorPlanMapProps {
  visitors: Visitor[];
}

export const FloorPlanMap: React.FC<FloorPlanMapProps> = ({ visitors }) => {
  const [selectedFloor, setSelectedFloor] = useState('Floor 8 (IT Engineering)');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const rooms = [
    { id: 'room-1', name: 'Executive Boardroom A', floor: 'Floor 8 (IT Engineering)', count: 3, dept: 'EXEC' },
    { id: 'room-2', name: 'AI Research Lab', floor: 'Floor 8 (IT Engineering)', count: 4, dept: 'IT' },
    { id: 'room-3', name: 'Server Infrastructure Room', floor: 'Floor 8 (IT Engineering)', count: 1, dept: 'IT' },
    { id: 'room-4', name: 'Talent Suite 4', floor: 'Floor 3 (Human Resources)', count: 2, dept: 'HR' },
    { id: 'room-5', name: 'Enterprise Sales Demo Hub', floor: 'Floor 5 (Corporate Sales)', count: 5, dept: 'SALES' },
  ];

  const checkedInVisitors = visitors.filter((v) => v.status === 'CHECKED_IN');

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-400" /> Interactive Multi-Floor Facility Map
          </h3>
          <p className="text-xs text-slate-400">Live spatial location of checked-in guests across corporate towers</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none"
          >
            <option value="Floor 8 (IT Engineering)">Tower A - Floor 8 (IT Engineering)</option>
            <option value="Floor 3 (Human Resources)">Tower B - Floor 3 (Human Resources)</option>
            <option value="Floor 5 (Corporate Sales)">Tower B - Floor 5 (Corporate Sales)</option>
          </select>
        </div>
      </div>

      {/* SVG Floor Plan Schematic */}
      <div className="relative w-full h-80 bg-slate-950 border-2 border-slate-800/80 rounded-3xl overflow-hidden p-6 flex flex-col justify-between shadow-inner">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span>{selectedFloor} Schematic</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {checkedInVisitors.length} Active Guests
          </span>
        </div>

        {/* Room Grids */}
        <div className="grid grid-cols-3 gap-4 my-auto">
          {rooms.map((room) => {
            const isSelected = selectedRoom === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group ${
                  isSelected
                    ? 'bg-indigo-950/80 border-indigo-500 shadow-xl shadow-indigo-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-white truncate">{room.name}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-[11px] text-indigo-300 font-semibold">{room.count} Visitors Currently Active</p>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <MapPin className="w-3 h-3 text-cyan-400" /> Zone: {room.dept}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Visitor Presence
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> Restricted Access Zone
          </span>
        </div>
      </div>
    </div>
  );
};
