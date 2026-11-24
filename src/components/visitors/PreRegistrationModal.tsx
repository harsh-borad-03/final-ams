import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Link2, Copy, CheckCircle2, X, Calendar, Clock, User, Mail, Building, Car, Sparkles, QrCode } from 'lucide-react';
import { Visitor, Employee } from '../../types';

interface PreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onPreRegister: (visitorData: Partial<Visitor>) => void;
}

export const PreRegistrationModal: React.FC<PreRegistrationModalProps> = ({
  isOpen,
  onClose,
  employees,
  onPreRegister,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [hostId, setHostId] = useState(employees[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [expectedTime, setExpectedTime] = useState('10:00 AM');
  const [purpose, setPurpose] = useState('Client Strategy Briefing');
  const [reserveParking, setReserveParking] = useState(true);
  const [licensePlate, setLicensePlate] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const host = employees.find((emp) => emp.id === hostId) || employees[0];

    const inviteCode = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockLink = `https://auravms.io/guest-invite/${inviteCode}`;

    onPreRegister({
      fullName,
      email,
      company,
      hostEmployeeId: host?.id || 'emp-101',
      hostName: host?.fullName || 'Dr. Sarah Jenkins',
      departmentName: host?.departmentName || 'Product Engineering',
      purpose,
      vehicleNumber: reserveParking ? licensePlate || 'BAY-A12' : undefined,
      vehicleType: reserveParking ? 'Car' : 'None',
      category: 'Guest',
      status: 'EXPECTED',
    });

    setGeneratedInviteLink(mockLink);
  };

  const handleCopyLink = () => {
    if (generatedInviteLink) {
      navigator.clipboard.writeText(generatedInviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setFullName('');
    setEmail('');
    setCompany('');
    setLicensePlate('');
    setGeneratedInviteLink(null);
    setCopied(false);
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Pre-Register Guest & Send Digital Invite</h3>
                <p className="text-xs text-slate-400">Pre-approve visitor arrival & generate fast-track check-in link</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form or Link Card */}
          <div className="p-6">
            {!generatedInviteLink ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amanda Hayes"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Guest Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="amanda@acmecorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Acme Global Inc"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Host Employee *</label>
                    <select
                      value={hostId}
                      onChange={(e) => setHostId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id} className="bg-slate-900">
                          {emp.fullName} ({emp.departmentName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Expected Visit Date *</label>
                    <input
                      type="date"
                      required
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Expected Time Slot</label>
                    <input
                      type="text"
                      placeholder="10:00 AM - 11:30 AM"
                      value={expectedTime}
                      onChange={(e) => setExpectedTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Purpose of Visit *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter visit purpose (e.g. Client Strategy Briefing, Vendor Consultation)..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Parking reservation option */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Car className="w-4 h-4 text-emerald-400" /> Reserve VIP Parking Bay
                    </span>
                    <input
                      type="checkbox"
                      checked={reserveParking}
                      onChange={(e) => setReserveParking(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                    />
                  </div>

                  {reserveParking && (
                    <input
                      type="text"
                      placeholder="Vehicle License Plate (Optional e.g. 7XYZ-89)"
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 hover:brightness-110"
                >
                  <Send className="w-4 h-4" /> Issue Pre-Registration Invite
                </button>
              </form>
            ) : (
              /* Generated Invite Card Result */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-white">Pre-Registration Confirmed!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    An email invite with fast-track QR pass has been issued to <strong className="text-white">{email}</strong>.
                  </p>
                </div>

                {/* Shareable Link Box */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Link2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-xs font-mono text-indigo-300 truncate">{generatedInviteLink}</span>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Invite Another Guest
                  </button>
                  <button
                    onClick={onClose}
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg"
                  >
                    Done
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
