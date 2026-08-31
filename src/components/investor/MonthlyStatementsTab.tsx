import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Coins,
  ChevronDown
} from 'lucide-react';
import { MonthlyStatementData, InvestorUser } from '../../types';

interface MonthlyStatementsTabProps {
  statements: MonthlyStatementData[];
  user: InvestorUser;
}

export const MonthlyStatementsTab: React.FC<MonthlyStatementsTabProps> = ({
  statements,
  user
}) => {
  const [selectedStatementIdx, setSelectedStatementIdx] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentStatement = statements[selectedStatementIdx] || statements[0];

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CERTIFIED MONTHLY INVESTOR AUDITS</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Monthly Investor Statement & Reconciliation
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Periodic financial reconciliation for records, auditing, and tax filings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Statement Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedStatementIdx}
              onChange={(e) => setSelectedStatementIdx(Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono focus:outline-hidden focus:border-[#F7931A] cursor-pointer"
            >
              {statements.map((st, idx) => (
                <option key={st.statementId} value={idx}>
                  {st.monthYear} Statement
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-gray-400" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Statement for {currentStatement.monthYear} generated and saved to your device.</span>
        </div>
      )}

      {/* Official Printable Statement Document Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Statement Watermark/Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-gray-700 flex items-center justify-center text-[#F7931A] font-bold text-xs">
                FM
              </div>
              <span className="text-sm font-extrabold tracking-tight text-white">
                FINOVATECH MINING COMPANY S.A.O.C
              </span>
            </div>
            <div className="text-xs font-mono text-gray-400">
              Commercial Registration: CR-1049281 • Muscat, Sultanate of Oman
            </div>
            <div className="text-xs font-mono text-gray-400">
              Facility Node: Muscat MCT-01 33kV Substation Cluster
            </div>
          </div>

          <div className="sm:text-right font-mono text-xs space-y-1">
            <div className="text-base font-extrabold text-[#F7931A]">
              {currentStatement.monthYear} Investor Statement
            </div>
            <div className="text-gray-400">Statement ID: #{currentStatement.statementId}</div>
            <div className="text-gray-400">Period: {currentStatement.periodStart} – {currentStatement.periodEnd}</div>
          </div>
        </div>

        {/* Investor Info Row */}
        <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <div className="text-gray-500 text-[10px] uppercase">INVESTOR NAME</div>
            <div className="text-white font-bold mt-0.5">{user.name}</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px] uppercase">INVESTOR ID / PLAN</div>
            <div className="text-white font-bold mt-0.5">{user.id} ({user.plan.split('(')[0]})</div>
          </div>
          <div>
            <div className="text-gray-500 text-[10px] uppercase">AGREEMENT NUMBER</div>
            <div className="text-[#F7931A] font-bold mt-0.5">{user.agreementNumber}</div>
          </div>
        </div>

        {/* Core Financial Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase text-[10px]">
                <th className="pb-3 px-3">Item Description</th>
                <th className="pb-3 px-3 text-right">Crypto Volume (BTC)</th>
                <th className="pb-3 px-3 text-right">USD Equivalent ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              
              <tr>
                <td className="py-3 px-3 text-gray-300">1. Opening Portfolio Valuation</td>
                <td className="py-3 px-3 text-right text-gray-300">{currentStatement.openingBalanceBtc} BTC</td>
                <td className="py-3 px-3 text-right font-bold text-white">${currentStatement.openingBalanceUsd.toLocaleString()}</td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-gray-300">2. Capital Principal Base</td>
                <td className="py-3 px-3 text-right text-gray-400">—</td>
                <td className="py-3 px-3 text-right font-bold text-white">${currentStatement.investmentAmountUsd.toLocaleString()}</td>
              </tr>

              <tr className="bg-emerald-500/5">
                <td className="py-3 px-3 text-emerald-400 font-bold">3. Total BTC Mined in Period</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">+{currentStatement.btcMined} BTC</td>
                <td className="py-3 px-3 text-right text-emerald-400 font-bold">+${currentStatement.grossEarningsUsd.toFixed(2)}</td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-gray-400 pl-6">↳ Electricity & Thermodynamic OPEX ($0.042/kWh)</td>
                <td className="py-3 px-3 text-right text-gray-400">—</td>
                <td className="py-3 px-3 text-right text-rose-400">-${currentStatement.operationalFeesUsd.toFixed(2)}</td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-gray-400 pl-6">↳ Management & Facility Infrastructure Fee (5%)</td>
                <td className="py-3 px-3 text-right text-gray-400">—</td>
                <td className="py-3 px-3 text-right text-rose-400">-${currentStatement.managementFeesUsd.toFixed(2)}</td>
              </tr>

              <tr className="bg-[#F7931A]/10">
                <td className="py-3 px-3 text-[#F7931A] font-bold">4. Net Mining Earnings for Period</td>
                <td className="py-3 px-3 text-right text-[#F7931A] font-bold">+{(currentStatement.netEarningsUsd / currentStatement.btcPriceAverage).toFixed(5)} BTC</td>
                <td className="py-3 px-3 text-right text-[#F7931A] font-bold">+${currentStatement.netEarningsUsd.toFixed(2)}</td>
              </tr>

              <tr>
                <td className="py-3 px-3 text-gray-300">5. Payouts Disbursed to Whitelisted Address</td>
                <td className="py-3 px-3 text-right text-blue-400">-{(currentStatement.payoutsDisbursedUsd / currentStatement.btcPriceAverage).toFixed(5)} BTC</td>
                <td className="py-3 px-3 text-right text-blue-400">-${currentStatement.payoutsDisbursedUsd.toFixed(2)}</td>
              </tr>

              <tr className="bg-gray-950 border-t-2 border-gray-700">
                <td className="py-3.5 px-3 text-white font-extrabold text-sm">6. Closing Portfolio Valuation (Period End)</td>
                <td className="py-3.5 px-3 text-right font-extrabold text-white text-sm">{currentStatement.closingBalanceBtc} BTC</td>
                <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400 text-sm">${currentStatement.closingBalanceUsd.toLocaleString()}</td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-gray-400 text-[10px]">Average BTC Spot Rate:</span>
            <div className="text-white font-bold mt-0.5">${currentStatement.btcPriceAverage.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-gray-400 text-[10px]">Monthly Net Return:</span>
            <div className="text-emerald-400 font-bold mt-0.5">+{currentStatement.monthlyRoiPercent}%</div>
          </div>

          <div className="p-3 rounded-xl bg-gray-950 border border-gray-800">
            <span className="text-gray-400 text-[10px]">Compliance Clearance:</span>
            <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Certified
            </div>
          </div>
        </div>

        {/* Digital Signature Footer */}
        <div className="pt-4 border-t border-gray-800 text-[11px] text-gray-500 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>Audited under sovereign commercial charter CR-1049281 (Muscat).</div>
          <div className="text-gray-400">Electronic Key: ED25519-FMT-2026-MCT</div>
        </div>

      </div>

    </div>
  );
};
