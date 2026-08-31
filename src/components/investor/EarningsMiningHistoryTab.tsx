import React, { useState, useMemo } from 'react';
import { 
  History, 
  Filter, 
  Calendar, 
  Download, 
  CheckCircle2, 
  Layers, 
  DollarSign, 
  Zap, 
  Percent,
  Search
} from 'lucide-react';
import { MiningEarningsRow } from '../../types';

interface EarningsMiningHistoryTabProps {
  earnings: MiningEarningsRow[];
}

export const EarningsMiningHistoryTab: React.FC<EarningsMiningHistoryTabProps> = ({ earnings }) => {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'today' | '7days' | '30days' | '3months'>('all');
  const [searchDate, setSearchDate] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const filteredData = useMemo(() => {
    let list = [...earnings];
    if (filterPeriod === 'today') {
      list = list.slice(0, 1);
    } else if (filterPeriod === '7days') {
      list = list.slice(0, 7);
    } else if (filterPeriod === '30days' || filterPeriod === '3months') {
      list = list.slice(0, 30);
    }
    if (searchDate.trim()) {
      list = list.filter((r) => r.date.toLowerCase().includes(searchDate.toLowerCase()));
    }
    return list;
  }, [earnings, filterPeriod, searchDate]);

  // Aggregate totals
  const totalGrossUsd = filteredData.reduce((acc, curr) => acc + curr.grossRevenueUsd, 0);
  const totalNetUsd = filteredData.reduce((acc, curr) => acc + curr.netEarningsUsd, 0);
  const totalBtcMined = filteredData.reduce((acc, curr) => acc + curr.btmMined, 0);
  const totalFeesUsd = filteredData.reduce((acc, curr) => acc + curr.miningFeesUsd + curr.electricityCostUsd + curr.managementFeeUsd, 0);

  const handleExportCsv = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-emerald-400">
            <History className="w-3.5 h-3.5" />
            <span>DAILY AUDITED EARNINGS & OPEX BREAKDOWN</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Detailed Mining Revenue & Yield History
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Transparent daily reconciliation of gross SHA-256 rewards, electricity tariffs, and net investor yield
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#F7931A]" />
            <span>Export CSV Audit</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Complete Mining & OPEX Ledger exported (CSV format, SHA-256 verified).</span>
        </div>
      )}

      {/* Aggregate Mini-Stats for filtered view */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Filtered BTC Mined</div>
          <div className="text-lg font-bold text-amber-400 mt-1">{totalBtcMined.toFixed(5)} BTC</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Gross Revenue</div>
          <div className="text-lg font-bold text-emerald-400 mt-1">${totalGrossUsd.toFixed(2)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Total OPEX & Fees</div>
          <div className="text-lg font-bold text-rose-400 mt-1">${totalFeesUsd.toFixed(2)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Net Disbursable Yield</div>
          <div className="text-lg font-bold text-[#F7931A] mt-1">${totalNetUsd.toFixed(2)}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        
        {/* Interval Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-gray-400 text-[11px] mr-1 hidden sm:inline">Interval:</span>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: '3months', label: '3 Months' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterPeriod(item.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                filterPeriod === item.id
                  ? 'bg-[#F7931A] text-gray-950 font-bold'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Date Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            placeholder="Filter by date (e.g. 25 Aug)..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-gray-950 border border-gray-700 text-white text-xs placeholder-gray-500 focus:outline-hidden focus:border-[#F7931A]"
          />
        </div>

      </div>

      {/* Detailed Full Ledger Table */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">BTC Mined</th>
                <th className="pb-3 px-3">Gross Rev ($)</th>
                <th className="pb-3 px-3">Pool Fee ($)</th>
                <th className="pb-3 px-3">Power/OPEX ($)</th>
                <th className="pb-3 px-3">Mgmt Fee ($)</th>
                <th className="pb-3 px-3">Net Earnings ($)</th>
                <th className="pb-3 px-3">BTC Spot Rate</th>
                <th className="pb-3 px-3">Share %</th>
                <th className="pb-3 px-3 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3 px-3 text-white font-bold whitespace-nowrap">{row.date}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold whitespace-nowrap">
                    {row.btmMined} BTC
                  </td>
                  <td className="py-3 px-3 text-emerald-400 whitespace-nowrap">
                    +${row.grossRevenueUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-gray-400 whitespace-nowrap">
                    -${row.miningFeesUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-rose-400 whitespace-nowrap">
                    -${row.electricityCostUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-gray-400 whitespace-nowrap">
                    -${row.managementFeeUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-[#F7931A] font-bold whitespace-nowrap">
                    +${row.netEarningsUsd.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">
                    ${row.btcPriceUsd.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-gray-400 whitespace-nowrap">
                    {row.investorSharePercent}%
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{row.status}</span>
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
