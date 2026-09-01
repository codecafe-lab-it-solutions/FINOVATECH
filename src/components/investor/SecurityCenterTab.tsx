import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  KeyRound,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { ApiSession, AuthUser, updateCredentialsRequest } from '../../lib/api';
import { InvestorUser } from '../../types';

interface SecurityCenterTabProps {
  sessions: ApiSession[];
  user: InvestorUser;
  authToken: string;
  onRevokeSession: (sessionId: string) => void;
  onCredentialsUpdated: (token: string, user: AuthUser) => void;
}

export const SecurityCenterTab: React.FC<SecurityCenterTabProps> = ({
  sessions,
  user,
  authToken,
  onRevokeSession,
  onCredentialsUpdated
}) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 5) {
      setPasswordError('New password must be at least 5 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSaving(true);
    try {
      const { token, user: updatedUser } = await updateCredentialsRequest(authToken, {
        currentPassword,
        newPassword
      });
      onCredentialsUpdated(token, updatedUser);
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Could not update password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACCOUNT SECURITY</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Investor Security & Access Governance</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Change your password and manage real, active login sessions for this account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">

        {/* Left: 2FA & Whitelisted Address (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#F7931A]" />
                <span className="text-sm font-bold uppercase tracking-wider">Two-Factor Authentication (2FA)</span>
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
                  twoFactorEnabled ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider">Payout Wallet Address</span>
            </div>
            <p className="text-gray-400 font-sans text-xs">
              Withdrawals go to this address on file. Change it under Investor Profile.
            </p>
            <div className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
              <div className="text-[11px] text-amber-200/90 break-all select-all">{user.payoutBtcAddress}</div>
            </div>
          </div>
        </div>

        {/* Right: Password Change & Active Sessions (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <KeyRound className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider">Change Account Password</span>
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
                <label className="block text-gray-400 mb-1">Current Password:</label>
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
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white text-[11px] cursor-pointer flex items-center gap-1">
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-4 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#F7931A]" />
                <span className="text-sm font-bold uppercase tracking-wider">Active Login Sessions ({sessions.length})</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {sessions.map((session) => (
                <div key={session.id} className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold truncate max-w-[220px]">{session.device}</span>
                      {session.isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">Current Session</span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{session.ipAddress} • {session.createdAt}</div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => onRevokeSession(session.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer shrink-0"
                      title="Revoke Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {sessions.length === 0 && <div className="text-gray-500 text-center py-4">No active sessions.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
