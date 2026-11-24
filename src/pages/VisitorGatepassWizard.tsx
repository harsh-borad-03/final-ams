import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building2, 
  FileText, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  X,
  Sparkles,
  Camera,
  ShieldAlert,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { Visitor } from '../types';
import { WebcamCapture } from '../components/common/WebcamCapture';
import { AMSVisitorGatePass } from '../components/pass/AMSVisitorGatePass';

interface VisitorGatepassWizardProps {
  onAddVisitor: (visitorData: Partial<Visitor>) => void;
  onNavigate: (tab: string) => void;
}

export const DEPARTMENTS_LIST = [
  { id: 'Purchase', label: '1. Purchase', subtitle: 'Procurement & Purchasing' },
  { id: 'Quality', label: '2. Quality', subtitle: 'Quality Assurance & Control' },
  { id: 'Production', label: '3. Production', subtitle: 'Manufacturing & Operations' },
  { id: 'Facility', label: '4. Facility', subtitle: 'Facility Management & Maintenance' },
  { id: 'IT', label: '5. IT', subtitle: 'Information Technology' },
  { id: 'IC', label: '6. IC', subtitle: 'Internal Control & Compliance' },
  { id: 'Accounts', label: '7. Accounts', subtitle: 'Accounts & Finance' },
  { id: 'Logistics', label: '8. Logistics', subtitle: 'Supply Chain & Logistics' },
  { id: 'Warehouse', label: '9. Warehouse', subtitle: 'Stores & Warehouse Inventory' },
  { id: 'R&D', label: '10. R&D', subtitle: 'Research & Development' },
  { id: 'Marketing', label: '11. Marketing', subtitle: 'Marketing & Business Development' },
  { id: 'Clinical', label: '12. Clinical', subtitle: 'Clinical Affairs & Medical' },
  { id: 'Engineering', label: '13. Engineering', subtitle: 'Engineering & Maintenance' },
  { id: 'Needle', label: '14. Needle', subtitle: 'Needle Division (Manufacturing)' },
  { id: 'Other', label: '15. Other', subtitle: 'Other / Custom Department' },
];

