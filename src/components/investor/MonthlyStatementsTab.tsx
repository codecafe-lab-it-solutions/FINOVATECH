import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { ApiMonthlyStatement } from '../../lib/api';
import { InvestorUser } from '../../types';

interface MonthlyStatementsTabProps {
  statements: ApiMonthlyStatement[];
  user: InvestorUser;
}

function monthLabel(month: string): string {
  const [year, m] = month.split('-');
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export const MonthlyStatementsTab: React.FC<MonthlyStatementsTabProps> = ({ statements, user }) => {
  const handleExportCsv = () => {
    const header = 'Month,Mining Credits (BTC),Mining Credits (USD),Payouts (BTC),Payouts (USD),Net (USD),Transactions\n';
    const rows = statements
      .map((s) => `${s.month},${s.miningCreditsBtc},${s.miningCreditsUsd},${s.payoutsBtc},${s.payoutsUsd},${s.netUsd},${s.transactionCount}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.username}-monthly-statements.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 sm:p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>MONTHLY STATEMENTS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">Monthly Statements</h2>
          <p className="text-xs text-gray-400 mt-1">
            Computed live from your real wallet ledger, grouped by month — {statements.length} month{statements.length === 1 ? '' : 's'} of activity.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={statements.length === 0}
          className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-950/60 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-3 text-right">Mining Credits</th>
                <th className="py-3.5 px-3 text-right">Payouts</th>
                <th className="py-3.5 px-3 text-right">Net Change</th>
                <th className="py-3.5 px-3 text-right">Transactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {statements.map((s) => (
                <tr key={s.month} className="hover:bg-gray-800/40">
                  <td className="py-3 px-4 font-sans font-bold text-white">{monthLabel(s.month)}</td>
                  <td className="py-3 px-3 text-right text-emerald-400">+{s.miningCreditsBtc.toFixed(6)} BTC (${s.miningCreditsUsd.toLocaleString()})</td>
                  <td className="py-3 px-3 text-right text-rose-400">-{s.payoutsBtc.toFixed(6)} BTC (${s.payoutsUsd.toLocaleString()})</td>
                  <td className={`py-3 px-3 text-right font-bold ${s.netUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {s.netUsd >= 0 ? '+' : ''}${s.netUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-gray-400">{s.transactionCount}</td>
                </tr>
              ))}
              {statements.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500 font-mono">No activity yet — statements appear once you have wallet transactions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
