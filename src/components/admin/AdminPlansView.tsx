import React, { useEffect, useState, useCallback } from 'react';
import { Layers, Plus, Save, RotateCw, AlertTriangle, X } from 'lucide-react';
import { ApiPlan, fetchAdminPlans, createAdminPlan, updateAdminPlan } from '../../lib/api';

interface AdminPlansViewProps {
  authToken: string;
}

const emptyForm = {
  name: '',
  tagline: '',
  minInvestmentUsd: 10000,
  maxInvestmentUsd: 100000,
  durationMonths: 12,
  managementFeePercent: 6.5,
  payoutFrequency: 'Monthly' as ApiPlan['payoutFrequency'],
  status: 'Draft' as ApiPlan['status']
};

export const AdminPlansView: React.FC<AdminPlansViewProps> = ({ authToken }) => {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { plans: list } = await fetchAdminPlans(authToken);
      setPlans(list);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load plans.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setError('Plan name is required.');
      return;
    }
    setIsSaving(true);
    try {
      await createAdminPlan(authToken, form);
      setForm(emptyForm);
      setShowCreate(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create plan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: ApiPlan['status']) => {
    try {
      await updateAdminPlan(authToken, id, { status });
      setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update plan.');
    }
  };

  const statusColor: Record<ApiPlan['status'], string> = {
    Active: 'bg-emerald-500/20 text-emerald-300',
    Draft: 'bg-gray-700 text-gray-300',
    Deactivated: 'bg-rose-500/20 text-rose-300'
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>INVESTMENT PLAN CATALOG</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investment Plans</h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLoading ? 'Loading...' : `${plans.length} plan${plans.length === 1 ? '' : 's'} defined, live from the database.`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm font-sans">{plan.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor[plan.status]}`}>{plan.status}</span>
            </div>
            <p className="text-gray-400">{plan.tagline || 'No tagline set.'}</p>
            <div className="grid grid-cols-2 gap-2 text-gray-300">
              <div>Min: <span className="text-white font-bold">${plan.minInvestmentUsd.toLocaleString()}</span></div>
              <div>Max: <span className="text-white font-bold">${plan.maxInvestmentUsd.toLocaleString()}</span></div>
              <div>Duration: <span className="text-white font-bold">{plan.durationMonths}mo</span></div>
              <div>Fee: <span className="text-white font-bold">{plan.managementFeePercent}%</span></div>
              <div>Payout: <span className="text-white font-bold">{plan.payoutFrequency}</span></div>
              <div>Investors: <span className="text-[#F7931A] font-bold">{plan.activeInvestorsCount}</span></div>
            </div>
            <select
              value={plan.status}
              onChange={(e) => handleStatusChange(plan.id, e.target.value as ApiPlan['status'])}
              className="w-full px-2 py-1.5 rounded-lg bg-gray-950 border border-gray-800 text-white text-[11px]"
            >
              <option>Draft</option>
              <option>Active</option>
              <option>Deactivated</option>
            </select>
          </div>
        ))}
        {!isLoading && plans.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 font-mono">No plans yet. Create one to get started.</div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base font-sans">New Investment Plan</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
            <input placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-gray-400 text-[10px] uppercase block mb-1">Min Investment (USD)</span>
                <input type="number" value={form.minInvestmentUsd} onChange={(e) => setForm({ ...form, minInvestmentUsd: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
              </label>
              <label className="block">
                <span className="text-gray-400 text-[10px] uppercase block mb-1">Max Investment (USD)</span>
                <input type="number" value={form.maxInvestmentUsd} onChange={(e) => setForm({ ...form, maxInvestmentUsd: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
              </label>
              <label className="block">
                <span className="text-gray-400 text-[10px] uppercase block mb-1">Duration (months)</span>
                <input type="number" value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
              </label>
              <label className="block">
                <span className="text-gray-400 text-[10px] uppercase block mb-1">Management Fee (%)</span>
                <input type="number" step="0.1" value={form.managementFeePercent} onChange={(e) => setForm({ ...form, managementFeePercent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
              </label>
            </div>
            <button
              onClick={handleCreate}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Create Plan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
