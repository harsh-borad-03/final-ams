import React, { useState } from 'react';
import { 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Server, 
  ShieldCheck 
} from 'lucide-react';
import { AccessGroup } from '../types';

interface AccessGroupsProps {
  accessGroups: AccessGroup[];
  setAccessGroups: React.Dispatch<React.SetStateAction<AccessGroup[]>>;
}

export const AccessGroups: React.FC<AccessGroupsProps> = ({
  accessGroups,
  setAccessGroups
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('MARBELLA');
  const [selectedDevices, setSelectedDevices] = useState<string[]>(['Main Gate Device', 'D-P1-Left']);

  const availableDevices = [
    'D-P', 'D-P1-Right', 'D-P1-Left', 'FP-Left', 'FP-Right', 'Main Gate Device', 'Vault Door Controller'
  ];

  const toggleDevice = (device: string) => {
    if (selectedDevices.includes(device)) {
      setSelectedDevices(selectedDevices.filter((d) => d !== device));
    } else {
      setSelectedDevices([...selectedDevices, device]);
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName) return;

    const newGroup: AccessGroup = {
      id: `AG-${(accessGroups.length + 1).toString().padStart(2, '0')}`,
      name: newGroupName,
      company: newCompany,
      assignedDevices: selectedDevices,
      status: 'Active',
      employeeCount: 0
    };

    setAccessGroups([...accessGroups, newGroup]);
    setIsModalOpen(false);
    setNewGroupName('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Access Groups</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage security access groups and assigned door controllers.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-violet-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Group
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="p-3.5">GROUP NAME</th>
                <th className="p-3.5">COMPANY</th>
                <th className="p-3.5">ASSIGNED DEVICES</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">EMPLOYEES</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {accessGroups.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{ag.name}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{ag.company}</td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {ag.assignedDevices.map((dev, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-mono rounded-md border border-slate-200">
                          {dev}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button onClick={() => alert(`Showing employees in ${ag.name}`)} className="text-violet-600 font-bold hover:underline">
                      View ({ag.employeeCount})
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" title="Edit Group">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors" title="Delete Group">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Access Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-800 font-mono">Deploy Access Group Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGroup} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Server Room Access"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-600 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Access Groups Checklist</label>
                <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border max-h-40 overflow-y-auto">
                  {availableDevices.map((dev) => {
                    const isChecked = selectedDevices.includes(dev);
                    return (
                      <label key={dev} className="flex items-center gap-2 font-mono text-[11px] text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDevice(dev)}
                          className="rounded text-violet-600 focus:ring-violet-500"
                        />
                        <span>{dev}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-600/30"
                >
                  Deploy Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
