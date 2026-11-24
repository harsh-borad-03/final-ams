import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Mail, Phone, Building, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeTableProps {
  employees: Employee[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees: initialEmployees }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Employee Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [departmentName, setDepartmentName] = useState('Information Technology');
  const [location, setLocation] = useState('Tower A - Floor 8');

  const filtered = employees.filter(
    (emp) =>
      (emp.fullName || emp.name).toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()) ||
      (emp.departmentName || emp.department).toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Employee = {
      id: `emp-${Date.now()}`,
      empCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullName,
      fullName,
      email,
      phone,
      department: departmentName,
      departmentId: 'dept-1',
      departmentName,
      designation,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      status: 'Active',
      accessGroup: 'ALL Access',
      location,
    };

    setEmployees([created, ...employees]);
    setIsAddModalOpen(false);
    setFullName('');
    setEmail('');
    setPhone('');
    setDesignation('');
  };

  return (
    <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="relative flex-1 w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search employee name, email or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> + Add New Employee Host
        </button>
      </div>

      {/* Employee List Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-x-auto custom-scrollbar">
        {filtered.length > 0 ? (
          <table className="w-full text-left text-xs font-medium text-slate-200">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="py-3.5 px-4">Employee Name</th>
                <th className="py-3.5 px-4">ID Code</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Contact Email</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-3">
                    <img src={emp.avatarUrl} alt={emp.fullName} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30" />
                    {emp.fullName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-cyan-400">{emp.employeeId}</td>
                  <td className="py-3.5 px-4 text-slate-300">{emp.designation}</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-300">{emp.departmentName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{emp.email}</td>
                  <td className="py-3.5 px-4 text-slate-400">{emp.location}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✓ Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <UserPlus className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
            <p className="text-sm font-bold text-slate-400">No Employees Found</p>
            <p className="text-xs text-slate-500">Click "+ Add New Employee Host" above to add your company staff members.</p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" /> Add New Employee Host
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="s.jenkins@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="VP of Engineering"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Department</label>
                  <select
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="Information Technology">Information Technology</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Corporate Sales">Corporate Sales</option>
                    <option value="Executive Management">Executive Management</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-xs shadow-xl mt-4"
              >
                + Add Employee Host Record
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
