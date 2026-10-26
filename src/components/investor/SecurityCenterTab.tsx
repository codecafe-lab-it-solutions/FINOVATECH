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
      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800 border border-line-warm text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ACCOUNT SECURITY</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Investor Security & Access Governance</h2>
          <p className="text-xs text-fg-muted font-mono mt-0.5">
            Change your password and manage real, active login sessions for this account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">

        {/* Left: 2FA & Whitelisted Address (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-bold uppercase tracking-wider">Login Security</span>
              </div>
            </div>
            <p className="text-fg-muted font-sans text-xs">
              Two-factor authentication isn't available yet. Your account is protected by a hashed password and
              real, revocable login sessions — manage those on the right.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <ShieldCheck className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-bold uppercase tracking-wider">Payout Wallet Address</span>
            </div>
            <p className="text-fg-muted font-sans text-xs">
              Withdrawals go to this address on file. Change it under Investor Profile.
            </p>
            <div className="p-3.5 rounded-2xl bg-ink-950 border border-line space-y-2">
              <div className="text-[11px] text-gold-100/90 break-all select-all">{user.payoutBtcAddress}</div>
            </div>
          </div>
        </div>

        {/* Right: Password Change & Active Sessions (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <KeyRound className="w-4 h-4 text-gold-500" />
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
                <label className="block text-fg-muted mb-1">Current Password:</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line-warm text-white focus:outline-hidden focus:border-gold-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-fg-muted mb-1">New Password:</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line-warm text-white focus:outline-hidden focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-fg-muted mb-1">Confirm New Password:</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line-warm text-white focus:outline-hidden focus:border-gold-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-fg-muted hover:text-white text-[11px] cursor-pointer flex items-center gap-1">
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          <div className="p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-gold-500" />
                <span className="text-sm font-bold uppercase tracking-wider">Active Login Sessions ({sessions.length})</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {sessions.map((session) => (
                <div key={session.id} className="p-3 rounded-xl bg-ink-950 border border-line flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold truncate max-w-[220px]">{session.device}</span>
                      {session.isCurrent && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold shrink-0">Current Session</span>
                      )}
                    </div>
                    <div className="text-[11px] text-fg-muted mt-0.5">{session.ipAddress} • {session.createdAt}</div>
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
              {sessions.length === 0 && <div className="text-fg-muted text-center py-4">No active sessions.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
