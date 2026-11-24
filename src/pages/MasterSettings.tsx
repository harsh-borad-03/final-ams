import React, { useState } from 'react';
import { Building2, Plus, Edit3, Trash2, Search, CheckCircle2, MapPin, Layers } from 'lucide-react';
import { MasterItem } from '../types';

interface MasterSettingsProps {
  type: 'company' | 'branch' | 'department';
  items: MasterItem[];
  setItems: React.Dispatch<React.SetStateAction<MasterItem[]>>;
}

export const MasterSettings: React.FC<MasterSettingsProps> = ({ type, items, setItems }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');

  const getTitle = () => {
    switch (type) {
      case 'company':
        return 'Company Master';
      case 'branch':
        return 'Branch Master';
      case 'department':
        return 'Department Master';
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newItem: MasterItem = {
      id: `${type.toUpperCase()}-${items.length + 1}`,
      code: code.toUpperCase() || 'MST',
      name,
      status: 'Active'
    };

    setItems([...items, newItem]);
    setIsModalOpen(false);
    setName('');
    setCode('');
  };

  const handleDeleteItem = (id: string, itemName: string) => {
    if (window.confirm(`Delete ${type} "${itemName}"? This item will be removed permanently.`)) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Super Admin Master Management Portal</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/30 transition-all font-mono"
        >
          <Plus className="w-4 h-4" />
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="p-3.5">CODE</th>
                <th className="p-3.5">NAME</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-purple-600">{item.code}</td>
                  <td className="p-3.5 font-bold text-slate-900 font-sans">{item.name}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title={`Delete ${type}`}
                      >
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 font-mono">Add New {getTitle()}</h3>

            <form onSubmit={handleAddItem} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Code:</label>
                <input
                  type="text"
                  placeholder="e.g. HQ"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Tower"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
