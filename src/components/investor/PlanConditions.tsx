import React from 'react';
import { InvestorUser } from '../../types';
import { Money } from '../../lib/currency';

export function PlanConditions({ user, investmentUsd, walletUsd }: { user: InvestorUser; investmentUsd: number; walletUsd?: number }) {
  const terms = user.planTerms;
  return <section className="p-5 rounded-2xl bg-gray-900 border border-gray-800 text-gray-300 text-xs space-y-3">
    <h3 className="font-bold text-white">Assigned Investment Plan & Conditions</h3>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div><dt>Plan</dt><dd className="text-white">{terms?.name || user.plan}</dd></div>
      <div><dt>Investment Amount</dt><dd><Money usd={investmentUsd} /></dd></div>
      <div><dt>KYC Approval Date</dt><dd>{user.joiningDate || 'Awaiting confirmed KYC approval date'}</dd></div>
      <div><dt>Joining Date / Start Date</dt><dd>{user.joiningDate || 'Awaiting confirmed KYC approval date'}</dd></div>
      <div><dt>Daily Return</dt><dd>{terms ? `${terms.dailyReturnPercent}%` : 'Plan assignment required'}</dd></div>
      <div><dt>Daily Interest</dt><dd>{terms ? <Money usd={investmentUsd * terms.dailyReturnPercent / 100} /> : '—'}</dd></div>
      <div><dt>Allow Payout Request</dt><dd>{terms ? `${terms.payoutRequestDays} days; effective gap ${Math.max(7, terms.payoutRequestDays)} days` : '—'}</dd></div>
      <div><dt>Minimum Threshold</dt><dd>{terms ? `${terms.minimumThresholdPercent}% of investment must remain` : '—'}</dd></div>
      <div><dt>Withdrawal / Entry Fee</dt><dd>{terms ? `${terms.withdrawalEntryFeePercent}% (information only; no deduction)` : '—'}</dd></div>
      <div><dt>Platform / Management Fee</dt><dd>{terms ? `${terms.managementFeePercent}%` : '—'}</dd></div>
      <div><dt>Plan Duration</dt><dd>{terms ? `${terms.durationMonths} months from Joining Date` : '—'}</dd></div>
      <div><dt>Next Eligible Withdrawal Date</dt><dd>{user.nextWithdrawalDate || 'Requires confirmed approval date and assigned plan'}</dd></div>
      {terms && walletUsd !== undefined && <div><dt>Maximum Withdrawal Before Global Transaction Limit</dt><dd><Money usd={Math.max(0, walletUsd - investmentUsd * terms.minimumThresholdPercent / 100)} /></dd></div>}
    </dl>
    <p className="text-gray-500">Daily interest is credited in USD at 12:00 AM ({user.platformTimezone}) for the preceding eligible day. A $50 daily return adds $50 to the USD earnings wallet. No BTC conversion applies.</p>
    {!terms || !user.joiningDate ? <p className="text-amber-400">An administrator must confirm the plan assignment and KYC approval date before interest or withdrawals become available.</p> : <p className="text-gray-500">Agreed plan terms are preserved when the plan catalog is edited. Withdrawals require available funds, email verification and admin review.</p>}
  </section>;
}
