import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  UploadCloud,
  CheckCircle2,
  Car,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Visitor, Employee, Department } from '../../types';
import { WebcamCapture } from '../common/WebcamCapture';
import { SignaturePad } from '../common/SignaturePad';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (visitorData: Partial<Visitor>) => void;
  employees: Employee[];
  departments: Department[];
}

export const VisitorRegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  employees,
  departments,
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState<Visitor['category']>('Client');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');

  const [purpose, setPurpose] = useState('Quarterly Business Review');
  const [hostEmployeeId, setHostEmployeeId] = useState(employees[0]?.id || 'emp-101');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-1');
  const [expectedDuration, setExpectedDuration] = useState('2 hours');

  const [idType, setIdType] = useState<Visitor['idType']>('National ID');
  const [idNumber, setIdNumber] = useState('NID-8821904');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('passport_scan_vance.pdf');
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>('1.4 MB');
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const [vehicleNumber, setVehicleNumber] = useState('CA 9XYZ44');
  const [vehicleType, setVehicleType] = useState<Visitor['vehicleType']>('EV');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedHost = employees.find((emp) => emp.id === hostEmployeeId) || employees[0];
    const selectedDept = departments.find((dept) => dept.id === departmentId) || departments[0];

    onRegister({
      fullName,
      phone,
      email,
      company,
      category,
      photoUrl,
      purpose,
      hostEmployeeId: selectedHost.id,
      hostName: selectedHost.fullName,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      expectedDuration,
      idType,
      idNumber,
      vehicleNumber,
      vehicleType,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8"
        >
          {/* Modal Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  New Visitor Check-In Registration
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    Step {step} of 4
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Enterprise Visitor Access & Security Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between">
            {['Personal Info', 'Visit Details', 'ID Verification & NDA', 'Vehicle & Assets'].map((label, idx) => {
              const currentIdx = idx + 1;
              const isActive = step === currentIdx;
              const isCompleted = step > currentIdx;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : currentIdx}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-semibold ${
                      isActive ? 'text-indigo-300' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 flex-1 space-y-6">
            {/* Step 1: Personal Information & Webcam Snap */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <WebcamCapture
                  currentPhoto={photoUrl}
                  onCapture={(photoData) => setPhotoUrl(photoData)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jonathan Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Company / Organization *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nexus Cloud Technologies"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="+1 (415) 892-1044"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="email"
                        placeholder="j.vance@nexuscloud.io"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Visitor Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['Client', 'Vendor', 'Interview', 'Delivery', 'Guest', 'Contractor', 'Other'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat as Visitor['category'])}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                          category === cat
                            ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Visit Information */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Visit Purpose *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter purpose of visit (e.g. Q3 Enterprise Architecture Briefing, Vendor Meeting)..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Host Employee *</label>
                    <select
                      value={hostEmployeeId}
                      onChange={(e) => setHostEmployeeId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.fullName} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Department *</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Expected Duration</label>
                  <select
                    value={expectedDuration}
                    onChange={(e) => setExpectedDuration(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="30 mins">30 Minutes</option>
                    <option value="1 hour">1 Hour</option>
                    <option value="2 hours">2 Hours</option>
                    <option value="4 hours">Half Day (4 Hours)</option>
                    <option value="Full Day">Full Day (8 Hours)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Identification & Digital NDA Signature Pad */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ID Type *</label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    >
                      <option value="Aadhaar Card">1. Aadhaar Card (Primary Government ID)</option>
                      <option value="National ID">2. National ID Card</option>
                      <option value="Driver's License">3. Driver's License</option>
                      <option value="Passport">4. Passport</option>
                      <option value="Employee Badge">5. External Corporate Badge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ID Number (Aadhaar / Passport) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1234-5678-9012 (12-Digit Aadhaar)"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Digital Signature Pad */}
                <SignaturePad onSaveSignature={(sig) => setSignatureData(sig)} />

                {/* Drag and Drop File Uploader */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Upload ID Proof Document</label>
                  <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 bg-slate-950/40 text-center flex flex-col items-center justify-center group transition-colors">
                    <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform mb-1" />
                    <p className="text-xs font-bold text-slate-200">Drag & Drop ID document file here</p>
                    <p className="text-[11px] text-slate-400 mt-1">Supports PDF, PNG, JPG, or WEBP (Max 10 MB)</p>
                  </div>

                  {uploadedFileName && (
                    <div className="mt-3 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-xs font-bold text-slate-200">{uploadedFileName}</p>
                          <p className="text-[10px] text-slate-400">{uploadedFileSize} • Security Verified</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFileName(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 4: Vehicle & Assets */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Vehicle Type</label>
                    <div className="relative">
                      <Car className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value as Visitor['vehicleType'])}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="None">None (Pedestrian)</option>
                        <option value="Car">Sedan / SUV Car</option>
                        <option value="EV">Electric Vehicle (EV Charging)</option>
                        <option value="Bike">Motorcycle / Bicycle</option>
                        <option value="Truck">Delivery Truck</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Vehicle License Plate</label>
                    <input
                      type="text"
                      placeholder="e.g. CA 9XYZ44"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-1">Instant RFID Badge & Host Slack Alert Triggered</p>
                    <p className="text-slate-400">
                      Completing this form will issue an RFID badge and dispatch an automated Slack notification to host staff.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Complete & Issue Pass
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
