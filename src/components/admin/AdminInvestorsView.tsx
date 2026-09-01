import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  X,
  Save,
  RotateCw,
  Plus,
  Wallet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  ApiInvestorProfile,
  ApiWalletTransaction,
  ApiPayout,
  fetchAdminInvestors,
  fetchAdminInvestorDetail,
  updateAdminInvestorProfile,
  addAdminInvestorTransaction
} from '../../lib/api';

interface AdminInvestorsViewProps {
  authToken: string;
}

type ProfileFormState = Partial<ApiInvestorProfile>;

export const AdminInvestorsView: React.FC<AdminInvestorsViewProps> = ({ authToken }) => {
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailProfile, setDetailProfile] = useState<ApiInvestorProfile | null>(null);
  const [transactions, setTransactions] = useState<ApiWalletTransaction[]>([]);
  const [payouts, setPayouts] = useState<ApiPayout[]>([]);
  const [formState, setFormState] = useState<ProfileFormState>({});
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const [newTxType, setNewTxType] = useState('Adjustment');
  const [newTxBtc, setNewTxBtc] = useState('0');
  const [newTxUsd, setNewTxUsd] = useState('0');
  const [newTxNote, setNewTxNote] = useState('');
  const [isAddingTx, setIsAddingTx] = useState(false);

  const loadInvestors = useCallback(async () => {
    setIsLoadingList(true);
    try {
      const { investors: list } = await fetchAdminInvestors(authToken);
      setInvestors(list);
      setListError('');
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Could not load investors.');
    } finally {
      setIsLoadingList(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadInvestors();
  }, [loadInvestors]);

  const openInvestor = async (userId: string) => {
    setSelectedId(userId);
    setIsLoadingDetail(true);
    setSaveMessage('');
    setSaveError('');
    try {
      const { profile, transactions: txs, payouts: pos } = await fetchAdminInvestorDetail(authToken, userId);
      setDetailProfile(profile);
      setFormState(profile);
      setTransactions(txs);
      setPayouts(pos);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not load investor.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setSelectedId(null);
    setDetailProfile(null);
  };

  const handleField = (key: keyof ProfileFormState, value: string | number) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const { profile } = await updateAdminInvestorProfile(authToken, selectedId, formState);
      setDetailProfile(profile);
      setFormState(profile);
      setInvestors((prev) => prev.map((i) => (i.userId === profile.userId ? profile : i)));
      setSaveMessage('Investor profile updated.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!selectedId) return;
    setIsAddingTx(true);
    setSaveError('');
    try {
      const { transaction } = await addAdminInvestorTransaction(authToken, selectedId, {
        type: newTxType,
        amountBtc: Number(newTxBtc),
        amountUsd: Number(newTxUsd),
        note: newTxNote
      });
      setTransactions((prev) => [transaction, ...prev]);
      setNewTxBtc('0');
      setNewTxUsd('0');
      setNewTxNote('');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not add transaction.');
    } finally {
      setIsAddingTx(false);
    }
  };

  const filteredInvestors = investors.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return (
      inv.name.toLowerCase().includes(q) ||
      inv.username.toLowerCase().includes(q) ||
      inv.email.toLowerCase().includes(q)
    );
  });

  const kycBadge = (status: ApiInvestorProfile['kycStatus']) => {
    const styles: Record<string, string> = {
      Verified: 'bg-emerald-500/20 text-emerald-300',
      Pending: 'bg-gray-700 text-gray-300',
      'Action Required': 'bg-rose-500/20 text-rose-300'
    };
    return <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header + Search */}
      <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Investor Directory & Ledgers</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isLoadingList ? 'Loading...' : `Managing ${investors.length} registered investor account${investors.length === 1 ? '' : 's'}, live from the database.`}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-xs font-mono focus:outline-hidden focus:border-[#F7931A]"
            />
          </div>
        </div>
      </div>

      {listError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{listError}</span>
        </div>
      )}

      {/* Investor Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3">KYC Status</th>
                <th className="py-3.5 px-3 text-right">Investment</th>
                <th className="py-3.5 px-3 text-right">BTC Allocated</th>
                <th className="py-3.5 px-3 text-right">Portfolio Value</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filteredInvestors.map((inv) => (
                <tr
                  key={inv.userId}
                  onClick={() => openInvestor(inv.userId)}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white group-hover:text-[#F7931A] transition-colors">{inv.name}</div>
                    <div className="text-[11px] font-mono text-gray-400">{inv.username} • {inv.email || 'no email set'}</div>
                  </td>
                  <td className="py-3.5 px-3">{kycBadge(inv.kycStatus)}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-white">${inv.totalInvestmentUsd.toLocaleString()}</td>
                  <td className="py-3.5 px-3 text-right font-semibold text-[#F7931A]">{inv.totalBtcAllocated} BTC</td>
                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400">${inv.currentPortfolioValueUsd.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInvestor(inv.userId);
                      }}
                      className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-300 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoadingList && filteredInvestors.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-mono">No investors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Investor Modal */}
      {selectedId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-[#0F172A] border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">
                {detailProfile ? detailProfile.name : 'Loading...'}
              </h3>
              <button id="admin-investor-modal-close" onClick={closeModal} className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              {isLoadingDetail && <div className="text-gray-400">Loading investor...</div>}

              {!isLoadingDetail && detailProfile && (
                <>
                  {saveError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" /><span>{saveError}</span>
                    </div>
                  )}
                  {saveMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{saveMessage}</span>
                    </div>
                  )}

                  {/* Profile & Status */}
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Profile & Compliance</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Email</span>
                        <input value={formState.email ?? ''} onChange={(e) => handleField('email', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Phone</span>
                        <input value={formState.phone ?? ''} onChange={(e) => handleField('phone', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">KYC Status</span>
                        <select value={formState.kycStatus ?? 'Pending'} onChange={(e) => handleField('kycStatus', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white">
                          <option>Pending</option>
                          <option>Verified</option>
                          <option>Action Required</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Account Status</span>
                        <select value={formState.accountStatus ?? 'Under Review'} onChange={(e) => handleField('accountStatus', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white">
                          <option>Under Review</option>
                          <option>Active</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  {/* Investment Plan */}
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Investment Plan & Portfolio</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block sm:col-span-2">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Plan</span>
                        <input value={formState.plan ?? ''} onChange={(e) => handleField('plan', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Agreement Number</span>
                        <input value={formState.agreementNumber ?? ''} onChange={(e) => handleField('agreementNumber', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Mining Share %</span>
                        <input type="number" step="0.001" value={formState.miningSharePercent ?? 0}
                          onChange={(e) => handleField('miningSharePercent', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Total Investment (USD)</span>
                        <input type="number" value={formState.totalInvestmentUsd ?? 0}
                          onChange={(e) => handleField('totalInvestmentUsd', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Portfolio Value (USD)</span>
                        <input type="number" value={formState.currentPortfolioValueUsd ?? 0}
                          onChange={(e) => handleField('currentPortfolioValueUsd', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">Total BTC Allocated</span>
                        <input type="number" step="0.00000001" value={formState.totalBtcAllocated ?? 0}
                          onChange={(e) => handleField('totalBtcAllocated', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                      <label className="block">
                        <span className="text-gray-400 text-[10px] uppercase block mb-1">BTC Mined</span>
                        <input type="number" step="0.00000001" value={formState.btcMined ?? 0}
                          onChange={(e) => handleField('btcMined', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile</span>
                  </button>

                  {/* Wallet Ledger */}
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3">
                    <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-[#F7931A]" /> Wallet Transaction Ledger
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {transactions.length === 0 && <div className="text-gray-500">No transactions yet.</div>}
                      {transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800">
                          <span className="text-gray-300">{t.type}</span>
                          <span className={t.amountBtc >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {t.amountBtc >= 0 ? '+' : ''}{t.amountBtc} BTC
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-800">
                      <select value={newTxType} onChange={(e) => setNewTxType(e.target.value)}
                        className="px-2 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-[11px]">
                        <option>Adjustment</option>
                        <option>Mining Credit</option>
                        <option>Deposit</option>
                        <option>Referral Commission</option>
                      </select>
                      <input type="number" step="0.00000001" placeholder="BTC" value={newTxBtc}
                        onChange={(e) => setNewTxBtc(e.target.value)}
                        className="px-2 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-[11px]" />
                      <input type="number" placeholder="USD" value={newTxUsd}
                        onChange={(e) => setNewTxUsd(e.target.value)}
                        className="px-2 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-[11px]" />
                      <button
                        onClick={handleAddTransaction}
                        disabled={isAddingTx}
                        className="px-2 py-2 rounded-lg bg-gray-800 hover:bg-[#F7931A] hover:text-gray-950 text-gray-300 flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={newTxNote}
                      onChange={(e) => setNewTxNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-white text-[11px]"
                    />
                  </div>

                  {/* Payouts (read-only here — manage in Payout Queue) */}
                  <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-2">
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Payout Requests</div>
                    {payouts.length === 0 && <div className="text-gray-500">No payout requests yet.</div>}
                    {payouts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-950 border border-gray-800">
                        <span className="text-gray-300">{p.amountBtc} BTC → {p.destinationWallet.slice(0, 14)}...</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                          p.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>{p.status}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-gray-500 pt-1">Approve/reject payout requests from the Payout Management queue.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
