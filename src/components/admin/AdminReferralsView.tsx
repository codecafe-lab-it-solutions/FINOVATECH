import React, { useCallback, useEffect, useState } from 'react';
import { ApiAdminReferral, ApiRewardGrant, fetchAdminReferrals, fetchLevelIncomeSettings, saveLevelIncomeSettings, fetchAdminRewards, updateAdminReward } from '../../lib/api';
import { Money } from '../../lib/currency';

export function AdminReferralsView({ authToken }: { authToken: string }) {
  const [rows, setRows] = useState<ApiAdminReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setRows((await fetchAdminReferrals(authToken)).referrals); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not load referrals.'); }
    finally { setLoading(false); }
  }, [authToken]);
  useEffect(() => { void load(); }, [load]);
  const filtered = rows.filter(r => (status === 'All' || r.status === status) &&
    [r.referrerName, r.referrerUsername, r.referredName, r.referredUsername, r.referralCode, r.planName].some(v => v?.toLowerCase().includes(search.trim().toLowerCase())));
  const total = rows.reduce((n, r) => n + (r.commissionUsd || 0), 0);
  return <div className="space-y-6 pb-12 text-white">
    <div className="p-6 rounded-3xl bg-ink-950 border border-line flex flex-wrap justify-between gap-4">
      <div><h2 className="text-2xl font-bold">Referral Overview</h2><p className="text-sm text-fg-muted mt-2">See who referred each investor and the direct referral commission credited to their wallet.</p><p className="text-xs text-fg-muted mt-2">Direct referral rate follows the referred investor's investment: up to $10,000 = 4%, up to $15,000 = 5%, up to $20,000 = 7%, above $20,000 = 10%. Historical commissions retain the rate applied at confirmation.</p></div>
      <button onClick={() => void load()} disabled={loading} className="px-4 py-2 rounded-xl bg-ink-800 disabled:opacity-50">{loading ? 'Loading...' : 'Refresh'}</button>
    </div>
    {error && <p role="alert" className="p-4 rounded-xl bg-rose-950 text-rose-300">{error}</p>}
    <LevelIncomeSettings authToken={authToken} />
    <RewardsList authToken={authToken} />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl bg-ink-950 border border-line"><p className="text-fg-muted text-xs">Referred Investors</p><p className="text-2xl font-bold">{new Set(rows.map(r => r.referredUserId)).size}</p></div>
      <div className="p-5 rounded-2xl bg-ink-950 border border-line"><p className="text-fg-muted text-xs">Awaiting Confirmation</p><p className="text-2xl font-bold">{rows.filter(r => r.status === 'Awaiting confirmation').length}</p></div>
      <div className="p-5 rounded-2xl bg-ink-950 border border-line"><p className="text-fg-muted text-xs">Total Commission Credited</p><p className="text-2xl font-bold text-emerald-400"><Money usd={total} /></p></div>
    </div>
    <div className="flex flex-wrap gap-3">
      <input aria-label="Search referrals" placeholder="Search investor, referral ID or plan" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-48 p-3 rounded-xl bg-ink-950 border border-line-warm text-sm" />
      <select aria-label="Referral status" value={status} onChange={e => setStatus(e.target.value)} className="p-3 rounded-xl bg-ink-950 border border-line-warm text-sm"><option value="All">All statuses</option><option>Credited</option><option>Awaiting confirmation</option><option>No reward (0%)</option></select>
    </div>
    <div className="overflow-x-auto rounded-2xl bg-ink-950 border border-line">
      <table className="w-full text-left text-xs"><thead className="text-fg-muted"><tr>{['Referrer', 'Referred Investor', 'Referral ID Used', 'Plan', 'Confirmed Investment', 'Rate Applied', 'Wallet Credit', 'Status', 'Credited At (UTC)'].map(label => <th key={label} className="p-4 whitespace-nowrap">{label}</th>)}</tr></thead>
      <tbody>{filtered.map(r => <tr key={r.referredUserId + (r.creditedAt || '')} className="border-t border-line">
        <td className="p-4"><p className="font-bold whitespace-nowrap">{r.referrerName || 'Sponsor unavailable'}</p><p className="text-fg-muted">{r.referrerUsername || 'Code could not be resolved uniquely'}</p></td>
        <td className="p-4"><p className="font-bold whitespace-nowrap">{r.referredName}</p><p className="text-fg-muted">{r.referredUsername}</p></td>
        <td className="p-4 font-mono">{r.referralCode}</td><td className="p-4 whitespace-nowrap">{r.planName || 'Not assigned'}</td>
        <td className="p-4 whitespace-nowrap">{r.investmentUsd === null ? '-' : <Money usd={r.investmentUsd} />}</td>
        <td className="p-4">{r.ratePercent === null ? '-' : `${r.ratePercent}%`}</td>
        <td className="p-4 whitespace-nowrap text-emerald-400">{r.commissionUsd === null ? '-' : <Money usd={r.commissionUsd} />}</td>
        <td className="p-4 whitespace-nowrap">{r.status}</td><td className="p-4 whitespace-nowrap">{r.creditedAt || '-'}</td>
      </tr>)}{!loading && filtered.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-fg-muted">{rows.length ? 'No referrals match your filters.' : 'No referrals yet.'}</td></tr>}</tbody></table>
    </div>
  </div>;
}

