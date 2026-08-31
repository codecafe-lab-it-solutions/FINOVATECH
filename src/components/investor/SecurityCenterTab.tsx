import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  KeyRound, 
  Laptop, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Plus, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { LoginSession, InvestorUser } from '../../types';

interface SecurityCenterTabProps {
  sessions: LoginSession[];
  user: InvestorUser;
  onRevokeSession: (sessionId: string) => void;
}

export const SecurityCenterTab: React.FC<SecurityCenterTabProps> = ({
  sessions,
  user,
  onRevokeSession
}) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);
  const [whitelistedAddress, setWhitelistedAddress] = useState(user.payoutBtcAddress);
  
  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (currentPassword !== '12345') {
      setPasswordError('Current password incorrect (Current demo password is "12345").');
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError('New password must be at least 5 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccess('Master security password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT ENCLAVE ISOLATION & 2FA ACTIVE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Investor Security & Access Governance
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Multi-signature authorization, address whitelisting, and real-time session telemetry
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Security Health: 100% Protected</span>
        </div>
      </div>

      {/* Withdrawal Security Pipeline Infographic */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 text-white space-y-3 font-mono">
        <div className="flex items-center gap-2 text-[#F7931A] text-xs font-bold uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Multi-Layered Capital Withdrawal Protection Protocol</span>
        </div>
        
        <p className="text-xs text-gray-300 font-sans leading-relaxed">
          To ensure strict institutional safety, all asset disbursements enforce the mandatory 6-stage verification sequence:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-[10px] pt-2">
          <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-[#F7931A] font-bold block mb-1">STEP 1</span>
            <span className="text-gray-300">Investor Login</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-[#F7931A] font-bold block mb-1">STEP 2</span>
            <span className="text-gray-300">2FA Authenticator</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-[#F7931A] font-bold block mb-1">STEP 3</span>
            <span className="text-gray-300">Withdrawal Request</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-[#F7931A] font-bold block mb-1">STEP 4</span>
            <span className="text-gray-300">Email/OTP Approval</span>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-[#F7931A] font-bold block mb-1">STEP 5</span>
            <span className="text-gray-300">Admin Risk Audit</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
            <span className="text-emerald-400 font-bold block mb-1">STEP 6</span>
            <span className="text-white font-bold">On-Chain TXID</span>
          </div>
        </div>
      </div>

      {/* Grid: 2FA & Whitelist on Left, Password & Sessions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        
        {/* Left: 2FA & Whitelisted Addresses (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* 2FA Card */}
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#F7931A]" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  Two-Factor Authentication (2FA)
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-400'
              }`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <p className="text-gray-400 font-sans text-xs">
              Hardware tokens and Authenticator OTP are required for logins, withdrawals, and bank detail alterations.
            </p>

            <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">Google Authenticator / SMS 2FA</div>
                <div className="text-[11px] text-gray-500">Primary phone: {user.phone}</div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  twoFactorEnabled
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          {/* Whitelisted Withdrawal Address */}
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Whitelisted Withdrawal Addresses
              </span>
            </div>

            <p className="text-gray-400 font-sans text-xs">
              Withdrawals can only be initiated to pre-approved addresses. Changes trigger a 24-hour mandatory safety hold.
            </p>

            <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#F7931A] font-bold">Primary Bitcoin Taproot Address:</span>
                <span className="text-emerald-400">Approved</span>
              </div>
              <div className="text-[11px] text-amber-200/90 break-all select-all">
                {whitelistedAddress}
              </div>
            </div>
          </div>

        </div>

        {/* Right: Password Change & Active Sessions (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Change Password Form */}
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <KeyRound className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Change Master Account Password
              </span>
            </div>

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-gray-400 mb-1">Current Password (Demo: 12345):</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-400 mb-1">New Password:</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Confirm New Password:</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-700 text-white focus:outline-hidden focus:border-[#F7931A]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white text-[11px] cursor-pointer"
                >
                  {showPassword ? 'Hide Characters' : 'Show Characters'}
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Active Sessions List */}
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#F7931A]" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  Active Login Sessions ({sessions.length})
                </span>
              </div>
              <span className="text-[11px] text-gray-400">IP & Geo Telemetry</span>
            </div>

            <div className="space-y-2.5">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{session.device}</span>
                      {session.isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {session.browser} • {session.ipAddress} • {session.location}
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => onRevokeSession(session.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      title="Revoke Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
