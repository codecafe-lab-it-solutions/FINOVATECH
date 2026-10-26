import { Money } from '../../lib/currency';
import {parseAdminAmount} from '../../lib/adminAmount';
import React, { useEffect, useState, useCallback } from 'react';
import { Layers, Plus, Save, RotateCw, AlertTriangle, X } from 'lucide-react';
import { ApiPlan, fetchAdminPlans, createAdminPlan, updateAdminPlan, deleteAdminPlan } from '../../lib/api';

interface AdminPlansViewProps {
  authToken: string;
}

const emptyForm = {
  directReferralPercent: 5,
  dailyReturnPercent: 0,
  payoutRequestDays: 7,
  minimumThresholdPercent: 0,
  withdrawalEntryFeePercent: 0,
  name: '',
  tagline: '',
  minInvestmentUsd: 10000,
  maxInvestmentUsd: 100000,
  durationMonths: 12,
  managementFeePercent: 6.5,
  payoutFrequency: 'Monthly' as ApiPlan['payoutFrequency'],
  status: 'Draft' as ApiPlan['status']
};
const numericPlanFields = ['directReferralPercent','dailyReturnPercent','payoutRequestDays','minimumThresholdPercent','withdrawalEntryFeePercent','minInvestmentUsd','maxInvestmentUsd','durationMonths','managementFeePercent'] as const;
type NumericPlanKey = typeof numericPlanFields[number];
type PlanForm = Omit<typeof emptyForm, NumericPlanKey> & Record<NumericPlanKey, number | string>;