// Admin-editable ROI-on-ROI percentage for each upline level (1 to 10). 0% pays nothing for that level.
function LevelIncomeSettings({ authToken }: { authToken: string }) {
  const [values, setValues] = useState<string[]>(Array(10).fill('0'));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetchLevelIncomeSettings(authToken).then(({ levels }) => setValues(levels.map((l) => String(l.percent)))).catch((err) => setError(err instanceof Error ? err.message : 'Could not load level income settings.'));
  }, [authToken]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMessage(''); setError('');
    try {
      const { levels } = await saveLevelIncomeSettings(authToken, values.map((v) => Number(v)));
      setValues(levels.map((l) => String(l.percent)));
      setMessage('Level income percentages saved. They apply to ROI credited from now on.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save.'); }
    finally { setBusy(false); }
  };
  return <form onSubmit={save} className="p-6 rounded-3xl bg-ink-950 border border-line space-y-4" data-testid="level-income-settings">
    <div><h3 className="text-lg font-bold">Level Income (ROI on ROI)</h3>
      <p className="text-xs text-fg-muted mt-1">Percentage of each team member's daily ROI paid to their upline, per level. Levels 1-2 have no condition; levels 3-5 need 2 direct referrals of $500+; levels 6-10 need 4 direct referrals of $500+. Leave 0 to pay nothing for a level.</p></div>
    {error && <p role="alert" className="p-3 rounded-xl bg-rose-950 text-rose-300 text-xs">{error}</p>}
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {values.map((v, i) => <label key={i} className="text-xs text-fg-muted">Level {i + 1} (%)
        <input aria-label={'Level ' + (i + 1) + ' percentage'} type="number" min="0" max="100" step="0.0001" required value={v} onChange={(e) => setValues(values.map((x, j) => (j === i ? e.target.value : x)))} className="w-full mt-1 p-2 rounded-xl bg-ink-850 border border-line-warm text-white" /></label>)}
    </div>
    <div className="flex items-center gap-3"><button disabled={busy} className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs disabled:opacity-50">{busy ? 'Saving...' : 'Save Level Percentages'}</button><span role="status" className="text-xs text-emerald-400">{message}</span></div>
  </form>;
}

// Rewards reached by investors' team business. Admin marks each one Granted once delivered.
function RewardsList({ authToken }: { authToken: string }) {
  const [rewards, setRewards] = useState<ApiRewardGrant[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const load = useCallback(async () => {
    try { setRewards((await fetchAdminRewards(authToken)).rewards); setError(''); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not load rewards.'); }
  }, [authToken]);
  useEffect(() => { void load(); }, [load]);
  const mark = async (r: ApiRewardGrant, status: 'Granted' | 'Pending') => {
    setBusyId(r.id);
    try { await updateAdminReward(authToken, r.id, status); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update reward.'); }
    finally { setBusyId(''); }
  };
  return <div className="p-6 rounded-3xl bg-ink-950 border border-line space-y-3" data-testid="rewards-admin">
    <h3 className="text-lg font-bold">Rewards Achieved</h3>
    <p className="text-xs text-fg-muted">Thailand Trip ($10,000, level 1), iPhone ($25,000, levels 2-3), Dubai Trip + $2,500 ($50,000, levels 4-6), $10,000 Car Fund ($1 lakh, levels 7-8), $15,000 House Fund ($2.5 lakh, levels 9-10). Team business is the total investment of the downline in those levels.</p>
    {error && <p role="alert" className="p-3 rounded-xl bg-rose-950 text-rose-300 text-xs">{error}</p>}
    <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-fg-muted"><tr>{['Investor', 'Reward', 'Levels', 'Target', 'Achieved', 'Status', 'Action'].map((h) => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr></thead>
      <tbody>{rewards.map((r) => <tr key={r.id} className="border-t border-line">
        <td className="p-3"><p className="font-bold">{r.name}</p><p className="text-fg-muted">{r.username}</p></td>
        <td className="p-3 whitespace-nowrap">{r.reward}</td><td className="p-3">{r.fromLevel === r.toLevel ? r.fromLevel : r.fromLevel + '-' + r.toLevel}</td>
        <td className="p-3 whitespace-nowrap"><Money usd={r.targetUsd} /></td><td className="p-3 whitespace-nowrap">{String(r.achievedAt).slice(0, 10)}</td>
        <td className="p-3">{r.status}</td>
        <td className="p-3"><button disabled={busyId === r.id} onClick={() => void mark(r, r.status === 'Granted' ? 'Pending' : 'Granted')} className="px-3 py-1 rounded-lg bg-ink-800 hover:bg-gold-500 hover:text-black disabled:opacity-50">{r.status === 'Granted' ? 'Mark Pending' : 'Mark Granted'}</button></td>
      </tr>)}{rewards.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-fg-muted">No investor has reached a reward milestone yet.</td></tr>}</tbody></table></div>
  </div>;
}
