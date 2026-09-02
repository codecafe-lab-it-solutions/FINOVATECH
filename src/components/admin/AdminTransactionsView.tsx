import React, { useEffect, useState, useCallback } from 'react';
import { Receipt, Plus, RotateCw, AlertTriangle, X, Save } from 'lucide-react';
import {
  ApiTransactionWithInvestor,
  ApiInvestorProfile,
  fetchAdminAllTransactions,
  fetchAdminInvestors,
  addAdminInvestorTransaction
} from '../../lib/api';

interface AdminTransactionsViewProps {
  authToken: string;
}

export const AdminTransactionsView: React.FC<AdminTransactionsViewProps> = ({ authToken }) => {
  const [transactions, setTransactions] = useState<ApiTransactionWithInvestor[]>([]);
  const [investors, setInvestors] = useState<ApiInvestorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const [showCreate, setShowCreate] = useState(false);
  const [selectedInvestorId, setSelectedInvestorId] = useState('');
  const [depositUsd, setDepositUsd] = useState('0');
  const [depositBtc, setDepositBtc] = useState('0');
  const [depositNote, setDepositNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [{ transactions: txs }, { investors: invs }] = await Promise.all([
        fetchAdminAllTransactions(authToken),
        fetchAdminInvestors(authToken)
      ]);
      setTransactions(txs);
      setInvestors(invs);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    load();
  }, [load]);

  const types = ['All', ...Array.from(new Set(transactions.map((t) => t.type)))];
  const filtered = typeFilter === 'All' ? transactions : transactions.filter((t) => t.type === typeFilter);

  const handleRecordDeposit = async () => {
    if (!selectedInvestorId) {
      setError('Select an investor.');
      return;
    }
    setIsSaving(true);
    try {
      await addAdminInvestorTransaction(authToken, selectedInvestorId, {
        type: 'Deposit',
        amountBtc: Number(depositBtc),
        amountUsd: Number(depositUsd),
        note: depositNote
      });
      setShowCreate(false);
      setDepositUsd('0');
      setDepositBtc('0');
      setDepositNote('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record deposit.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono text-blue-300 mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>CAPITAL & WALLET TRANSACTION LEDGER</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Investment Transactions</h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLoading ? 'Loading...' : `${transactions.length} transaction${transactions.length === 1 ? '' : 's'} across all investors, live from the database.`}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Record Deposit
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer ${
              typeFilter === t ? 'bg-[#F7931A] text-gray-950 font-bold' : 'bg-gray-900 hover:bg-gray-800 text-gray-400 border border-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/90 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3">Type</th>
                <th className="py-3.5 px-3 text-right">BTC</th>
                <th className="py-3.5 px-3 text-right">USD</th>
                <th className="py-3.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 text-[11px] text-gray-400">{t.createdAt}</td>
                  <td className="py-3 px-3 font-sans font-semibold text-white">{t.investorName}</td>
                  <td className="py-3 px-3">{t.type}</td>
                  <td className={`py-3 px-3 text-right font-bold ${t.amountBtc >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.amountBtc >= 0 ? '+' : ''}{t.amountBtc} BTC
                  </td>
                  <td className="py-3 px-3 text-right text-gray-300">${t.amountUsd.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-300">{t.status}</span>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-500 font-mono">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-base font-sans">Record Capital Deposit</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <select value={selectedInvestorId} onChange={(e) => setSelectedInvestorId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white">
              <option value="">Select investor...</option>
              {investors.map((inv) => <option key={inv.userId} value={inv.userId}>{inv.name} ({inv.username})</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-gray-400 text-[10px] uppercase block mb-1">Amount (USD)</span>
                <input type="number" value={depositUsd} onChange={(e) => setDepositUsd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
              </label>
              <label className="block">
                <span className="text-gray-400 text-[10px] uppercase block mb-1">Amount (BTC, optional)</span>
                <input type="number" step="0.00000001" value={depositBtc} onChange={(e) => setDepositBtc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
              </label>
            </div>
            <input placeholder="Note (e.g. bank wire reference)" value={depositNote} onChange={(e) => setDepositNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white" />
            <p className="text-[10px] text-gray-500">This records the deposit in the wallet ledger. Update the investor's Total Investment figure separately in Investor Management if needed.</p>
            <button
              onClick={handleRecordDeposit}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RotateCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Record Deposit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