export const AdminPlansView: React.FC<AdminPlansViewProps> = ({ authToken }) => {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [defaultFee,setDefaultFee] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<PlanForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { plans: list } = await fetchAdminPlans(authToken);
      setPlans(list);
      const settingsResponse = await fetch('/api/admin/platform-settings',{headers:{Authorization:'Bearer '+authToken}});
      if(settingsResponse.ok)setDefaultFee((await settingsResponse.json()).settings.defaultManagementFeePercent);
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
    const values = {...form} as typeof emptyForm;
    try { for (const key of numericPlanFields) values[key] = parseAdminAmount(form[key],key); }
    catch (err) { setError(err instanceof Error ? err.message : 'Enter valid plan amounts.'); return; }
    if ([values.dailyReturnPercent, values.minimumThresholdPercent, values.withdrawalEntryFeePercent, values.managementFeePercent].some(v => v > 100) || !Number.isInteger(values.payoutRequestDays) || values.payoutRequestDays < 1 || !Number.isInteger(values.durationMonths) || values.durationMonths < 1 || values.maxInvestmentUsd < values.minInvestmentUsd) {
      setError('Enter valid non-negative amounts, percentages from 0 to 100, whole days/months, and a maximum investment at least equal to the minimum.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingId) await updateAdminPlan(authToken, editingId, values);
      else await createAdminPlan(authToken, values);
      setEditingId(null);
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
    Draft: 'bg-ink-700 text-fg-body',
    Deactivated: 'bg-rose-500/20 text-rose-300'
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-ink-950 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[11px] font-mono text-gold-200 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>INVESTMENT PLAN CATALOG</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investment Plans</h2>
          <p className="text-xs text-fg-muted mt-1">
            {isLoading ? 'Loading...' : `${plans.length} plan${plans.length === 1 ? '' : 's'} defined, live from the database.`}
          </p>
        </div>
        <button
          onClick={() => { setError(''); setEditingId(null); setForm({...emptyForm,managementFeePercent:defaultFee}); setShowCreate(true); }}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs font-mono flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <section className="p-6 rounded-3xl bg-ink-950 border border-line space-y-4">
        <h3 className="text-lg font-bold text-white">Referral Settings</h3>
        <p className="text-xs text-fg-muted">Direct Referral: percentage of the referred investor's confirmed investment credited to the referrer's USD wallet. Changes apply to future confirmations. Set 0% to disable rewards for a plan.</p>
        {plans.map(plan => <ReferralRate key={plan.id} plan={plan} save={async rate => { await updateAdminPlan(authToken, plan.id, { directReferralPercent: rate }); await load(); }} />)}
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="p-5 rounded-2xl bg-ink-950 border border-line space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm font-sans">{plan.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor[plan.status]}`}>{plan.status}</span>
            </div>
            <p className="text-fg-muted">{plan.tagline || 'No tagline set.'}</p>
            <div className="grid grid-cols-2 gap-2 text-fg-body">
              <div>Min: <span className="text-white font-bold"><Money usd={plan.minInvestmentUsd} /></span></div>
              <div>Max: <span className="text-white font-bold"><Money usd={plan.maxInvestmentUsd} /></span></div>
              <div>Duration: <span className="text-white font-bold">{plan.durationMonths}mo</span></div>
              <div>Fee: <span className="text-white font-bold">{plan.managementFeePercent}%</span></div>
              <div>Payout: <span className="text-white font-bold">{plan.payoutFrequency}</span></div>
              <div>Investors: <span className="text-gold-500 font-bold">{plan.activeInvestorsCount}</span></div>
            </div>
            <div className="text-fg-body space-y-1">
              <div>Per Day Return: {plan.dailyReturnPercent}%</div>
              <div>Allow Payout Request: {plan.payoutRequestDays} days (minimum 7)</div>
              <div>Minimum Threshold: {plan.dailyReturnPercent * 30}% of principal (30-day payout obligation)</div>
              <div>Withdrawal / Entry Fee: {plan.withdrawalEntryFeePercent}% (stored only)</div>
            </div>
            <div className="flex gap-3">
              <button className="text-gold-200" onClick={() => { setEditingId(plan.id); setForm({ ...plan, directReferralPercent: plan.directReferralPercent ?? 5 }); setShowCreate(true); }}>Edit</button>
              <button className="text-rose-400 disabled:opacity-40" disabled={plan.activeInvestorsCount > 0} title={plan.activeInvestorsCount ? 'Cannot delete: investors are assigned to this plan.' : 'Delete plan'} onClick={async () => {
                if (!window.confirm('Delete ' + plan.name + '? This action cannot be undone.')) return;
                try { await deleteAdminPlan(authToken, plan.id); await load(); }
                catch (err) { setError(err instanceof Error ? err.message : 'Could not delete plan.'); }
              }}>Delete</button>
            </div>
            {plan.activeInvestorsCount > 0 && <p className="text-fg-muted">Deletion blocked: investors are assigned. Editing preserves their agreed terms.</p>}
            <select
              value={plan.status}
              onChange={(e) => handleStatusChange(plan.id, e.target.value as ApiPlan['status'])}
              className="w-full px-2 py-1.5 rounded-lg bg-ink-950 border border-line text-white text-[11px]"
            >
              <option>Draft</option>
              <option>Active</option>
              <option>Deactivated</option>
            </select>
          </div>
        ))}
        {!isLoading && plans.length === 0 && (
          <div className="col-span-full text-center py-8 text-fg-muted font-mono">No plans yet. Create one to get started.</div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-ink-900 border border-line-warm rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base font-sans">{editingId ? 'Edit Investment Plan' : 'New Investment Plan'}</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg bg-ink-800 text-fg-muted hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input placeholder="Plan name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
            <input placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
            {error && <p role="alert" className="text-rose-400">{error}</p>}
            <p className="text-fg-muted">Changes apply to future assignments. Existing investment terms are preserved.</p>
            <div className="grid grid-cols-2 gap-3">
              {([['dailyReturnPercent', 'Per Day Return Percentage'], ['payoutRequestDays', 'Allow Payout Request (days)'], ['withdrawalEntryFeePercent', 'Withdrawal / Entry Fee (%)']] as const).map(([key, label]) => <label key={key} className="block text-fg-muted">{label}<input type="number" min={key === 'payoutRequestDays' ? 1 : 0} max={key === 'payoutRequestDays' ? 3650 : 100} step={key === 'payoutRequestDays' ? 1 : '0.00001'} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" /></label>)}

              <label className="block">
                <span className="text-fg-muted text-[10px] uppercase block mb-1">Min Investment (USD)</span>
                <input type="number" value={form.minInvestmentUsd} onChange={(e) => setForm({ ...form, minInvestmentUsd: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
              </label>
              <label className="block">
                <span className="text-fg-muted text-[10px] uppercase block mb-1">Max Investment (USD)</span>
                <input type="number" value={form.maxInvestmentUsd} onChange={(e) => setForm({ ...form, maxInvestmentUsd: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
              </label>
              <label className="block">
                <span className="text-fg-muted text-[10px] uppercase block mb-1">Duration (months)</span>
                <input type="number" value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
              </label>
              <label className="block">
                <span className="text-fg-muted text-[10px] uppercase block mb-1">Management Fee (%)</span>
                <input type="number" step="0.1" value={form.managementFeePercent} onChange={(e) => setForm({ ...form, managementFeePercent: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
              </label>
            </div>
            <label className="block text-fg-muted">Payout Frequency<select value={form.payoutFrequency} onChange={e => setForm({ ...form, payoutFrequency: e.target.value as ApiPlan['payoutFrequency'] })} className="w-full p-2 bg-ink-950 text-white border border-line rounded-xl"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></label>
            <label className="block text-fg-muted">Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ApiPlan['status'] })} className="w-full p-2 bg-ink-950 text-white border border-line rounded-xl"><option>Draft</option><option>Active</option><option>Deactivated</option></select></label>
            <button
              onClick={handleCreate}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingId ? 'Save Changes' : 'Create Plan'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function ReferralRate({ plan, save }: { key?: string; plan: ApiPlan; save: (rate: number) => Promise<void> }) {
  const [rate, setRate] = useState(plan.directReferralPercent ?? 5);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => setRate(plan.directReferralPercent ?? 5), [plan.directReferralPercent]);
  return <form className="flex flex-wrap items-center gap-3 text-xs text-white" onSubmit={async e => { e.preventDefault(); if (!Number.isFinite(rate) || rate < 0 || rate > 100) { setMessage('Enter a rate from 0 to 100.'); return; } setBusy(true); setMessage(''); try { await save(rate); setMessage('Saved'); } catch (err) { setMessage(err instanceof Error ? err.message : 'Save failed'); } finally { setBusy(false); } }}>
    <label className="flex items-center gap-3">{plan.name} / Direct Referral (%) <input aria-label={plan.name + ' direct referral percentage'} type="number" min="0" max="100" step="0.0001" required value={rate} onChange={e => setRate(e.target.value === '' ? NaN : Number(e.target.value))} className="w-24 p-2 rounded bg-ink-950 border border-line-warm" /></label>
    <button disabled={busy} className="px-4 py-2 rounded bg-gold-500 text-black disabled:opacity-50">{busy ? 'Saving...' : 'Save'}</button><span role="status">{message}</span>
  </form>;
}
