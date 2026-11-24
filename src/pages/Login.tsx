import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetUser = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === username.toLowerCase().trim() ||
        u.name.toLowerCase() === username.toLowerCase().trim()
    );

    if (!targetUser) {
      setErrorMessage('User account not found for this username.');
      return;
    }

    if (targetUser.password && targetUser.password !== password) {
      setErrorMessage('Invalid password! Access denied.');
      return;
    }

    onLogin(targetUser);
  };

  const handleSelectAccount = (usr: UserProfile) => {
    setUsername(usr.email);
    setPassword('');
    setErrorMessage('');
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white font-sans overflow-hidden">
      {/* Aerial View Photo in Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/ams-aerial-view.png"
          alt="AMS Facility Background"
          className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
        />
        {/* Soft Clear Backdrop Overlay */}
        <div className="absolute inset-0 bg-slate-950/25 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Transparent Light-Blue Frosted Glass Login Card */}
      <div className="w-full max-w-md bg-sky-950/20 backdrop-blur-md border border-sky-300/35 rounded-3xl p-8 shadow-2xl shadow-sky-950/60 space-y-6 text-white relative z-10 overflow-hidden ring-1 ring-sky-400/25">
        {/* Ambient Light Blue Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header: Visitor Management */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 text-xl font-bold font-mono tracking-tighter border border-sky-300/40">
            VM
          </div>
          <h1 className="text-2xl font-black text-white font-mono tracking-tight drop-shadow-md">
            Visitor <span className="text-sky-300 font-bold drop-shadow">Management</span>
          </h1>
          <p className="text-xs text-sky-100/90 font-sans font-medium drop-shadow-sm">
            Enterprise Visitor Entry & Access Control System
          </p>
        </div>

        {/* Account Selection Helper Cards (Transparent Light-Blue) */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-200 text-center drop-shadow-sm">
            Select Account to Login (Password Required):
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((usr) => (
              <button
                key={usr.id}
                type="button"
                onClick={() => handleSelectAccount(usr)}
                className={`p-2 rounded-xl text-left border transition-all backdrop-blur-sm ${
                  username === usr.email
                    ? 'bg-sky-500/40 border-sky-300 text-white shadow-lg shadow-sky-900/50 ring-1 ring-sky-200 font-bold'
                    : 'bg-sky-950/25 hover:bg-sky-900/35 border-sky-300/20 text-sky-100 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-bold truncate">{usr.role}</div>
                <div className="text-[9px] text-sky-200/80 truncate">{usr.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/70 p-3 rounded-2xl flex items-center gap-2.5 text-rose-100 text-xs font-mono backdrop-blur-md shadow-lg">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form (Light-Blue Transparent Inputs) */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono">
          <div>
            <label className="block text-xs font-semibold text-sky-100 mb-1 drop-shadow-sm">Username / Account:</label>
            <div className="relative">
              <User className="w-4 h-4 text-sky-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter username (e.g. admin, SA, security)..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-sky-950/20 border border-sky-300/30 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-sky-300 focus:bg-sky-950/40 focus:ring-2 focus:ring-sky-400/30 font-bold backdrop-blur-sm placeholder:text-sky-200/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-100 mb-1 drop-shadow-sm">Password *:</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-sky-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter account password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-sky-950/20 border border-sky-300/30 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-sky-300 focus:bg-sky-950/40 focus:ring-2 focus:ring-sky-400/30 font-bold backdrop-blur-sm placeholder:text-sky-200/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 hover:from-sky-400 hover:via-blue-500 hover:to-sky-400 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-sky-600/40 hover:shadow-sky-500/50 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] border border-sky-300/40"
          >
            <Lock className="w-4 h-4" />
            <span>Authenticate & Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-sky-200/80 text-center font-mono pt-1 drop-shadow-sm">
          Visitor Management System • Protected Portal
        </p>
      </div>
    </div>
  );
};
