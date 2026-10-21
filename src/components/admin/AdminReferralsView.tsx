import React, { useCallback, useEffect, useState } from 'react';
import { ApiAdminReferral, fetchAdminReferrals } from '../../lib/api';
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
    <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-wrap justify-between gap-4">
      <div><h2 className="text-2xl font-bold">Referral Overview</h2><p className="text-sm text-gray-400 mt-2">See who referred each investor and the direct referral commission credited to their wallet.</p><p className="text-xs text-gray-400 mt-2">Change plan rates in Investment Plans / Referral Settings. Historical commissions retain the rate applied at confirmation.</p></div>
      <button onClick={() => void load()} disabled={loading} className="px-4 py-2 rounded-xl bg-gray-800 disabled:opacity-50">{loading ? 'Loading...' : 'Refresh'}</button>
    </div>
    {error && <p role="alert" className="p-4 rounded-xl bg-rose-950 text-rose-300">{error}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800"><p className="text-gray-400 text-xs">Referred Investors</p><p className="text-2xl font-bold">{new Set(rows.map(r => r.referredUserId)).size}</p></div>
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800"><p className="text-gray-400 text-xs">Awaiting Confirmation</p><p className="text-2xl font-bold">{rows.filter(r => r.status === 'Awaiting confirmation').length}</p></div>
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-gray-800"><p className="text-gray-400 text-xs">Total Commission Credited</p><p className="text-2xl font-bold text-emerald-400"><Money usd={total} /></p></div>
    </div>
    <div className="flex flex-wrap gap-3">
      <input aria-label="Search referrals" placeholder="Search investor, referral ID or plan" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-48 p-3 rounded-xl bg-gray-950 border border-gray-700 text-sm" />
      <select aria-label="Referral status" value={status} onChange={e => setStatus(e.target.value)} className="p-3 rounded-xl bg-gray-950 border border-gray-700 text-sm"><option value="All">All statuses</option><option>Credited</option><option>Awaiting confirmation</option><option>No reward (0%)</option></select>
    </div>
    <div className="overflow-x-auto rounded-2xl bg-[#0F172A] border border-gray-800">
      <table className="w-full text-left text-xs"><thead className="text-gray-400"><tr>{['Referrer', 'Referred Investor', 'Referral ID Used', 'Plan', 'Confirmed Investment', 'Rate Applied', 'Wallet Credit', 'Status', 'Credited At (UTC)'].map(label => <th key={label} className="p-4 whitespace-nowrap">{label}</th>)}</tr></thead>
      <tbody>{filtered.map(r => <tr key={r.referredUserId + (r.creditedAt || '')} className="border-t border-gray-800">
        <td className="p-4"><p className="font-bold whitespace-nowrap">{r.referrerName || 'Sponsor unavailable'}</p><p className="text-gray-400">{r.referrerUsername || 'Code could not be resolved uniquely'}</p></td>
        <td className="p-4"><p className="font-bold whitespace-nowrap">{r.referredName}</p><p className="text-gray-400">{r.referredUsername}</p></td>
        <td className="p-4 font-mono">{r.referralCode}</td><td className="p-4 whitespace-nowrap">{r.planName || 'Not assigned'}</td>
        <td className="p-4 whitespace-nowrap">{r.investmentUsd === null ? '-' : <Money usd={r.investmentUsd} />}</td>
        <td className="p-4">{r.ratePercent === null ? '-' : `${r.ratePercent}%`}</td>
        <td className="p-4 whitespace-nowrap text-emerald-400">{r.commissionUsd === null ? '-' : <Money usd={r.commissionUsd} />}</td>
        <td className="p-4 whitespace-nowrap">{r.status}</td><td className="p-4 whitespace-nowrap">{r.creditedAt || '-'}</td>
      </tr>)}{!loading && filtered.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-gray-400">{rows.length ? 'No referrals match your filters.' : 'No referrals yet.'}</td></tr>}</tbody></table>
    </div>
  </div>;
}
