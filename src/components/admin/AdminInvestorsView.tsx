import { Money } from '../../lib/currency';
import { parseAdminAmount } from '../../lib/adminAmount';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Search,
  X,
  Save,
  RotateCw,
  Plus,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import {
  ApiInvestorProfile,
  ApiPlan,
  fetchAdminPlans,
  ApiWalletTransaction,
  ApiPayout,
  fetchAdminInvestors,
  fetchAdminInvestorDetail,
  updateAdminInvestorProfile,
  addAdminInvestorTransaction,
  deleteAdminInvestor
} from '../../lib/api';

interface AdminInvestorsViewProps {
  authToken: string;
}

type ProfileFormState = Partial<ApiInvestorProfile>;

export const AdminInvestorsView: React.FC<AdminInvestorsViewProps> = ({ authToken }) => {
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  useEffect(() => { fetchAdminPlans(authToken).then(r => setPlans(r.plans)).catch(() => {}); }, [authToken]);
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailProfile, setDetailProfile] = useState<ApiInvestorProfile | null>(null);
  const [transactions, setTransactions] = useState<ApiWalletTransaction[]>([]);
  const [payouts, setPayouts] = useState<ApiPayout[]>([]);
  const [formState, setFormState] = useState<ProfileFormState>({});
  const historicalApprovalInput = useRef<HTMLInputElement>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const [newTxType, setNewTxType] = useState('Adjustment');
  const [newTxBtc, setNewTxBtc] = useState('');
  const [newTxUsd, setNewTxUsd] = useState('');
  const [newTxNetwork, setNewTxNetwork] = useState('BTC');
  const [newTxNote, setNewTxNote] = useState('');
  const [isAddingTx, setIsAddingTx] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ApiInvestorProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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

  const handleDeleteInvestor = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await deleteAdminInvestor(authToken, deleteTarget.userId);
      setInvestors((prev) => prev.filter((i) => i.userId !== deleteTarget.userId));
      if (selectedId === deleteTarget.userId) closeModal();
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Could not delete investor.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleField = (key: keyof ProfileFormState, value: string | number) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const NUMERIC_FIELDS = ['miningSharePercent', 'totalInvestmentUsd', 'currentPortfolioValueUsd', 'totalBtcAllocated', 'btcMined'] as const;

  const handleSaveProfile = async () => {
    if (!selectedId) return;
    setIsSaving(true);
    setSaveError('');
    setSaveMessage('');
    try {
      const payload: ProfileFormState = { ...formState };
      // Read the submitted date from the native datetime control as well as
      // React state: some browser date pickers commit only when focus leaves.
      const historicalDate = historicalApprovalInput.current?.value;
      if (!detailProfile?.kycApprovedAt && historicalDate) {
        const parsed = new Date(historicalDate);
        if (!Number.isFinite(parsed.getTime())) throw new Error('Enter a valid historical approval date.');
        payload.kycApprovedAt = parsed.toISOString();
      }
      for (const key of NUMERIC_FIELDS) {
        const raw: unknown = payload[key];
        const label = key === 'totalInvestmentUsd' ? 'Total Investment (USD)' : key === 'currentPortfolioValueUsd' ? 'Portfolio Value (USD)' : key;
        payload[key] = parseAdminAmount(raw, label);
      }
      payload.nextWithdrawalDate = payload.nextWithdrawalDate || null;
      const { profile } = await updateAdminInvestorProfile(authToken, selectedId, payload);
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
        amountBtc: newTxBtc.trim() ? parseAdminAmount(newTxBtc, 'BTC amount', true) : 0,
        amountUsd: newTxUsd.trim() ? parseAdminAmount(newTxUsd, 'USD amount', true) : 0,
        network: newTxNetwork,
        note: newTxNote
      });
      setTransactions((prev) => [transaction, ...prev]);
      const fresh = await fetchAdminInvestorDetail(authToken, selectedId);
      setDetailProfile(fresh.profile);
      setFormState(fresh.profile);
      setInvestors(prev => prev.map(p => p.userId === selectedId ? fresh.profile : p));
      setNewTxBtc('');
      setNewTxUsd('');
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
      Pending: 'bg-ink-700 text-fg-body',
      'Action Required': 'bg-rose-500/20 text-rose-300'
    };
    return <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${styles[status]}`}>{status}</span>;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header + Search */}
      <div className="p-5 rounded-3xl bg-ink-950 border border-line space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Investor Directory & Ledgers</h2>
            <p className="text-xs text-fg-muted mt-0.5">
              {isLoadingList ? 'Loading...' : `Managing ${investors.length} registered investor account${investors.length === 1 ? '' : 's'}, live from the database.`}
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username, or email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-ink-850 border border-line-warm text-white placeholder-fg-muted text-xs font-mono focus:outline-hidden focus:border-gold-500"
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
      <div className="rounded-3xl bg-ink-950 border border-line overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ink-850/90 text-fg-muted font-mono text-[11px] uppercase tracking-wider border-b border-line">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3">KYC Status</th>
                <th className="py-3.5 px-3 text-right">Investment</th>
                <th className="py-3.5 px-3 text-right">Portfolio Value</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/80 font-mono text-fg-body">
              {filteredInvestors.map((inv) => (
                <tr
                  key={inv.userId}
                  onClick={() => openInvestor(inv.userId)}
                  className="hover:bg-ink-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white group-hover:text-gold-500 transition-colors">{inv.name}</div>
                    <div className="text-[11px] font-mono text-fg-muted">{inv.username} • {inv.email || 'no email set'}</div>
                  </td>
                  <td className="py-3.5 px-3">{kycBadge(inv.kycStatus)}</td>
                  <td className="py-3.5 px-3 text-right font-bold text-white"><Money usd={inv.totalInvestmentUsd} /></td>
                  <td className="py-3.5 px-3 text-right font-bold text-emerald-400"><Money usd={inv.currentPortfolioValueUsd} /></td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInvestor(inv.userId);
                        }}
                        className="px-3 py-1 rounded-lg bg-ink-800 hover:bg-gold-500 hover:text-black text-fg-body text-[11px] font-mono transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteError('');
                          setDeleteTarget(inv);
                        }}
                        title="Delete investor"
                        className="p-1.5 rounded-lg bg-ink-800 hover:bg-rose-500/20 text-fg-muted hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoadingList && filteredInvestors.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-fg-muted font-mono">No investors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Investor Modal */}
      {selectedId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-ink-900 border border-line-warm rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-ink-950 border-b border-line flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">
                {detailProfile ? detailProfile.name : 'Loading...'}
              </h3>
              <button id="admin-investor-modal-close" onClick={closeModal} className="p-2 rounded-xl bg-ink-800 hover:bg-ink-700 text-fg-muted hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              {isLoadingDetail && <div className="text-fg-muted">Loading investor...</div>}

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
                  <div className="p-4 rounded-2xl bg-ink-850/80 border border-line space-y-3">
                    <div className="text-[10px] text-fg-muted uppercase font-bold">Profile & Compliance</div>
                    <p>Investor ID: {detailProfile?.investorId} · Legacy Contract ID: {detailProfile?.legacyInvestorId}</p>
                    <p>USD earnings wallet: <Money usd={detailProfile?.usdWalletBalance || 0} /></p>
                    <p>KYC Approval Date: {detailProfile?.joiningDate || 'Not recorded'} · Joining Date: {detailProfile?.joiningDate || 'Awaiting confirmed KYC approval'}</p>
                    {!detailProfile?.kycApprovedAt && <label className="block text-fg-muted">Confirm historical KYC approval date (verified investors only)<input ref={historicalApprovalInput} type="datetime-local" value={formState.kycApprovedAt ? new Date(new Date(formState.kycApprovedAt).getTime() - new Date(formState.kycApprovedAt).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => handleField('kycApprovedAt', e.target.value ? new Date(e.target.value).toISOString() : '')} className="block p-2 bg-ink-950 border border-line text-white" /><span className="text-gold-200">Use the actual approval record. This date becomes permanent and starts interest eligibility.</span></label>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Email</span>
                        <input value={formState.email ?? ''} onChange={(e) => handleField('email', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
                      </label>
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Phone</span>
                        <input value={formState.phone ?? ''} onChange={(e) => handleField('phone', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
                      </label>
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">KYC Status</span>
                        <select value={formState.kycStatus ?? 'Pending'} onChange={(e) => handleField('kycStatus', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white">
                          <option>Pending</option>
                          <option>Verified</option>
                          <option>Action Required</option>
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Account Status</span>
                        <select value={formState.accountStatus ?? 'Under Review'} onChange={(e) => handleField('accountStatus', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white">
                          <option>Under Review</option>
                          <option>Active</option>
                        </select>
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Withdrawals Locked Until (optional)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="date"
                            value={formState.nextWithdrawalDate ?? ''}
                            onChange={(e) => handleField('nextWithdrawalDate', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-ink-950 border border-line text-white"
                          />
                          {formState.nextWithdrawalDate && (
                            <button
                              type="button"
                              onClick={() => handleField('nextWithdrawalDate', '')}
                              className="px-3 py-2 rounded-xl bg-ink-800 hover:bg-ink-700 text-fg-body text-[11px] cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-fg-muted mt-1 block">
                          This investor cannot request a withdrawal before this date. The plan interval and global seven-day minimum always apply.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Investment Plan */}
                  <div className="p-4 rounded-2xl bg-ink-850/80 border border-line space-y-3">
                    <div className="text-[10px] text-fg-muted uppercase font-bold">Investment Plan & Portfolio</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block sm:col-span-2">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Plan</span>
                        <select value={formState.plan ?? ''} onChange={(e) => handleField('plan', e.target.value)} className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white"><option value={detailProfile?.plan}>{detailProfile?.plan}</option>{plans.filter(p => p.name !== detailProfile?.plan).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select>
                      </label>
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Agreement Number</span>
                        <input value={detailProfile?.agreementNumber ?? ''} readOnly
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
                      </label>
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Total Investment (USD)</span>
                        <input type="text" inputMode="decimal" value={formState.totalInvestmentUsd ?? ''}
                          onChange={(e) => handleField('totalInvestmentUsd', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
                      </label>
                      <label className="block">
                        <span className="text-fg-muted text-[10px] uppercase block mb-1">Portfolio Value (USD)</span>
                        <input type="text" inputMode="decimal" value={formState.currentPortfolioValueUsd ?? ''}
                          onChange={(e) => handleField('currentPortfolioValueUsd', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile</span>
                  </button>

                  {/* Wallet Ledger */}
                  <div className="p-4 rounded-2xl bg-ink-850/80 border border-line space-y-3">
                    <div className="text-[10px] text-fg-muted uppercase font-bold flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-gold-500" /> Wallet Transaction Ledger
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {transactions.length === 0 && <div className="text-fg-muted">No transactions yet.</div>}
                      {transactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-ink-950 border border-line">
                          <span className="text-fg-body">
                            {t.type}{t.network ? <span className="text-fg-muted"> · {t.network}</span> : ''}
                          </span>
                          <span className={(t.amountBtc === 0 ? t.amountUsd : t.amountBtc) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {t.network === 'USD' || t.amountBtc === 0 ? <>{t.amountUsd >= 0 ? '+' : ''}<Money usd={t.amountUsd} /></> : <>{t.amountBtc >= 0 ? '+' : ''}{t.amountBtc} BTC (<Money usd={t.amountUsd} />)</>}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-line">
                      <select value={newTxType} onChange={(e) => setNewTxType(e.target.value)}
                        className="px-2 py-2 rounded-lg bg-ink-950 border border-line text-white text-[11px]">
                        <option>Adjustment</option>
                        <option>Mining Credit</option>
                        <option>Deposit</option>
                        <option>Referral Commission</option>
                      </select>
                      <input type="text" inputMode="decimal" placeholder="BTC" value={newTxBtc}
                        onChange={(e) => setNewTxBtc(e.target.value)}
                        className="px-2 py-2 rounded-lg bg-ink-950 border border-line text-white text-[11px]" />
                      <input type="text" inputMode="decimal" placeholder="USD" value={newTxUsd}
                        onChange={(e) => setNewTxUsd(e.target.value)}
                        className="px-2 py-2 rounded-lg bg-ink-950 border border-line text-white text-[11px]" />
                      <button
                        onClick={handleAddTransaction}
                        disabled={isAddingTx}
                        className="px-2 py-2 rounded-lg bg-ink-800 hover:bg-gold-500 hover:text-black text-fg-body flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                    <select value={newTxNetwork} onChange={(e) => setNewTxNetwork(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-line text-white text-[11px]">
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="USD">USD earnings wallet (no BTC conversion)</option>
                      <option value="TRC20">USDT Network: TRC20 (Tron)</option>
                      <option value="ERC20">USDT Network: ERC20 (Ethereum)</option>
                      <option value="BEP20">USDT Network: BEP20 (BNB Smart Chain)</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={newTxNote}
                      onChange={(e) => setNewTxNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-ink-950 border border-line text-white text-[11px]"
                    />
                  </div>

                  {/* Payouts (read-only here — manage in Payout Queue) */}
                  <div className="p-4 rounded-2xl bg-ink-850/80 border border-line space-y-2">
                    <div className="text-[10px] text-fg-muted uppercase font-bold">Payout Requests</div>
                    {payouts.length === 0 && <div className="text-fg-muted">No payout requests yet.</div>}
                    {payouts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-ink-950 border border-line">
                        <span className="text-fg-body">{p.currency === 'USD' ? <Money usd={p.amountUsd} /> : `${p.amountBtc} BTC`} → {p.destinationWallet.slice(0, 14)}... {p.network ? `(${p.network})` : ''}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          p.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                          p.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-gold-500/20 text-gold-100'
                        }`}>{p.status}</span>
                      </div>
                    ))}
                    <p className="text-[10px] text-fg-muted pt-1">Approve/reject payout requests from the Payout Management queue.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-ink-900 border border-rose-500/30 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Delete Investor</span>
            </div>

            <p className="text-fg-body font-sans text-xs leading-relaxed">
              This permanently deletes <strong className="text-white">{deleteTarget.name}</strong> ({deleteTarget.username}) and all of their data —
              profile, transaction history, payout requests, notifications, and sessions. This cannot be undone.
            </p>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /><span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleDeleteInvestor}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="py-2.5 px-4 rounded-xl bg-ink-800 hover:bg-ink-700 text-fg-body cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
