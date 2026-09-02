import React, { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';
import { ApiReferredInvestor } from '../../lib/api';

interface ReferralPartnerTabProps {
  referralCode: string;
  referredUsers: ApiReferredInvestor[];
}

export const ReferralPartnerTab: React.FC<ReferralPartnerTabProps> = ({ referralCode, referredUsers }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <Users className="w-3.5 h-3.5" />
            <span>PARTNER / REFERRAL PROGRAM</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">Investor Referral & Partner Program</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Share your code — anyone who registers with it appears here, live from the database.
          </p>
        </div>
        <div className="p-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right font-mono">
          <div className="text-[10px] text-emerald-400 font-bold uppercase">Total Referrals</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{referredUsers.length}</div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 text-white space-y-3 font-mono">
        <div className="text-[#F7931A] font-bold uppercase tracking-wider text-xs">Your Referral Code:</div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full flex-1 p-3 rounded-xl bg-gray-950 border border-gray-700 text-lg tracking-widest text-white text-center select-all font-mono font-bold">
            {referralCode || 'Not assigned yet'}
          </div>
          <button
            onClick={handleCopyCode}
            disabled={!referralCode}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <p className="text-[11px] text-gray-500">New investors enter this code on the "Create Account" screen when registering.</p>
      </div>

      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-sm font-bold uppercase tracking-wider">Investors Who Used Your Code</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Investor Name</th>
                <th className="pb-3 px-3">Username</th>
                <th className="pb-3 px-3">Joined Date</th>
                <th className="pb-3 px-3">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {referredUsers.map((u) => (
                <tr key={u.username} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-3 text-white font-bold whitespace-nowrap">{u.name}</td>
                  <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">{u.username}</td>
                  <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">{u.joinedDate}</td>
                  <td className="py-3.5 px-3 text-gray-300 whitespace-nowrap">{u.plan}</td>
                </tr>
              ))}
              {referredUsers.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500">No referrals yet — share your code above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
