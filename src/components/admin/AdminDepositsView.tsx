import React, { useEffect, useState, useCallback } from 'react';
import {
  ArrowDownToLine,
  Plus,
  X,
  Save,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react';
import {
  ApiDepositAddress,
  ApiDepositRequest,
  ApiInvestorProfile,
  fetchAdminDepositAddresses,
  createAdminDepositAddress,
  fetchAdminDepositRequests,
  updateAdminDepositRequestStatus,
  fetchAdminInvestors,
  fetchDepositProofUrl
} from '../../lib/api';

interface AdminDepositsViewProps {
  authToken: string;
}

export const AdminDepositsView: React.FC<AdminDepositsViewProps> = ({ authToken }) => {
  const [addresses, setAddresses] = useState<ApiDepositAddress[]>([]);
  const [requests, setRequests] = useState<ApiDepositRequest[]>([]);
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newNetwork, setNewNetwork] = useState('TRC20');
  const [newVisibility, setNewVisibility] = useState<'All' | 'Specific'>('All');
  const [newVisibleIds, setNewVisibleIds] = useState<string[]>([]);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [proofModalUrl, setProofModalUrl] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [{ addresses: addrs }, { requests: reqs }, { investors: invs }] = await Promise.all([
        fetchAdminDepositAddresses(authToken),
        fetchAdminDepositRequests(authToken),
        fetchAdminInvestors(authToken)
      ]);
      setAddresses(addrs);
      setRequests(reqs);
      setInvestors(invs);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load deposit data.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const activeAddress = addresses.find((a) => a.isActive);
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleVisibleId = (id: string) => {
    setNewVisibleIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newVisibility === 'Specific' && newVisibleIds.length === 0) {
      setError('Select at least one investor for specific visibility.');
      return;
    }
    setIsSavingAddress(true);
    try {
      await createAdminDepositAddress(authToken, {
        address: newAddress.trim(),
        network: newNetwork,
        visibility: newVisibility,
        visibleInvestorIds: newVisibility === 'Specific' ? newVisibleIds : undefined
      });
      setShowAddressForm(false);
      setNewAddress('');
      setNewNetwork('TRC20');
      setNewVisibility('All');
      setNewVisibleIds([]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save deposit address.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleViewProof = async (requestId: string) => {
    setError('');
    try {
      const url = await fetchDepositProofUrl(authToken, requestId);
      setProofModalUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load proof image.');
    }
  };

  const handleApprove = async (requestId: string) => {
    setReviewingId(requestId);
    setError('');
    try {
      await updateAdminDepositRequestStatus(authToken, requestId, 'Approved');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not approve deposit request.');
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setReviewingId(requestId);
    setError('');
    try {
      await updateAdminDepositRequestStatus(authToken, requestId, 'Rejected', rejectNote.trim() || undefined);
      setRejectNote('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reject deposit request.');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800">
        <h2 className="text-2xl font-bold text-white tracking-tight">Deposit Requests</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-2xl">
          Configure the active USDT deposit address and review investor-submitted deposit proofs.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      {/* Active Deposit Address */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">Active Deposit Address</h3>
          <button
            onClick={() => setShowAddressForm(true)}
            className="px-4 py-2 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Set New Address
          </button>
        </div>

        {activeAddress ? (
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold break-all">{activeAddress.address}</span>
              <button onClick={() => handleCopy(activeAddress.address, activeAddress.id)} className="text-gray-400 hover:text-white cursor-pointer shrink-0 ml-2">
                {copiedId === activeAddress.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold">{activeAddress.network}</span>
              <span>
                Visible to: {activeAddress.visibility === 'All' ? 'All Investors' : `${activeAddress.visibleInvestorIds.length} specific investor(s)`}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs text-gray-500 font-mono">
            No deposit address configured yet — investors won't see a deposit option until you set one.
          </div>
        )}
      </div>

      {/* Pending Requests */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">Pending Review</h3>
          <span className="text-[11px] text-amber-400 font-mono">{pendingRequests.length} awaiting review</span>
        </div>
        <div className="divide-y divide-gray-800/80">
          {pendingRequests.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-xs font-mono">No pending deposit requests.</div>
          )}
          {pendingRequests.map((r) => (
            <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <div className="font-sans font-bold text-white">{r.investorName}</div>
                <div className="text-gray-400 mt-0.5">
                  {r.referenceNumber} • ${r.amountUsd.toLocaleString()} • {r.network} • {r.createdAt}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewProof(r.id)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> View Proof
                </button>
                <button
                  onClick={() => handleApprove(r.id)}
                  disabled={reviewingId === r.id}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => {
                    const note = window.prompt('Optional reason for rejection:') || '';
                    setRejectNote(note);
                    handleReject(r.id);
                  }}
                  disabled={reviewingId === r.id}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full History */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            {isLoading ? 'Loading...' : `${requests.length} Deposit Request${requests.length === 1 ? '' : 's'}, Live From The Database`}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3 text-right">Amount</th>
                <th className="py-3.5 px-3">Network</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Submitted</th>
                <th className="py-3.5 px-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 text-[#F7931A] font-bold">{r.referenceNumber}</td>
                  <td className="py-3 px-3 font-sans text-white">{r.investorName}</td>
                  <td className="py-3 px-3 text-right">${r.amountUsd.toLocaleString()}</td>
                  <td className="py-3 px-3">{r.network}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' :
                      r.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-400 text-[11px]">{r.createdAt}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleViewProof(r.id)} className="text-[#F7931A] hover:underline cursor-pointer text-[11px]">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && requests.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-500 font-mono">No deposit requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base font-sans">Set New Deposit Address</h3>
              <button onClick={() => setShowAddressForm(false)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="space-y-3.5">
              <div>
                <label className="block text-gray-400 mb-1">USDT Address</label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Network</label>
                <select
                  value={newNetwork}
                  onChange={(e) => setNewNetwork(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                >
                  <option value="TRC20">TRC20 (Tron)</option>
                  <option value="ERC20">ERC20 (Ethereum)</option>
                  <option value="BEP20">BEP20 (BNB Smart Chain)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Visible To</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-1.5 text-gray-300 cursor-pointer">
                    <input type="radio" checked={newVisibility === 'All'} onChange={() => setNewVisibility('All')} className="text-[#F7931A]" />
                    <span>All Investors</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-gray-300 cursor-pointer">
                    <input type="radio" checked={newVisibility === 'Specific'} onChange={() => setNewVisibility('Specific')} className="text-[#F7931A]" />
                    <span>Specific Investors</span>
                  </label>
                </div>

                {newVisibility === 'Specific' && (
                  <div className="max-h-32 overflow-y-auto rounded-xl bg-gray-950 border border-gray-800 p-2 space-y-1">
                    {investors.map((inv) => (
                      <label key={inv.userId} className="flex items-center gap-2 p-1 rounded hover:bg-gray-900 cursor-pointer text-gray-300">
                        <input type="checkbox" checked={newVisibleIds.includes(inv.userId)} onChange={() => toggleVisibleId(inv.userId)} className="text-[#F7931A]" />
                        <span>{inv.name} ({inv.username})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-[10px] text-gray-500">
                Setting a new address deactivates the current one — only one address is ever active at a time.
              </p>

              <button
                type="submit"
                disabled={isSavingAddress}
                className="w-full py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingAddress ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save & Activate</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Proof Image Modal */}
      {proofModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4" onClick={() => setProofModalUrl(null)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setProofModalUrl(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={proofModalUrl} alt="Payment proof" className="w-full rounded-2xl border border-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
};
