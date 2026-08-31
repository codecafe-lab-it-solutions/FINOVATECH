import React, { useState } from 'react';
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
  Database
} from 'lucide-react';
import { AdminSystemSettings } from '../../types';

interface AdminSettingsViewProps {
  settings: AdminSystemSettings;
  onSaveSettings?: (updated: AdminSystemSettings) => void;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings: initialSettings,
  onSaveSettings
}) => {
  const [formData, setFormData] = useState<AdminSystemSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      if (onSaveSettings) onSaveSettings(formData);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
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
            Configure levelized electricity cost inputs, pool stratum failover endpoints, multi-sig confirmation thresholds, and maintenance states.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Committing...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save System Parameters</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>System configuration parameters committed and synchronized across Muscat & Salalah telemetry nodes.</span>
        </div>
      )}

      {/* Form sections */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Mining & Power Tariffs */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F7931A]" />
            <span>1. Mining Infrastructure & Power Constants</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Power Tariff ($ USD / kWh)</label>
              <input
                type="number"
                step="0.001"
                value={formData.electricityTariffPerKwh}
                onChange={(e) => setFormData({ ...formData, electricityTariffPerKwh: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Oman Nama Grid Tariff PPA</span>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Default Management Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultManagementFeePercent}
                onChange={(e) => setFormData({ ...formData, defaultManagementFeePercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Standard Contract Fee</span>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Maintenance Reserve (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.maintenanceReservePercent}
                onChange={(e) => setFormData({ ...formData, maintenanceReservePercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">Spare Parts & Immersion Fluid</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Primary Stratum Pool</label>
              <input
                type="text"
                value={formData.defaultPool}
                onChange={(e) => setFormData({ ...formData, defaultPool: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Stratum Failover Pool</label>
              <input
                type="text"
                value={formData.failoverPool}
                onChange={(e) => setFormData({ ...formData, failoverPool: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Payout & Multi-Sig Vaults */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>2. Payout Thresholds & Treasury Multi-Sig Quorum</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Min Payout Threshold (BTC)</label>
              <input
                type="number"
                step="0.0001"
                value={formData.minPayoutBtc}
                onChange={(e) => setFormData({ ...formData, minPayoutBtc: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Disbursement Frequency</label>
              <select
                value={formData.payoutSchedule}
                onChange={(e) => setFormData({ ...formData, payoutSchedule: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              >
                <option value="Daily Batch (14:00 UTC)">Daily Batch (14:00 UTC)</option>
                <option value="Weekly (Mondays)">Weekly (Mondays)</option>
                <option value="Monthly 1st">Monthly 1st</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] uppercase mb-1">Multi-Sig Signatures Required</label>
              <input
                type="text"
                value={formData.multiSigThreshold}
                onChange={(e) => setFormData({ ...formData, multiSigThreshold: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Platform Flags */}
        <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>3. Platform Security & Operational Flags</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-950 border border-gray-800 cursor-pointer">
              <div>
                <div className="text-white font-bold">Maintenance Mode</div>
                <div className="text-[11px] text-gray-400">Temporarily restrict investor logins for upgrade</div>
              </div>
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-[#F7931A]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-950 border border-gray-800 cursor-pointer">
              <div>
                <div className="text-white font-bold">Automated Daily Earnings Run</div>
                <div className="text-[11px] text-gray-400">Trigger calculation engine automatically at 00:00 UTC</div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoCalculateDaily}
                onChange={(e) => setFormData({ ...formData, autoCalculateDaily: e.target.checked })}
                className="w-4 h-4 rounded bg-gray-900 border-gray-700 text-[#F7931A]"
              />
            </label>
          </div>
        </div>

      </form>

    </div>
  );
};
