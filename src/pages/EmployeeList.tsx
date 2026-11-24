import React, { useState } from 'react';
import { UserCheck, Search, Plus, Edit3, Trash2 } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeListProps {
  employees: Employee[];
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage employee access profiles and assigned credentials.</p>
        </div>

        <button
          onClick={() => alert("Add Employee Form")}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-violet-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-violet-600 font-mono"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="p-3.5">EMP CODE</th>
                <th className="p-3.5">NAME</th>
                <th className="p-3.5">DEPARTMENT</th>
                <th className="p-3.5">DESIGNATION</th>
                <th className="p-3.5">EMAIL / PHONE</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-mono">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-violet-600">{emp.empCode}</td>
                  <td className="p-3.5 font-bold text-slate-900 font-sans">{emp.name}</td>
                  <td className="p-3.5 text-slate-700">{emp.department}</td>
                  <td className="p-3.5 text-slate-600">{emp.designation}</td>
                  <td className="p-3.5">
                    <div className="text-slate-800">{emp.email}</div>
                    <div className="text-[10px] text-slate-400">{emp.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors">
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
    </div>
  );
};
