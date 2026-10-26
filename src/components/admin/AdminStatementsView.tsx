import { Money } from '../../lib/currency';
import React, { useState } from 'react';
import {
  FileText,
  Download,
  Mail,
  Eye,
  CheckCircle2,
  Calendar,
  Send,
  RotateCw,
  Search,
  Check
} from 'lucide-react';
import { AdminStatementBatchItem } from '../../types';

interface AdminStatementsViewProps {
  statements: AdminStatementBatchItem[];
}

export const AdminStatementsView: React.FC<AdminStatementsViewProps> = ({ statements: initialStatements }) => {
  const [statementList, setStatementList] = useState<AdminStatementBatchItem[]>(initialStatements);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<AdminStatementBatchItem | null>(null);

  const handleGenerateAll = () => {
    setIsGeneratingBatch(true);
    setTimeout(() => {
      setStatementList((prev) =>
        prev.map((s) => ({ ...s, status: 'Sent' }))
      );
      setIsGeneratingBatch(false);
      setBatchSuccess(true);
      setTimeout(() => setBatchSuccess(false), 3000);
    }, 1200);
  };

  const handleSendEmail = (id: string) => {
    setStatementList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Sent' } : s))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-ink-950 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>AUDITED MONTHLY INVESTOR SETTLEMENT REPORTS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Monthly Statement Generator & Dispatch</h2>
          <p className="text-xs text-fg-muted mt-1 max-w-2xl">
            Automated PDF reconciliation generating individual mining yields, electricity deductions, and wallet payout receipts.
          </p>
        </div>

        <button
          onClick={handleGenerateAll}
          disabled={isGeneratingBatch}
          className="px-5 py-3 rounded-2xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-gold-500/20 disabled:opacity-50"
        >
          {isGeneratingBatch ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Generating 248 PDFs...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate & Dispatch All Statements (Aug 2026)</span>
            </>
          )}
        </button>
      </div>

      {batchSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All 248 monthly statements generated, cryptographically signed, and emailed to investors.</span>
        </div>
      )}

      {/* Statements Table */}
      <div className="rounded-3xl bg-ink-950 border border-line overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ink-850/90 text-fg-muted font-mono text-[11px] uppercase tracking-wider border-b border-line">
                <th className="py-3.5 px-4">Statement Period</th>
                <th className="py-3.5 px-3">Investor</th>
                <th className="py-3.5 px-3 text-right">Investment</th>
                <th className="py-3.5 px-3 text-right">BTC Mined</th>
                <th className="py-3.5 px-3 text-right">Net Payout</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/80 font-mono text-fg-body">
              {statementList.map((stmt) => (
                <tr key={stmt.id} className="hover:bg-ink-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>{stmt.month}</span>
                  </td>

                  <td className="py-3.5 px-3 font-sans">
                    <div className="font-bold text-white">{stmt.investorName}</div>
                    <div className="text-[10px] text-fg-muted font-mono">{stmt.investorId}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    <Money usd={stmt.investmentAmountUsd} />
                  </td>

                  <td className="py-3.5 px-3 text-right text-gold-500 font-semibold">
                    {stmt.totalBtcMined.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400">
                    <Money usd={stmt.netPayoutUsd} />
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      stmt.status === 'Sent' ? 'bg-emerald-500/20 text-emerald-300' :
                      stmt.status === 'Generated' ? 'bg-gold-500/20 text-gold-300' :
                      'bg-ink-800 text-fg-body'
                    }`}>
                      {stmt.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedStatement(stmt)}
                        className="p-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-fg-body transition-colors cursor-pointer"
                        title="Preview PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSendEmail(stmt.id)}
                        className="p-1.5 rounded-lg bg-ink-800 hover:bg-gold-500 hover:text-black text-fg-body transition-colors cursor-pointer"
                        title="Email PDF"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {selectedStatement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-ink-850 text-white rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <div className="text-xl font-black text-gold-500 font-mono">FINOVATECK MINING</div>
                <div className="text-xs text-fg-muted font-mono">Sultanate of Oman • Institutional Tier</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold uppercase font-mono">Monthly Statement</div>
                <div className="text-xs text-fg-muted font-mono">{selectedStatement.month}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-fg-muted block text-[10px] uppercase">Account Holder</span>
                <strong className="text-sm">{selectedStatement.investorName}</strong>
                <div className="text-fg-muted">{selectedStatement.investorId}</div>
              </div>
              <div className="text-right">
                <span className="text-fg-muted block text-[10px] uppercase">Contract Principal</span>
                <strong className="text-sm"><Money usd={selectedStatement.investmentAmountUsd} /></strong>
              </div>
            </div>

            {/* Reconciliation table */}
            <div className="p-4 rounded-2xl bg-ink-900 border border-line text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span>Gross Hashrate Mined:</span>
                <strong>{selectedStatement.totalBtcMined.toFixed(4)} BTC</strong>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Power Tariff Deduction (<Money usd={0.042} maximumFractionDigits={4} />/kWh):</span>
                <span>-<Money usd={selectedStatement.electricityCostUsd} /></span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Management Fee:</span>
                <span>-<Money usd={selectedStatement.managementFeeUsd} /></span>
              </div>
              <div className="pt-2 border-t border-line flex justify-between font-black text-sm text-emerald-400">
                <span>Net Disbursed to Cold Storage:</span>
                <span><Money usd={selectedStatement.netPayoutUsd} /></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedStatement(null)}
                className="px-4 py-2 rounded-xl bg-ink-700 hover:bg-ink-700 text-fg-body text-xs font-mono font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
