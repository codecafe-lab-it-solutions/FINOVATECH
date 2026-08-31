import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  Share2 
} from 'lucide-react';
import { ReferralStat } from '../../types';

interface ReferralPartnerTabProps {
  referrals: ReferralStat;
}

export const ReferralPartnerTab: React.FC<ReferralPartnerTabProps> = ({ referrals }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referrals.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <Users className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL PARTNER NETWORK</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Investor Referral & Partner Program
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Earn up to 2.5% lifetime commissions on capital allocations introduced to FINOVATECH Muscat facilities
          </p>
        </div>

        <div className="p-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right font-mono">
          <div className="text-[10px] text-emerald-400 font-bold uppercase">TOTAL COMMISSIONS EARNED</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
            ${referrals.referralEarningsUsd.toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Referral Link Copy Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 text-white space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#F7931A] font-bold uppercase tracking-wider">
            Your Sovereign Referral URL:
          </span>
          <span className="text-gray-400 text-[11px]">Direct Hashrate Allocation Link</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full flex-1 p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white break-all select-all font-mono">
            {referrals.referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Link!' : 'Copy Partner Link'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
        
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Total Referrals</div>
          <div className="text-xl font-bold text-white mt-1">{referrals.totalReferrals} Investors</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Muscat Network</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-emerald-500/30 text-white">
          <div className="text-[10px] text-emerald-400 uppercase">Active Allocations</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{referrals.activeInvestorsReferred} Active</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Mining Live in Pods</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Pending Commission</div>
          <div className="text-xl font-bold text-amber-400 mt-1">${referrals.pendingCommissionUsd}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Under KYC Clearance</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Paid Commissions</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">${referrals.paidCommissionUsd}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Credited to BTC Wallet</div>
        </div>

      </div>

      {/* Referred Investors Table */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-sm font-bold uppercase tracking-wider">
            Referred Investors & Commission Status
          </span>
          <span className="text-xs text-gray-400">
            Institutional Confidentiality Protected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Investor Name</th>
                <th className="pb-3 px-3">Joined Date</th>
                <th className="pb-3 px-3">Plan Subscribed</th>
                <th className="pb-3 px-3">Your Commission</th>
                <th className="pb-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {referrals.referredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-3 text-white font-bold whitespace-nowrap">{user.name}</td>
                  <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">{user.joinedDate}</td>
                  <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">{user.plan}</td>
                  <td className="py-3.5 px-3 text-[#F7931A] font-bold whitespace-nowrap">+${user.commissionUsd} USD</td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${
                      user.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{user.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