export const VisitorGatepassWizard: React.FC<VisitorGatepassWizardProps> = ({
  onAddVisitor,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showGatepassModal, setShowGatepassModal] = useState<boolean>(false);
  const [generatedVisitor, setGeneratedVisitor] = useState<Visitor | null>(null);

  // Validation errors
  const [phoneError, setPhoneError] = useState<string>('');
  const [fullNameError, setFullNameError] = useState<string>('');
  const [hostNameError, setHostNameError] = useState<string>('');
  const [purposeError, setPurposeError] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Dropdown state for Department
  const [isDeptOpen, setIsDeptOpen] = useState<boolean>(false);

  // Step 1: Personal & Photo
  const [visitorType, setVisitorType] = useState<string>('Guest');
  const [phone, setPhone] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');

  // Step 2: Who To Meet (Host Information, Department & Purpose of Meeting)
  const [department, setDepartment] = useState<string>('Purchase');
  const [customDepartment, setCustomDepartment] = useState<string>('');
  const [hostName, setHostName] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('Official Meeting');

  // Step 3: Belongings / What They Bring
  const [selectedAssetTypes, setSelectedAssetTypes] = useState<string[]>([]);
  const [customAssetInput, setCustomAssetInput] = useState<string>('');

  const toggleAssetType = (asset: string) => {
    if (selectedAssetTypes.includes(asset)) {
      setSelectedAssetTypes(selectedAssetTypes.filter((a) => a !== asset));
    } else {
      setSelectedAssetTypes([...selectedAssetTypes, asset]);
    }
  };

  // Combine selected assets into single string
  const getCombinedAssetsString = () => {
    const list = [...selectedAssetTypes];
    if (customAssetInput.trim()) {
      list.push(customAssetInput.trim());
    }
    return list.length > 0 ? list.join(', ') : 'None';
  };

  // System clock & date helpers
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

  // Step 4: Visit Schedule - Synced directly with current system date & time
  const [validFrom, setValidFrom] = useState<string>(getSystemLocalDate);
  const [validTill, setValidTill] = useState<string>(getSystemLocalDate);
  const [inTime, setInTime] = useState<string>(getSystemLocalTime);
  const [outTime, setOutTime] = useState<string>('--');

  // Auto-sync schedule with live system clock on load
  useEffect(() => {
    setValidFrom(getSystemLocalDate());
    setValidTill(getSystemLocalDate());
    setInTime(getSystemLocalTime());
  }, []);

  const handleSyncLiveClock = () => {
    setValidFrom(getSystemLocalDate());
    setValidTill(getSystemLocalDate());
    setInTime(getSystemLocalTime());
  };

  const nextDisplaySeq = (parseInt(localStorage.getItem('ams_gatepass_seq') || '0', 10) + 1).toString().padStart(5, '0');
  const passCode = `VP-2026-${nextDisplaySeq}`;

  // Validation checks
  const validateCurrentStep = (step: number): boolean => {
    setErrorMessage('');
    if (step === 1) {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setPhoneError('Please enter a valid 10-digit mobile number.');
        setErrorMessage('⚠️ Phone number must be exactly 10 digits before proceeding to the next step.');
        return false;
      }
      setPhoneError('');

      if (!fullName.trim()) {
        setFullNameError('Please enter visitor full name.');
        setErrorMessage('⚠️ Please enter visitor\'s full name before proceeding.');
        return false;
      }
      setFullNameError('');
      return true;
    }

    if (step === 2) {
      if (department === 'Other' && !customDepartment.trim()) {
        setErrorMessage('⚠️ Please enter the custom department name for "Other".');
        return false;
      }

      if (!hostName.trim()) {
        setHostNameError('Please enter person / employee to meet.');
        setErrorMessage('⚠️ Please enter "To Meet" before proceeding.');
        return false;
      }
      setHostNameError('');

      if (!purpose.trim()) {
        setPurposeError('Please enter the purpose of meeting.');
        setErrorMessage('⚠️ Please enter Purpose of Meeting before proceeding.');
        return false;
      }
      setPurposeError('');
      return true;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep > currentStep) {
      if (!validateCurrentStep(currentStep)) {
        return;
      }
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        setPhoneError('Please enter a valid 10-digit mobile number.');
        setErrorMessage('⚠️ Phone number must be exactly 10 digits before proceeding to the next step.');
        setCurrentStep(1);
        return;
      }
      if (targetStep > 2) {
        if (department === 'Other' && !customDepartment.trim()) {
          setErrorMessage('⚠️ Please enter the custom department name for "Other".');
          setCurrentStep(2);
          return;
        }
        if (!hostName.trim()) {
          setHostNameError('Please enter person / employee to meet.');
          setErrorMessage('⚠️ Please enter "To Meet" before proceeding.');
          setCurrentStep(2);
          return;
        }
        if (!purpose.trim()) {
          setPurposeError('Please enter the purpose of meeting.');
          setErrorMessage('⚠️ Please enter Purpose of Meeting before proceeding.');
          setCurrentStep(2);
          return;
        }
      }
    }
    setCurrentStep(targetStep);
  };

  const handleGenerateGatepass = () => {
    if (!validateCurrentStep(1) || !validateCurrentStep(2)) {
      return;
    }

    const currentSeqNum = parseInt(localStorage.getItem('ams_gatepass_seq') || '0', 10) + 1;
    localStorage.setItem('ams_gatepass_seq', currentSeqNum.toString());
    const seqStr = currentSeqNum.toString().padStart(5, '0');

    const finalDepartment = department === 'Other' 
      ? (customDepartment.trim() || 'Other') 
      : (department || 'Purchase');

    const newVis: Visitor = {
      id: `VIS-${seqStr}`,
      passCode: `VP-2026-${seqStr}`,
      fullName: fullName.trim() || 'Visitor Name',
      visitorType: visitorType.trim() || 'Guest',
      category: visitorType.trim() || 'Guest',
      phone: phone.trim() || 'N/A',
      email: email || '',
      purpose: purpose.trim() || 'Official Meeting',
      address: address || '',
      idProofType: 'None' as any,
      company: company.trim() || address.trim() || 'ADVANCED MEDTECH SOLUTIONS',
      hostName: hostName.trim() || 'Employee Name',
      hostId: 'EMP-101',
      department: finalDepartment,
      inTime: inTime || getSystemLocalTime(),
      outTime: outTime && outTime !== '--' ? outTime : '',
      validFrom: validFrom || getSystemLocalDate(),
      validTill: 'Until Check-Out',
      duration: 'Active Inside',
      status: 'In Premise',
      employeeStatus: 'Approved',
      finalStatus: 'Approved',
      photoUrl,
      assets: getCombinedAssetsString() || 'None'
    };

    onAddVisitor(newVis);
    setGeneratedVisitor(newVis);
    setShowGatepassModal(true);
  };

  const steps = [
    { num: 1, label: 'Personal & Photo', icon: User },
    { num: 2, label: 'To Meet', icon: Building2 },
    { num: 3, label: 'What They Bring', icon: FileText },
    { num: 4, label: 'Visit Schedule', icon: Clock }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-8 max-w-6xl mx-auto space-y-6 font-sans"
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">Visitor Gatepass Wizard</h1>
        <p className="text-xs text-slate-500 mt-0.5">Register a new visitor with live photo capture and instant gatepass generation.</p>
      </div>

      {/* Step Wizard Bar */}
      <div className="flex items-center justify-between bg-white p-2 rounded-3xl border border-slate-200/80 shadow-sm">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => handleStepClick(s.num)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-600/30 font-extrabold'
                  : isDone
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{s.num}. {s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Step Inputs */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          {/* Validation Error Notification Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold text-rose-700 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-rose-400 hover:text-rose-600 text-xs font-extrabold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </motion.div>
          )}
          {/* STEP 1: Personal Information & Click Photo */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                Step 1: Personal Information & Click Live Visitor Photo
              </h2>

              {/* Click Photo (Live Web Camera Capture) */}
              <div className="p-4 bg-purple-50/60 border-2 border-purple-200 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 text-purple-900">
                    <Camera className="w-4 h-4 text-purple-600" />
                    Click Visitor Photo (Live Camera Snap) *
                  </span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded font-extrabold">SECURITY CAMERA</span>
                </label>

                <WebcamCapture
                  currentPhoto={photoUrl}
                  onCapture={(photoData) => setPhotoUrl(photoData)}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-purple-200 font-mono">
                  <span>Or upload visitor photo file:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) setPhotoUrl(ev.target.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Visitor Type (Typed Text Box with Quick Suggestion Tags) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Visitor Type <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter or select visitor type (e.g. Guest, Vendor, Client, Contractor)..."
                  value={visitorType}
                  onChange={(e) => setVisitorType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-600 focus:bg-white font-semibold transition-all"
                />
                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    'Guest',
                    'Vendor / Supplier',
                    'Client / Customer',
                    'Contractor',
                    'Interview Candidate',
                    'VIP / Official'
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVisitorType(type)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        visitorType === type
                          ? 'bg-purple-100 text-purple-700 border border-purple-300 font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                      }`}
                    >
                      + {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 font-sans">
                    Phone number <span className="text-rose-500 font-bold">* (10 Digits)</span>
                  </label>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                    phone.length === 10 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                      : phone.length > 0 
                      ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                      : 'text-slate-400 bg-slate-100'
                  }`}>
                    {phone.length}/10 digits
                  </span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number (e.g. 9876543210)..."
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    if (val.length === 10) {
                      setPhoneError('');
                      setErrorMessage('');
                    }
                  }}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 font-mono font-bold transition-all focus:outline-none ${
                    phoneError
                      ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:border-rose-600 shadow-sm shadow-rose-200'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-purple-600 focus:bg-white'
                  }`}
                />
                {phoneError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1.5 bg-rose-50 p-2 rounded-xl border border-rose-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{phoneError}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full name *</label>
                <input
                  type="text"
                  placeholder="Enter visitor's full name..."
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.trim()) {
                      setFullNameError('');
                      setErrorMessage('');
                    }
                  }}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 focus:outline-none transition-all capitalize font-semibold ${
                    fullNameError
                      ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:border-rose-600'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-purple-600 focus:bg-white'
                  }`}
                />
                {fullNameError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1.5 bg-rose-50 p-2 rounded-xl border border-rose-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{fullNameError}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                <input
                  type="email"
                  placeholder="Enter visitor's email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="Enter company name..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* STEP 2: To Meet */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Step 2: To Meet
              </h2>

              {/* Department Dropdown with Arrow */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Department (Which department you want to go) <span className="text-rose-500 font-bold">*</span>
                </label>
                
                {/* Clickable field with arrow */}
                <button
                  type="button"
                  onClick={() => setIsDeptOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                    isDeptOpen
                      ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-500/20 text-purple-900'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 font-mono text-xs font-extrabold border border-purple-200">
                      {DEPARTMENTS_LIST.find((d) => d.id === department)?.label || department}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {department === 'Other' && customDepartment.trim()
                        ? customDepartment.trim()
                        : (DEPARTMENTS_LIST.find((d) => d.id === department)?.subtitle || 'Department')}
                    </span>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className="p-1 rounded-lg bg-slate-100 group-hover:bg-slate-200">
                    <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform duration-200 ${isDeptOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Dropdown Options List */}
                {isDeptOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute z-30 left-0 right-0 mt-1.5 bg-white border-2 border-purple-200 rounded-2xl shadow-xl overflow-hidden p-1.5 space-y-1 max-h-64 overflow-y-auto"
                  >
                    {DEPARTMENTS_LIST.map((dept) => {
                      const isSelected = department === dept.id;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => {
                            setDepartment(dept.id);
                            setIsDeptOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-sm font-extrabold'
                              : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-extrabold">{dept.label}</span>
                            <span className={`text-[11px] font-medium ${isSelected ? 'text-purple-100' : 'text-slate-500'}`}>
                              ({dept.subtitle})
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* If "Other" is chosen, show custom department text input */}
              {department === 'Other' && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 space-y-1.5"
                >
                  <label className="block text-xs font-bold text-purple-900">
                    Specify Custom Department Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom department (e.g. Sterilization, Packaging, etc.)..."
                    value={customDepartment}
                    onChange={(e) => {
                      setCustomDepartment(e.target.value);
                      if (e.target.value.trim()) setErrorMessage('');
                    }}
                    className="w-full text-xs rounded-xl px-3.5 py-2.5 bg-white border border-purple-300 text-slate-800 font-semibold focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm placeholder:text-slate-400"
                  />
                  <p className="text-[11px] text-purple-600 font-medium">
                    This custom department will be printed directly onto the Visitor Gate Pass.
                  </p>
                </motion.div>
              )}

              {/* To Meet Typed Text Box (like Address box) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  To Meet <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter employee / person name to meet..."
                  value={hostName}
                  onChange={(e) => {
                    setHostName(e.target.value);
                    if (e.target.value.trim()) {
                      setHostNameError('');
                      setErrorMessage('');
                    }
                  }}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 focus:outline-none transition-all font-semibold ${
                    hostNameError
                      ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:border-rose-600 shadow-sm shadow-rose-200'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-purple-600 focus:bg-white'
                  }`}
                />
                {hostNameError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1.5 bg-rose-50 p-2 rounded-xl border border-rose-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{hostNameError}</span>
                  </motion.p>
                )}
              </div>

              {/* Purpose of Meeting Typed Text Box (Synced with Gate Pass Purpose) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purpose of Meeting <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter purpose of meeting (e.g. Official Meeting, Vendor Discussion, Audit, Interview)..."
                  value={purpose}
                  onChange={(e) => {
                    setPurpose(e.target.value);
                    if (e.target.value.trim()) {
                      setPurposeError('');
                      setErrorMessage('');
                    }
                  }}
                  className={`w-full text-xs rounded-xl px-3.5 py-2.5 focus:outline-none transition-all font-semibold ${
                    purposeError
                      ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:border-rose-600 shadow-sm shadow-rose-200'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 focus:border-purple-600 focus:bg-white'
                  }`}
                />
                {purposeError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1.5 bg-rose-50 p-2 rounded-xl border border-rose-200"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{purposeError}</span>
                  </motion.p>
                )}
                {/* Quick Selection Tags */}
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {['Official Meeting', 'Vendor Discussion', 'Audit / Inspection', 'Interview', 'Technical Support', 'Client Visit'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setPurpose(tag);
                        setPurposeError('');
                        setErrorMessage('');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        purpose === tag
                          ? 'bg-purple-100 text-purple-700 border border-purple-300 font-bold'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-transparent'
                      }`}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Belongings & What They Bring */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Step 3: Belongings & Assets Selection (What They Bring)
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Belongings Brought * (Select option or write custom items):
                </label>

                {/* Belongings Option Pills */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Laptop', label: '1. Laptop' },
                    { id: 'Pendrive', label: '2. Pendrive' },
                    { id: 'Storage Device', label: '3. Storage Device' },
                    { id: 'Other', label: '4. Other / Custom' }
                  ].map((opt) => {
                    const isSelected = selectedAssetTypes.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleAssetType(opt.id)}
                        className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/30'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Write-In Input Box if "Other" is selected or for serial numbers */}
              {selectedAssetTypes.includes('Other') && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specify Custom Belongings / Serial Numbers:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write what visitor has brought (e.g. Camera, External Hard Drive, Tool Kit)..."
                    value={customAssetInput}
                    onChange={(e) => setCustomAssetInput(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-purple-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-purple-600 font-semibold"
                  />
                </motion.div>
              )}

              {/* Summary Preview */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">LOGGED BELONGINGS SUMMARY:</span>
                <strong className="text-purple-600 font-bold">{getCombinedAssetsString()}</strong>
              </div>
            </div>
          )}

          {/* STEP 4: Visit Schedule */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Step 4: Visit Schedule & Premise Entry
                </h2>
                <button
                  type="button"
                  onClick={handleSyncLiveClock}
                  className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Click to fetch current system date & time"
                >
                  <RefreshCw className="w-3 h-3" /> Sync Live Clock
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                    Visit Date (System Date)
                  </label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                    Entry In Time (System Time)
                  </label>
                  <input
                    type="text"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3.5 py-2.5 font-bold"
                  />
                </div>
              </div>

              {/* Company Presence Banner */}
              <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ACTIVE COMPANY PRESENCE • NO AUTO-EXPIRY</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Gate pass will remain active with status <strong>"In Premise" (Inside Our Company)</strong>. It will not expire automatically. Security will perform an explicit <strong>Check-Out</strong> when the visitor departs.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors font-mono"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all font-mono"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateGatepass}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-xl shadow-purple-600/40 transition-all hover:scale-[1.02] font-mono"
              >
                <Sparkles className="w-4 h-4" />
                Generate Gatepass
              </button>
            )}
          </div>
        </div>

        {/* Right Col: Exact AMS Visitor Gate Pass Preview */}
        <div className="space-y-3">
          <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            AMS GATE PASS PREVIEW
          </p>

          <AMSVisitorGatePass
            visitor={{
              fullName: fullName || 'MR ANKIT KUMAR',
              company: company || address || 'ADVANCED MEDTECH SOLUTIONS',
              phone: phone || '9996995117',
              visitorType: visitorType || 'Guest',
              category: visitorType || 'Guest',
              purpose: purpose.trim() || 'OFFICIAL MEETING',
              hostName: hostName || 'MR RAHUL SINGH',
              assets: getCombinedAssetsString() || 'NONE',
              outTime: outTime && outTime !== '--' ? outTime : '',
              passCode: passCode || 'VP-2026-00001',
              address: address || company || 'SIPCON / AMBALA',
              department: department || 'IT',
              photoUrl,
              validFrom,
              validTill,
              inTime
            }}
          />
        </div>
      </div>

      {/* Generated Gatepass Printable Badge Modal */}
      {showGatepassModal && generatedVisitor && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 w-full max-w-3xl max-h-[94vh] rounded-3xl shadow-2xl p-6 flex flex-col font-sans my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-800 font-mono tracking-tight uppercase">
                  AMS Visitor Gate Pass — Generated & Ready to Print
                </h3>
              </div>
              <button 
                onClick={() => setShowGatepassModal(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Gate Pass Body Area */}
            <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4 print-container">
              <AMSVisitorGatePass visitor={generatedVisitor} />
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-slate-200 shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowGatepassModal(false);
                  onNavigate('all-visitors');
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold font-mono text-xs transition-all"
              >
                Close & View Visitors
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowGatepassModal(false);
                  onNavigate('all-visitors');
                }}
                className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01]"
              >
                <Printer className="w-4 h-4" />
                Print Visitor Gatepass
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
