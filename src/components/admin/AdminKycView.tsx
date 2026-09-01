import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, RotateCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ApiInvestorProfile, fetchAdminInvestors, updateAdminInvestorProfile } from '../../lib/api';

interface AdminKycViewProps {
  authToken: string;
}

// This is a filtered view of the SAME investor_profiles data managed in
// Investor Management — KYC status isn't a separate data model, it's one
// field on each investor's real profile.
export const AdminKycView: React.FC<AdminKycViewProps> = ({ authToken }) => {
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { investors: list } = await fetchAdminInvestors(authToken);
      setInvestors(list);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load investors.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDecision = async (userId: string, kycStatus: ApiInvestorProfile['kycStatus']) => {
    setUpdatingId(userId);
    try {
      const { profile } = await updateAdminInvestorProfile(authToken, userId, {
        kycStatus,
        accountStatus: kycStatus === 'Verified' ? 'Active' : undefined
      });
      setInvestors((prev) => prev.map((i) => (i.userId === userId ? profile : i)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update KYC status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const pending = investors.filter((i) => i.kycStatus !== 'Verified');
  const verified = investors.filter((i) => i.kycStatus === 'Verified');

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KYC & COMPLIANCE QUEUE</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">KYC & Compliance Verification Queue</h2>
        <p className="text-xs text-gray-400 mt-1">
          {isLoading ? 'Loading...' : `${pending.length} investor${pending.length === 1 ? '' : 's'} awaiting verification.`}
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="px-5 py-3 border-b border-gray-800 text-[11px] font-mono font-bold text-amber-400 uppercase">Pending Review</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3">Country</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {pending.map((inv) => (
                <tr key={inv.userId} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white">{inv.name}</div>
                    <div className="text-[11px] text-gray-400">{inv.username} • {inv.email || 'no email set'}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-400">{inv.country || 'Not provided'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.kycStatus === 'Action Required' ? 'bg-rose-500/20 text-rose-300' : 'bg-gray-700 text-gray-300'
                    }`}>{inv.kycStatus}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        disabled={updatingId === inv.userId}
                        onClick={() => handleDecision(inv.userId, 'Verified')}
                        className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        {updatingId === inv.userId ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : '✓ Approve'}
                      </button>
                      <button
                        disabled={updatingId === inv.userId}
                        onClick={() => handleDecision(inv.userId, 'Action Required')}
                        className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        ✕ Request Info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && pending.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-gray-500 font-mono">Nothing pending — all investors verified.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {verified.length > 0 && (
        <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
          <div className="px-5 py-3 border-b border-gray-800 text-[11px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </div>
          <div className="p-4 flex flex-wrap gap-2 text-xs font-mono">
            {verified.map((inv) => (
              <span key={inv.userId} className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300">{inv.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
