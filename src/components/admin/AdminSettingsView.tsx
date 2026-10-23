import { OperationalSettings } from './OperationalSettings';
import React, { useState, useEffect } from 'react';
import {
  Settings,
  Zap,
  DollarSign,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Server,
  Lock,
  Database,
  KeyRound,
  Ban
} from 'lucide-react';
import { AdminSystemSettings } from '../../types';
import { AuthUser, updateCredentialsRequest, fetchWithdrawalSettings, updateAdminWithdrawalSettings } from '../../lib/api';

interface AdminSettingsViewProps {
  settings: AdminSystemSettings;
  onSaveSettings?: (updated: AdminSystemSettings) => void;
  authToken: string;
  currentUsername: string;
  onCredentialsUpdated: (token: string, user: AuthUser) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings: initialSettings,
  onSaveSettings,
  authToken,
  currentUsername,
  onCredentialsUpdated
}) => {
  const [formData, setFormData] = useState<AdminSystemSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // --- Admin account credentials (real, backend-verified — unlike the
  // simulated "system parameters" form below) ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');
  const [isSavingCreds, setIsSavingCreds] = useState(false);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    const usernameChanged = newUsername.trim() !== currentUsername;
    const passwordChanged = newPassword.length > 0;

    if (!usernameChanged && !passwordChanged) {
      setCredError('Change the username or set a new password before saving.');
      return;
    }
    if (passwordChanged && newPassword !== confirmNewPassword) {
      setCredError('New password and confirmation do not match.');
      return;
    }

    setIsSavingCreds(true);
    try {
      const { token, user } = await updateCredentialsRequest(authToken, {
        currentPassword,
        newUsername: usernameChanged ? newUsername.trim() : undefined,
        newPassword: passwordChanged ? newPassword : undefined
      });
      onCredentialsUpdated(token, user);
      setCredSuccess('Admin credentials updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setCredSuccess(''), 4000);
    } catch (err) {
      setCredError(err instanceof Error ? err.message : 'Could not update credentials.');
    } finally {
      setIsSavingCreds(false);
    }
  };

  // --- Withdrawal Controls (real, backend-enforced global policy — just the
  // per-transaction cap and the platform-wide on/off switch. The "locked
  // until this date" rule is per-investor and is set from the Investor
  // Directory instead, since it applies to specific accounts, not everyone.) ---
  const [maxWithdrawalUsd, setMaxWithdrawalUsd] = useState(1000);
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState(true);
  const [withdrawalSettingsLoaded, setWithdrawalSettingsLoaded] = useState(false);
  const [isSavingWithdrawal, setIsSavingWithdrawal] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState('');

  useEffect(() => {
    fetchWithdrawalSettings(authToken)
      .then(({ settings }) => {
        setMaxWithdrawalUsd(settings.maxWithdrawalUsd);
        setWithdrawalsEnabled(settings.withdrawalsEnabled);
        setWithdrawalSettingsLoaded(true);
      })
      .catch(() => setWithdrawalSettingsLoaded(true));
  }, [authToken]);

  const handleSaveWithdrawalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawalError('');
    setWithdrawalSuccess('');

    if (!maxWithdrawalUsd || maxWithdrawalUsd <= 0) {
      setWithdrawalError('Max withdrawal per transaction must be a positive number.');
      return;
    }

    setIsSavingWithdrawal(true);
    try {
      const { settings } = await updateAdminWithdrawalSettings(authToken, {
        maxWithdrawalUsd,
        withdrawalsEnabled
      });
      setMaxWithdrawalUsd(settings.maxWithdrawalUsd);
      setWithdrawalsEnabled(settings.withdrawalsEnabled);
      setWithdrawalSuccess('Withdrawal controls updated — this applies platform-wide, immediately.');
      setTimeout(() => setWithdrawalSuccess(''), 4000);
    } catch (err) {
      setWithdrawalError(err instanceof Error ? err.message : 'Could not update withdrawal controls.');
    } finally {
      setIsSavingWithdrawal(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>GLOBAL OPERATIONAL CONSTANTS & SYSTEM PARAMETERS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Settings & Mining Parameters</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Manage withdrawal limits, saved operating parameters, and daily earnings job status.
          </p>
        </div>
      </div>

      {/* Admin Account Credentials — real, backend-verified */}
      <form onSubmit={handleUpdateCredentials} className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#F7931A]" />
          <span>Admin Account Credentials</span>
        </h3>
        <p className="text-[11px] text-gray-500 -mt-2">
          Change the username and/or password used to sign in to this Admin Console. Your current password is required to confirm the change.
        </p>

        {credError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{credError}</span>
          </div>
        )}
        {credSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-gray-400 text-[10px] uppercase mb-1">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A]"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] uppercase mb-1">Current Password (required)</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Confirm it's you"
              className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A]"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] uppercase mb-1">New Password (optional)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A]"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-[10px] uppercase mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full px-3 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSavingCreds || !currentPassword}
          className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {isSavingCreds ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" />
              <span>Update Credentials</span>
            </>
          )}
        </button>
      </form>

      {/* Withdrawal Controls — real, backend-enforced global policy */}
      <form onSubmit={handleSaveWithdrawalSettings} className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
          <Ban className="w-4 h-4 text-rose-400" />
          <span>Withdrawal Controls</span>
        </h3>
        <p className="text-[11px] text-gray-500 -mt-2">
          Applies globally to every investor. Changes take effect immediately on the next withdrawal request. To lock a
          specific investor's withdrawals until a chosen date, open their account in Investor Directory instead.
        </p>

        {withdrawalError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{withdrawalError}</span>
          </div>
        )}
        {withdrawalSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{withdrawalSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-gray-400 text-[10px] uppercase mb-1">Max Withdrawal Per Transaction (USD)</label>
            <input
              type="number"
              min="1"
              step="1"
              value={maxWithdrawalUsd}
              onChange={(e) => setMaxWithdrawalUsd(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-hidden focus:border-[#F7931A] focus:ring-1 focus:ring-[#F7931A]"
            />
          </div>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-950 border border-gray-800 cursor-pointer">
            <div>
              <div className="text-white font-bold">Withdrawals Enabled</div>
              <div className="text-[11px] text-gray-400">Turn off to block all investor withdrawal requests</div>
            </div>
            <input
              type="checkbox"
              checked={withdrawalsEnabled}
              onChange={(e) => setWithdrawalsEnabled(e.target.checked)}
              className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-[#F7931A]"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSavingWithdrawal || !withdrawalSettingsLoaded}
          className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {isSavingWithdrawal ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Withdrawal Controls</span>
            </>
          )}
        </button>
      </form>

      {/* Form sections */}
      <OperationalSettings authToken={authToken} />


    </div>
  );
};
