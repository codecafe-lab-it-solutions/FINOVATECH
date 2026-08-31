import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Edit2,
  CheckCircle2,
  DollarSign,
  Zap,
  Clock,
  Percent,
  Check,
  X,
  Users,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { InvestmentPlan } from '../../types';

interface AdminPlansViewProps {
  plans: InvestmentPlan[];
  onSavePlan?: (plan: InvestmentPlan) => void;
}

export const AdminPlansView: React.FC<AdminPlansViewProps> = ({
  plans: initialPlans,
  onSavePlan
}) => {
  const [plansList, setPlansList] = useState<InvestmentPlan[]>(initialPlans);
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<InvestmentPlan>>({
    name: '',
    tagline: '',
    minInvestmentUsd: 5000,
    maxInvestmentUsd: 50000,
    durationMonths: 12,
    miningAllocationThPer1k: 15.5,
    managementFeePercent: 6.5,
    electricityRatePerKwh: 0.042,
    payoutFrequency: 'Monthly',
    status: 'Active',
    projectedAnnualRoiMin: 24,
    projectedAnnualRoiMax: 32,
    features: ['Fixed $0.042/kWh immersion tariff', 'Automated monthly settlement', 'Audited hash rate reports']
  });

  const handleToggleStatus = (planId: string) => {
    setPlansList((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, status: p.status === 'Active' ? 'Deactivated' : 'Active' }
          : p
      )
    );
  };

  const handleOpenEdit = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setIsCreating(false);
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      id: `PLAN-${String.fromCharCode(65 + plansList.length)}`,
      name: '',
      tagline: '',
      minInvestmentUsd: 10000,
      maxInvestmentUsd: 100000,
      durationMonths: 24,
      miningAllocationThPer1k: 16.5,
      managementFeePercent: 6.0,
      electricityRatePerKwh: 0.042,
      payoutFrequency: 'Monthly',
      status: 'Active',
      activeInvestorsCount: 0,
      totalAumUsd: 0,
      projectedAnnualRoiMin: 25,
      projectedAnnualRoiMax: 34,
      features: ['Immersion cooling guaranteed', 'Automated BTC payouts', 'Cold wallet direct settlement']
    });
    setIsCreating(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (isCreating) {
      const newPlan: InvestmentPlan = {
        id: formData.id || `PLAN-${Date.now()}`,
        name: formData.name || 'New Mining Plan',
        tagline: formData.tagline || '',
        minInvestmentUsd: Number(formData.minInvestmentUsd) || 5000,
        maxInvestmentUsd: Number(formData.maxInvestmentUsd) || 50000,
        durationMonths: Number(formData.durationMonths) || 12,
        miningAllocationThPer1k: Number(formData.miningAllocationThPer1k) || 15.5,
        managementFeePercent: Number(formData.managementFeePercent) || 6.5,
        electricityRatePerKwh: Number(formData.electricityRatePerKwh) || 0.042,
        payoutFrequency: (formData.payoutFrequency as any) || 'Monthly',
        status: 'Active',
        activeInvestorsCount: 0,
        totalAumUsd: 0,
        projectedAnnualRoiMin: Number(formData.projectedAnnualRoiMin) || 24,
        projectedAnnualRoiMax: Number(formData.projectedAnnualRoiMax) || 32,
        features: formData.features || []
      };
      setPlansList([...plansList, newPlan]);
      if (onSavePlan) onSavePlan(newPlan);
    } else if (editingPlan) {
      const updated: InvestmentPlan = {
        ...editingPlan,
        ...formData
      } as InvestmentPlan;
      setPlansList(plansList.map((p) => (p.id === updated.id ? updated : p)));
      if (onSavePlan) onSavePlan(updated);
    }

    setIsCreating(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Create Plan */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Investment Plans & Mining Capacity</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure capital tiers, hashrate per $1k multiplier, electricity tariffs, and payout terms.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Investment Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansList.map((plan) => (
          <div
            key={plan.id}
            className={`p-6 rounded-3xl bg-[#0F172A] border transition-all flex flex-col justify-between relative ${
              plan.status === 'Active'
                ? 'border-gray-800 hover:border-gray-700 shadow-xl'
                : 'border-rose-900/40 opacity-70 bg-gray-950'
            }`}
          >
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 font-mono text-[10px] font-bold">
                  {plan.id}
                </span>
                <button
                  onClick={() => handleToggleStatus(plan.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                    plan.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                  }`}
                >
                  {plan.status === 'Active' ? '● ACTIVE' : '○ DEACTIVATED'}
                </button>
              </div>

              <h3 className="text-lg font-extrabold text-white tracking-tight">{plan.name}</h3>
              <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.tagline}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 my-5 p-3 rounded-2xl bg-gray-900/80 border border-gray-800 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Min Investment</div>
                  <div className="font-bold text-white mt-0.5">${plan.minInvestmentUsd.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Term Duration</div>
                  <div className="font-bold text-white mt-0.5">{plan.durationMonths} Months</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Hashrate Allocation</div>
                  <div className="font-bold text-[#F7931A] mt-0.5">{plan.miningAllocationThPer1k} TH / $1k</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase">Management Fee</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{plan.managementFeePercent}%</div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-6">
                <div className="text-[10px] font-mono uppercase text-gray-400 font-bold">Plan Inclusions:</div>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Plan Performance Footer */}
            <div className="pt-4 border-t border-gray-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Active Investors:</span>
                <span className="text-white font-bold">{plan.activeInvestorsCount} Accounts</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Total AUM:</span>
                <span className="text-emerald-400 font-bold">${plan.totalAumUsd.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-gray-700"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                  <span>Edit Plan</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Create / Edit Plan Modal */}
      {(isCreating || editingPlan) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
              <h3 className="text-lg font-bold text-white font-mono">
                {isCreating ? 'Create New Mining Plan' : `Edit Plan: ${editingPlan?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingPlan(null);
                }}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 uppercase font-mono text-[10px] mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sovereign Institutional Immersion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-400 uppercase font-mono text-[10px] mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Dedicated container for institutional funds"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Min Capital ($ USD)</label>
                  <input
                    type="number"
                    value={formData.minInvestmentUsd || ''}
                    onChange={(e) => setFormData({ ...formData, minInvestmentUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Term (Months)</label>
                  <input
                    type="number"
                    value={formData.durationMonths || ''}
                    onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Hashrate Allocation (TH / $1k)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.miningAllocationThPer1k || ''}
                    onChange={(e) => setFormData({ ...formData, miningAllocationThPer1k: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Management Fee (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.managementFeePercent || ''}
                    onChange={(e) => setFormData({ ...formData, managementFeePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPlan(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold font-mono cursor-pointer"
                >
                  {isCreating ? 'Create Plan' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
