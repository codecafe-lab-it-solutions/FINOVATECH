import React, { useEffect, useState } from 'react';
import { Gift, Layers } from 'lucide-react';
import { Money } from '../../lib/currency';
import { ApiLevelIncomeSummary, ApiRewardProgress, fetchInvestorLevelIncome } from '../../lib/api';

// Direct referral commission tiers by the referred investor's investment (same rule the server applies).
export const DIRECT_REFERRAL_TIERS = [
  { label: 'Up to $10,000', rate: 4 },
  { label: '$10,001 to $15,000', rate: 5 },
  { label: '$15,001 to $20,000', rate: 7 },
  { label: 'Above $20,000', rate: 10 }
];

// Level income (ROI on ROI, levels 1-10) and reward progress for the logged-in investor.
export const LevelIncomePanel: React.FC<{ authToken: string }> = ({ authToken }) => {
  const [summary, setSummary] = useState<ApiLevelIncomeSummary | null>(null);
  const [rewards, setRewards] = useState<ApiRewardProgress[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetchInvestorLevelIncome(authToken)
      .then((data) => {
        if (!active) return;
        setSummary(data.summary);
        setRewards(data.rewards);
      })
      .catch((err) => active && setError(err instanceof Error ? err.message : 'Could not load level income.'));
    return () => {
      active = false;
    };
  }, [authToken]);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white space-y-3">
        <h3 className="font-bold">Direct Referral Commission Rates</h3>
        <p className="text-xs text-fg-muted">Paid once to your USD wallet when a person you referred has a confirmed investment. The rate depends on that investor's investment amount.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          {DIRECT_REFERRAL_TIERS.map((tier) => (
            <div key={tier.label} className="p-3 rounded-xl bg-ink-950 border border-line-warm">
              <div className="text-fg-muted">{tier.label}</div>
              <div className="text-gold-500 text-lg font-bold">{tier.rate}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white space-y-3" data-testid="level-income-panel">
        <div className="flex items-center gap-2 font-bold">
          <Layers className="w-4 h-4 text-gold-500" /> Level Income (ROI on ROI)
          {summary && <span className="ml-auto text-emerald-400 text-sm">Total earned: <Money usd={summary.totalEarnedUsd} /></span>}
        </div>
        <p className="text-xs text-fg-muted">
          You earn a share of the daily ROI of the investors in your team, up to 10 levels. Levels 3 to 5 need at least 2 direct referrals who each invested $500 or more; levels 6 to 10 need at least 4 such referrals.
        </p>
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        {summary && (
          <>
            <p className="text-xs font-mono text-fg-body">Your qualified direct referrals (${summary.qualifyingInvestmentUsd}+): <strong className="text-white">{summary.qualifiedReferrals}</strong></p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-fg-muted uppercase text-[10px]">
                    <th className="p-2">Level</th>
                    <th className="p-2">ROI share</th>
                    <th className="p-2">Needs</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-right">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.levels.map((l) => (
                    <tr key={l.level} className="border-t border-line">
                      <td className="p-2 text-white font-bold">Level {l.level}</td>
                      <td className="p-2">{l.percent}%</td>
                      <td className="p-2">{l.requiredReferrals === 0 ? 'No condition' : `${l.requiredReferrals} referrals of $${summary.qualifyingInvestmentUsd}+`}</td>
                      <td className="p-2">{l.percent === 0 ? 'Not active yet' : l.unlocked ? <span className="text-emerald-400">Unlocked</span> : <span className="text-amber-300">Locked</span>}</td>
                      <td className="p-2 text-right text-emerald-400"><Money usd={l.earnedUsd} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="p-6 rounded-3xl bg-ink-850 border border-line text-white space-y-3" data-testid="rewards-panel">
        <div className="flex items-center gap-2 font-bold">
          <Gift className="w-4 h-4 text-gold-500" /> Rewards
        </div>
        <p className="text-xs text-fg-muted">A reward unlocks when the total investment of your team in the stated levels reaches the target.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {rewards.map((r) => {
            const pct = Math.min(100, Math.round((r.businessUsd / r.targetUsd) * 100));
            return (
              <div key={r.key} className="p-4 rounded-2xl bg-ink-950 border border-line-warm space-y-2">
                <div className="flex justify-between gap-2">
                  <span className="text-white font-bold">{r.reward}</span>
                  <span className={r.status === 'Granted' ? 'text-emerald-400' : r.achieved ? 'text-gold-300' : 'text-fg-muted'}>
                    {r.status === 'Granted' ? 'Granted' : r.achieved ? 'Achieved - pending' : 'In progress'}
                  </span>
                </div>
                <div className="text-fg-muted">Level {r.fromLevel === r.toLevel ? r.fromLevel : `${r.fromLevel}-${r.toLevel}`} team business: <Money usd={r.businessUsd} /> / <Money usd={r.targetUsd} /></div>
                <div className="h-1.5 rounded-full bg-ink-800 overflow-hidden"><div className="h-full bg-gold-500" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
