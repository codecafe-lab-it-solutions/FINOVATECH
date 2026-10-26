import { useCurrency } from '../../lib/currency';
import React, { useEffect, useState, useCallback } from 'react';
import { Wallet, Plus, Save, RotateCw, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { ApiCompanyWallet, fetchAdminWallets, createAdminWallet, updateAdminWallet, deleteAdminWallet } from '../../lib/api';

interface AdminWalletsViewProps {
  authToken: string;
  spotBtcPriceUsd: number;
}

const emptyForm = {
  walletName: '',
  type: 'Treasury' as ApiCompanyWallet['type'],
  currency: 'BTC' as ApiCompanyWallet['currency'],
  address: '',
  balance: 0,
  requiresMultisig: false,
  status: 'Active' as ApiCompanyWallet['status']
};

export const AdminWalletsView: React.FC<AdminWalletsViewProps> = ({ authToken, spotBtcPriceUsd }) => {
  const { formatMoney } = useCurrency();
  const [wallets, setWallets] = useState<ApiCompanyWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBalanceId, setEditingBalanceId] = useState<string | null>(null);
  const [balanceDraft, setBalanceDraft] = useState('0');
  const [deleteTarget,setDeleteTarget] = useState<ApiCompanyWallet|null>(null);
  const [deleting,setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { wallets: list } = await fetchAdminWallets(authToken);
      setWallets(list);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load wallets.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    if (!form.walletName.trim()) {
      setError('Wallet name is required.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingId) await updateAdminWallet(authToken, editingId, form);
      else await createAdminWallet(authToken, form);
      setForm(emptyForm);
      setShowCreate(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create wallet.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditBalance = (wallet: ApiCompanyWallet) => {
    setEditingBalanceId(wallet.id);
    setBalanceDraft(String(wallet.balance));
  };

  const saveBalance = async (id: string) => {
    try {
      await updateAdminWallet(authToken, id, { balance: Number(balanceDraft) });
      setWallets((prev) => prev.map((w) => (w.id === id ? { ...w, balance: Number(balanceDraft) } : w)));
      setEditingBalanceId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update balance.');
    }
  };

  const totalBtc = wallets.filter((w) => w.currency === 'BTC').reduce((sum, w) => sum + w.balance, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-ink-950 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-600/20 text-[11px] font-mono text-gold-500 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>COMPANY TREASURY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Company Wallets & Multi-Sig Vaults</h2>
          <p className="text-xs text-fg-muted mt-1">
            {isLoading ? 'Loading...' : `${wallets.length} wallet${wallets.length === 1 ? '' : 's'} tracked • ${totalBtc.toFixed(4)} BTC total ≈ ${formatMoney((totalBtc * spotBtcPriceUsd))}`}
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(emptyForm); setShowCreate(true); }}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs font-mono flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Wallet
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((w) => (
          <div key={w.id} className="p-5 rounded-2xl bg-ink-950 border border-line space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm font-sans">{w.walletName}</h3>
                <span className="text-fg-muted">{w.type}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                w.status === 'Secure' ? 'bg-emerald-500/20 text-emerald-300' :
                w.status === 'Restricted' ? 'bg-rose-500/20 text-rose-300' : 'bg-gold-500/20 text-gold-300'
              }`}>{w.status}{w.requiresMultisig ? ' • Multi-Sig' : ''}</span>
            </div>
            <div className="flex gap-4"><button className="text-gold-200" onClick={() => { setEditingId(w.id); setForm(w); setShowCreate(true); }}>Edit wallet</button><button className="text-rose-400" onClick={() => setDeleteTarget(w)}>Delete</button></div>
            {w.address && (
              <div className="p-2 rounded-lg bg-ink-950 border border-line text-gold-200 break-all text-[11px] select-all">{w.address}</div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-fg-muted text-[11px] uppercase">Balance</span>
              {editingBalanceId === w.id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number" step="0.00000001" value={balanceDraft}
                    onChange={(e) => setBalanceDraft(e.target.value)}
                    className="w-28 px-2 py-1 rounded-lg bg-ink-950 border border-line text-white text-[11px]"
                  />
                  <button onClick={() => saveBalance(w.id)} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 cursor-pointer">
                    <Save className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => startEditBalance(w)} className="text-base font-bold text-white cursor-pointer hover:text-gold-500">
                  {w.balance} {w.currency}
                </button>
              )}
            </div>
          </div>
        ))}
        {!isLoading && wallets.length === 0 && (
          <div className="col-span-full text-center py-8 text-fg-muted font-mono">No wallets yet. Create one to get started.</div>
        )}
      </div>

      {deleteTarget && <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"><div role="dialog" aria-modal="true" aria-label="Delete wallet record" className="bg-ink-850 border border-line-warm p-6 rounded-2xl max-w-lg space-y-4 text-white">
        <h3 className="font-bold">Delete {deleteTarget.walletName}?</h3><p>This permanently removes the tracking record. It does not transfer funds.</p>
        <button disabled={deleting} onClick={()=>setDeleteTarget(null)} className="px-4 py-2 bg-ink-700 rounded-xl">Cancel</button>
        <button disabled={deleting} className="px-4 py-2 bg-rose-700 rounded-xl ml-3" onClick={async()=>{setDeleting(true);try{await deleteAdminWallet(authToken,deleteTarget.id);setDeleteTarget(null);await load();}catch(err){setError(err instanceof Error?err.message:'Delete failed.');}finally{setDeleting(false);}}}>{deleting?'Deleting...':'Confirm Delete Wallet'}</button>
      </div></div>}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-ink-900 border border-line-warm rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base font-sans">{editingId ? 'Edit Company Wallet' : 'New Company Wallet'}</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg bg-ink-800 text-fg-muted hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input placeholder="Wallet name" value={form.walletName} onChange={(e) => setForm({ ...form, walletName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
            <input placeholder="Wallet address (optional)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
            <label className="block text-fg-muted">Status<select aria-label="Wallet status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ApiCompanyWallet['status'] })} className="w-full p-2 rounded bg-ink-950 text-white"><option>Active</option><option>Secure</option><option>Restricted</option></select></label><div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ApiCompanyWallet['type'] })}
                className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white">
                <option>Cold Vault</option>
                <option>Hot Payout</option>
                <option>Treasury</option>
                <option>Operational OPEX</option>
                <option>USDT Reserve</option>
              </select>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as ApiCompanyWallet['currency'] })}
                className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white">
                <option>BTC</option>
                <option>USDT</option>
              </select>
              <input type="number" step="0.00000001" placeholder="Starting balance" value={form.balance}
                onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-ink-950 border border-line text-white" />
              <label className="flex items-center gap-2 text-fg-body">
                <input type="checkbox" checked={form.requiresMultisig} onChange={(e) => setForm({ ...form, requiresMultisig: e.target.checked })} />
                Requires Multi-Sig
              </label>
            </div>
            <button
              onClick={handleCreate}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{editingId ? 'Save Wallet' : 'Create Wallet'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
