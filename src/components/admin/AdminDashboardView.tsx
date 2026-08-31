import React from 'react';
import {
  Users,
  DollarSign,
  Zap,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Server,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  FileText
} from 'lucide-react';
import { AdminDashboardKpis, MiningFacilityItem, AdminTab } from '../../types';

interface AdminDashboardViewProps {
  kpis: AdminDashboardKpis;
  facilities: MiningFacilityItem[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenPayoutModal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  kpis,
  facilities,
  onNavigateTab,
  onOpenPayoutModal
}) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Welcome & Summary Header */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-gray-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-[#F7931A]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>EXECUTIVE CONTROL CENTER • SULTANATE OF OMAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Finovatech Mining Operations & Finance
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
              Consolidated overview of 1,220 enterprise ASIC units across Muscat (MCT-01) & Salalah (SLL-02), real-time investor ledgers, and SHA-256 production.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('production-ledger')}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-semibold font-mono flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Daily Production Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('payout-queue')}
              className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 text-xs font-bold font-mono flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Review Payouts ({kpis.pendingPayoutBtc} BTC)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 13 KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
            Executive Key Performance Indicators (KPIs)
          </h3>
          <span className="text-[11px] font-mono text-gray-500">Live 10-Second Telemetry Sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Total Investors */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Total Investors</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{kpis.totalInvestors}</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <span className="font-semibold">{kpis.activeInvestors} Active</span> (93%)
            </div>
          </div>

          {/* Total Investment */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Total Investment</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              ${(kpis.totalInvestmentUsd / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Allocated: {kpis.totalBtcAllocated} BTC
            </div>
          </div>

          {/* BTC Mined */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Total BTC Mined</span>
              <span className="w-4 h-4 rounded-full bg-[#F7931A] text-gray-950 font-black text-[10px] flex items-center justify-center">₿</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono text-[#F7931A]">
              {kpis.totalBtcMined.toFixed(2)} BTC
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              ≈ ${(kpis.totalBtcMined * kpis.spotBtcPriceUsd / 1000000).toFixed(2)}M USD
            </div>
          </div>

          {/* BTC Paid Out */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">BTC Paid Out</span>
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {kpis.totalBtcPaidOut.toFixed(2)} BTC
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              100% On-Time SLA
            </div>
          </div>

          {/* Pending Payout */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Pending Payout</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
              {kpis.pendingPayoutBtc.toFixed(2)} BTC
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Next Batch: Today 14:00
            </div>
          </div>

          {/* Fleet Hashrate */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Fleet Hashrate</span>
              <Zap className="w-4 h-4 text-[#F7931A]" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {kpis.miningHashratePH} PH/s
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              Peak: 432.4 PH/s
            </div>
          </div>

          {/* Active Miners */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Miners Online</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {kpis.minersOnline} <span className="text-xs text-gray-500 font-normal">/ {kpis.totalMiners}</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              97.1% Fleet Online
            </div>
          </div>

          {/* Mining Uptime */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Mining Uptime</span>
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
              {kpis.miningUptimePercent}%
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Immersion Protected
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Monthly Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              ${kpis.monthlyRevenueUsd.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              +14.2% MoM
            </div>
          </div>

          {/* Monthly Cost */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Monthly OPEX</span>
              <DollarSign className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              ${kpis.monthlyCostUsd.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Tariff: $0.042/kWh
            </div>
          </div>

          {/* Net Profit */}
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-colors col-span-2 sm:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs font-medium">Net Monthly Revenue</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">50.2% MARGIN</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              ${kpis.netProfitUsd.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-1">
              Mining Revenue minus OPEX minus Fees
            </div>
          </div>

        </div>
      </div>

      {/* Facilities Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
            Mining Infrastructure Fleet Sites
          </h3>
          <button
            onClick={() => onNavigateTab('mining-farms')}
            className="text-xs font-mono text-[#F7931A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Infrastructure Details</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 hover:border-gray-700 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white">{fac.name}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                      {fac.code}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{fac.location} • {fac.coolingType}</div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{fac.status}</span>
                </div>
              </div>

              {/* Facility Metrics Matrix */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800/80 text-center font-mono">
                <div className="p-2 rounded-xl bg-gray-900/80">
                  <div className="text-[10px] text-gray-400 uppercase">Miners</div>
                  <div className="text-sm font-bold text-white mt-0.5">{fac.onlineMiners}/{fac.totalMiners}</div>
                </div>
                <div className="p-2 rounded-xl bg-gray-900/80">
                  <div className="text-[10px] text-gray-400 uppercase">Hashrate</div>
                  <div className="text-sm font-bold text-[#F7931A] mt-0.5">{fac.hashratePH} PH/s</div>
                </div>
                <div className="p-2 rounded-xl bg-gray-900/80">
                  <div className="text-[10px] text-gray-400 uppercase">Power Draw</div>
                  <div className="text-sm font-bold text-white mt-0.5">{fac.powerConsumptionMW} MW</div>
                </div>
                <div className="p-2 rounded-xl bg-gray-900/80">
                  <div className="text-[10px] text-gray-400 uppercase">Uptime</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">{fac.uptimePercent}%</div>
                </div>
              </div>

              {/* Daily & Monthly Production */}
              <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-xl bg-gray-900/60 border border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">BTC Today:</span>
                  <span className="text-white font-bold">{fac.btcToday} BTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">BTC Month:</span>
                  <span className="text-[#F7931A] font-bold">{fac.btcThisMonth} BTC</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Operations Action Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Pending Action Box 1: Payout Approvals */}
        <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Pending Payout Queue
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
              2 Pending
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Total 1.82 BTC in scheduled withdrawals awaiting final multi-sig confirmation.
          </p>
          <button
            onClick={() => onNavigateTab('payout-queue')}
            className="w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-gray-700"
          >
            <span>Open Payout Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pending Action Box 2: KYC Queue */}
        <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Compliance & KYC Queue
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
              2 Submissions
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Marcus Vance & Elena Rostova passport & utility bills submitted for verification.
          </p>
          <button
            onClick={() => onNavigateTab('kyc-queue')}
            className="w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-gray-700"
          >
            <span>Review KYC Submissions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pending Action Box 3: Statement Generator */}
        <div className="p-5 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> Monthly Statements
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              August 2026 Ready
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Batch statement reconciliation ready for all 248 registered investor accounts.
          </p>
          <button
            onClick={() => onNavigateTab('monthly-statements')}
            className="w-full py-2 px-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-gray-700"
          >
            <span>Generate & Publish Batch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
