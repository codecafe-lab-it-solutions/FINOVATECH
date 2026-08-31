import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Coins, 
  Calendar, 
  Clock, 
  Cpu, 
  Percent, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Activity,
  Award,
  Wallet,
  ArrowRight
} from 'lucide-react';
import { InvestorOverviewMetrics, InvestorUser, InvestorTab } from '../../types';

interface InvestorDashboardTabProps {
  metrics: InvestorOverviewMetrics;
  user: InvestorUser;
  onNavigateTab: (tab: InvestorTab) => void;
}

export const InvestorDashboardTab: React.FC<InvestorDashboardTabProps> = ({
  metrics,
  user,
  onNavigateTab
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner / Welcome & Contract Status */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F7931A]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/90 border border-gray-700 text-xs font-mono">
              {metrics.totalBtcAllocated > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-gray-300">ALLOCATION ACTIVE:</span>
                  <span className="text-[#F7931A] font-bold">{metrics.totalBtcAllocated} BTC DEDICATED</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-gray-400">NO ACTIVE ALLOCATION YET</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 font-mono">
              {metrics.totalBtcAllocated > 0
                ? `Contract #${user.agreementNumber} • Active Term: ${user.startDate} – ${user.maturityDate}`
                : 'No active investment contract yet — an allocation will appear here once your account is funded.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('wallet')}
              className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Withdraw / Manage BTC</span>
            </button>
            <button
              onClick={() => onNavigateTab('mining-performance')}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (Directly Answers: How is my investment performing?) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* 1. Total Investment */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white relative group hover:border-gray-700 transition-colors">
          <div className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
            <span>Total Investment</span>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
            ${metrics.totalInvestmentUsd.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-1">
            Capital Deployed
          </div>
        </div>

        {/* 2. Current Portfolio Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/90 border border-[#F7931A]/30 text-white relative group shadow-lg shadow-[#F7931A]/5">
          <div className="text-[11px] font-mono text-[#F7931A] uppercase flex items-center justify-between">
            <span>Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-[#F7931A]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
            ${metrics.currentPortfolioValueUsd.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 font-semibold flex items-center gap-1">
            <span>+${(metrics.currentPortfolioValueUsd - metrics.totalInvestmentUsd).toLocaleString()} (+{metrics.roiPercent}%)</span>
          </div>
        </div>

        {/* 3. Total BTC Allocated */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white relative group hover:border-gray-700 transition-colors">
          <div className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
            <span>Total BTC Allocated</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
            {metrics.totalBtcAllocated} BTC
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-1">
            ≈ ${(metrics.totalBtcAllocated * metrics.currentBtcPriceUsd).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
          </div>
        </div>

        {/* 4. BTC Mined Lifetime */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white relative group hover:border-gray-700 transition-colors">
          <div className="text-[11px] font-mono text-gray-400 uppercase flex items-center justify-between">
            <span>Total BTC Mined</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight font-mono">
            {metrics.btcMined} BTC
          </div>
          <div className="text-[11px] text-gray-400 font-mono mt-1">
            Accrued via SHA-256
          </div>
        </div>

      </div>

      {/* Secondary Metrics Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 text-xs font-mono">
        
        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">BTC Pending/Accrued</div>
          <div className="text-sm sm:text-base font-bold text-[#F7931A] mt-1">
            {metrics.btcPendingAccrued} BTC
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Ready for next cycle</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Total Returns</div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            +${metrics.totalReturnsUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Yield + Appreciation</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">ROI Performance</div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            +{metrics.roiPercent}%
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Since Jan 2025</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Total Payouts</div>
          <div className="text-sm sm:text-base font-bold text-white mt-1">
            ${metrics.totalPayoutsUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">({metrics.totalPayoutsBtc} BTC disbursed)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Next Payout</div>
          <div className="text-sm sm:text-base font-bold text-amber-400 mt-1">
            {metrics.nextExpectedPayoutBtc} BTC
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Est. {metrics.nextExpectedPayoutDate}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-900/80 border border-gray-800 text-white">
          <div className="text-[10px] text-gray-400 uppercase">Mining Share %</div>
          <div className="text-sm sm:text-base font-bold text-[#F7931A] mt-1">
            {metrics.yourMiningSharePercent}%
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">Muscat Pod Allocation</div>
        </div>

      </div>

      {/* Operational Highlights & Quick Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Performance Summary Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Investment & Hashrate Summary
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              99.8% Uptime Target
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
              <div className="text-gray-400 text-[11px]">Investment Plan</div>
              <div className="text-white font-bold text-sm mt-0.5">{user.plan}</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
              <div className="text-gray-400 text-[11px]">Contract Duration</div>
              <div className="text-white font-bold text-sm mt-0.5">
                {metrics.totalBtcAllocated > 0 ? '4-Year Defined Term Lease' : 'N/A — no active contract'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
              <div className="text-gray-400 text-[11px]">Daily Mining Revenue</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">${metrics.miningRevenuePerDayUsd} / day</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800">
              <div className="text-gray-400 text-[11px]">Network Difficulty</div>
              <div className="text-white font-bold text-sm mt-0.5">{metrics.networkDifficulty}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 font-sans flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#F7931A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Audited Telemetry:</span> Your computational nodes are monitored 24/7 at the Muscat MCT-01 facility with automated sensor streams balancing temperature, voltage, and hash rate.
            </div>
          </div>
        </div>

        {/* Right: Quick Action Shortcuts (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Award className="w-4 h-4 text-[#F7931A]" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Investor Quick Navigation
              </span>
            </div>
            
            <div className="divide-y divide-gray-800/80 mt-2">
              <button
                onClick={() => onNavigateTab('monthly-statements')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-gray-300 hover:text-white group cursor-pointer"
              >
                <span>Download August 2026 Statement</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#F7931A] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigateTab('earnings-history')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-gray-300 hover:text-white group cursor-pointer"
              >
                <span>View Full Mining Earning Logs</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#F7931A] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-gray-300 hover:text-white group cursor-pointer"
              >
                <span>View Stamped 4-Year Lease Agreement</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#F7931A] transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigateTab('support')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-gray-300 hover:text-white group cursor-pointer"
              >
                <span>Contact Dedicated Relationship Manager</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#F7931A] transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] font-mono text-gray-400 text-center">
            Muscat MCT-01 Facility Node • SHA-256 Engine
          </div>
        </div>

      </div>

    </div>
  );
};
