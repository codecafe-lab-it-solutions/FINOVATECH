import { Money } from '../../lib/currency';
import React, { useState } from 'react';
import {
  PieChart,
  Calculator,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { InvestorAllocationRecord } from '../../types';

interface AdminAllocationsViewProps {
  allocations: InvestorAllocationRecord[];
}

export const AdminAllocationsView: React.FC<AdminAllocationsViewProps> = ({ allocations }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = allocations.filter((a) => {
    const q = searchQuery.toLowerCase();
    return a.investorName.toLowerCase().includes(q) || a.investorId.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="p-5 rounded-3xl bg-ink-950 border border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Investor Hashrate & Revenue Allocation</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            Automated allocation calculation engine based on contracted TH/s share of total fleet output.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search investor allocations..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-ink-850 border border-line-warm text-white text-xs font-mono"
          />
        </div>
      </div>

      {/* Allocation Formula Explainer Box */}
      <div className="p-4 rounded-2xl bg-ink-950 border border-line font-mono text-xs text-fg-body space-y-2">
        <div className="text-[10px] text-gold-200 uppercase font-bold flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5" />
          <span>Defined Calculation Formula:</span>
        </div>
        <div className="p-3 rounded-xl bg-ink-850/80 border border-line/80 text-white">
          <code>Investor Share % = (Allocated TH/s ÷ Fleet Active TH/s) × 100</code>
          <div className="text-fg-muted mt-1">
            <code>Net BTC = (Gross Daily BTC × Share %) - (Daily Power kWh × <Money usd={0.042} maximumFractionDigits={4} /> ÷ BTC Price in selected currency) - (Management Fee %)</code>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-ink-950 border border-line overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-ink-850/90 text-fg-muted font-mono text-[11px] uppercase tracking-wider border-b border-line">
                <th className="py-3.5 px-4">Investor</th>
                <th className="py-3.5 px-3 text-right">Investment</th>
                <th className="py-3.5 px-3 text-right">Allocated Hashrate</th>
                <th className="py-3.5 px-3 text-right">Mining Share %</th>
                <th className="py-3.5 px-3 text-right">Gross Daily BTC</th>
                <th className="py-3.5 px-3 text-right">OPEX Deducted</th>
                <th className="py-3.5 px-3 text-right">Net Credited BTC</th>
                <th className="py-3.5 px-4">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/80 font-mono text-fg-body">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-ink-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-bold text-white">{item.investorName}</div>
                    <div className="text-[11px] font-mono text-fg-muted">{item.investorId} • {item.date}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-white">
                    <Money usd={item.investmentAmountUsd} />
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-gold-500">
                    {item.allocatedHashrateTH} TH/s
                  </td>

                  <td className="py-3.5 px-3 text-right text-emerald-400 font-semibold">
                    {item.miningSharePercent}%
                  </td>

                  <td className="py-3.5 px-3 text-right text-white">
                    {item.dailyBtcGenerated.toFixed(5)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right text-rose-400">
                    -{item.opexBtcDeducted.toFixed(5)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400 text-sm">
                    +{item.netBtcCredited.toFixed(5)} BTC
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      {item.status}
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
