import { Money } from '../../lib/currency';
import { todayInTimezone } from '../../lib/dates';
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
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { InvestorOverviewMetrics, InvestorUser, InvestorTab } from '../../types';
import { ApiWithdrawalSettings } from '../../lib/api';

interface InvestorDashboardTabProps {
  metrics: InvestorOverviewMetrics;
  user: InvestorUser;
  withdrawalSettings: ApiWithdrawalSettings | null;
  onNavigateTab: (tab: InvestorTab) => void;
}

export const InvestorDashboardTab: React.FC<InvestorDashboardTabProps> = ({
  metrics,
  user,
  withdrawalSettings,
  onNavigateTab
}) => {
  const todayIso = todayInTimezone(user.platformTimezone);
  const isDateLocked = !!user.nextWithdrawalDate && todayIso < user.nextWithdrawalDate;
  const globallyDisabled = withdrawalSettings?.withdrawalsEnabled === false;

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* Top Banner / Welcome & Contract Status */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-ink-850 via-ink-850 to-ink-950 border border-line shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800/90 border border-line-warm text-xs font-mono">
                {metrics.totalBtcAllocated > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-fg-body">ALLOCATION ACTIVE:</span>
                    <span className="text-gold-500 font-bold">{metrics.totalBtcAllocated} BTC DEDICATED</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-ink-900" />
                    <span className="text-fg-muted">NO ACTIVE ALLOCATION YET</span>
                  </>
                )}
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono ${
                user.accountStatus === 'Active'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-gold-500/10 border-gold-500/30 text-gold-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${user.accountStatus === 'Active' ? 'bg-emerald-400' : 'bg-gold-400'}`} />
                <span className="font-bold">ACCOUNT: {user.accountStatus?.toUpperCase()}</span>
              </div>
              {(globallyDisabled || isDateLocked) && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="font-bold">
                    WITHDRAWALS: {globallyDisabled ? 'DISABLED' : `LOCKED UNTIL ${user.nextWithdrawalDate}`}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('wallet')}
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-black font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Withdraw / Manage BTC</span>
            </button>
            <button
              onClick={() => onNavigateTab('mining-performance')}
              className="px-4 py-2.5 rounded-xl bg-ink-800 hover:bg-ink-700 text-fg-body border border-line-warm font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {(globallyDisabled || isDateLocked) && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            {globallyDisabled
              ? 'Withdrawals are currently disabled by the administrator.'
              : <>Your withdrawals are locked until <strong>{user.nextWithdrawalDate}</strong>. You can request a withdrawal again after that date.</>}
          </span>
        </div>
      )}

      {/* Primary KPI Grid (Directly Answers: How is my investment performing?) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* 1. Total Investment */}
        <div className="p-4 sm:p-5 rounded-2xl bg-ink-850/90 border border-line text-white relative group hover:border-gold-700/60 transition-colors">
          <div className="text-[11px] font-mono text-fg-muted uppercase flex items-center justify-between">
            <span>Total Investment</span>
            <DollarSign className="w-4 h-4 text-fg-muted" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
            <Money usd={metrics.totalInvestmentUsd} />
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-1">
            Capital Deployed
          </div>
        </div>

        {/* 2. Current Portfolio Value */}
        <div className="p-4 sm:p-5 rounded-2xl bg-ink-850/90 border border-gold-500/30 text-white relative group shadow-lg shadow-gold-500/5">
          <div className="text-[11px] font-mono text-gold-500 uppercase flex items-center justify-between">
            <span>Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
            <Money usd={metrics.currentPortfolioValueUsd} />
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1 font-semibold flex items-center gap-1">
            <span>+<Money usd={(metrics.currentPortfolioValueUsd - metrics.totalInvestmentUsd)} /> (+{metrics.roiPercent}%)</span>
          </div>
        </div>

        {/* 3. Total BTC Allocated */}
        <div className="p-4 sm:p-5 rounded-2xl bg-ink-850/90 border border-line text-white relative group hover:border-gold-700/60 transition-colors">
          <div className="text-[11px] font-mono text-fg-muted uppercase flex items-center justify-between">
            <span>Total BTC Allocated</span>
            <Coins className="w-4 h-4 text-gold-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
            {metrics.totalBtcAllocated} BTC
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-1">
            ≈ <Money usd={(metrics.totalBtcAllocated * metrics.currentBtcPriceUsd)} />
          </div>
        </div>

        {/* 4. BTC Mined Lifetime */}
        <div className="p-4 sm:p-5 rounded-2xl bg-ink-850/90 border border-line text-white relative group hover:border-gold-700/60 transition-colors">
          <div className="text-[11px] font-mono text-fg-muted uppercase flex items-center justify-between">
            <span>Total BTC Mined</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1 tracking-tight font-mono">
            {metrics.btcMined} BTC
          </div>
          <div className="text-[11px] text-fg-muted font-mono mt-1">
            Completed mining credit records
          </div>
        </div>

      </div>

      {/* Secondary Metrics Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5 text-xs font-mono">
        
        <div className="p-3.5 rounded-xl bg-ink-850/80 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase">BTC Pending/Accrued</div>
          <div className="text-sm sm:text-base font-bold text-gold-500 mt-1">
            {metrics.btcPendingAccrued} BTC
          </div>
          <div className="text-[10px] text-fg-muted mt-0.5">Ready for next cycle</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-850/80 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase">Total Returns</div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            +<Money usd={metrics.totalReturnsUsd} />
          </div>
          <div className="text-[10px] text-fg-muted mt-0.5">Yield + Appreciation</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-850/80 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase">ROI Performance</div>
          <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
            +{metrics.roiPercent}%
          </div>
          <div className="text-[10px] text-fg-muted mt-0.5">{user.joiningDate ? `Since ${user.joiningDate}` : 'Awaiting confirmed joining date'}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-850/80 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase">Total Payouts</div>
          <div className="text-sm sm:text-base font-bold text-white mt-1">
            <Money usd={metrics.totalPayoutsUsd} />
          </div>
          <div className="text-[10px] text-fg-muted mt-0.5">({metrics.totalPayoutsBtc} BTC disbursed)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-ink-850/80 border border-line text-white">
          <div className="text-[10px] text-fg-muted uppercase">Next Payout</div>
          <div className="text-sm sm:text-base font-bold text-gold-200 mt-1">
            {metrics.nextExpectedPayoutBtc} BTC
          </div>
          <div className="text-[10px] text-fg-muted mt-0.5">Est. {metrics.nextExpectedPayoutDate}</div>
        </div>

      </div>

      {/* Operational Highlights & Quick Summary Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Performance Summary Card (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Investment & Hashrate Summary
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Recorded plan conditions
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-ink-950/70 border border-line">
              <div className="text-fg-muted text-[11px]">Investment Plan</div>
              <div className="text-white font-bold text-sm mt-0.5">{user.plan}</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-950/70 border border-line">
              <div className="text-fg-muted text-[11px]">Contract Duration</div>
              <div className="text-white font-bold text-sm mt-0.5">
                {user.planTerms ? `${user.planTerms.durationMonths}-Month Term` : 'Awaiting assigned plan'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-ink-950/70 border border-line">
              <div className="text-fg-muted text-[11px]">{user.planTerms ? 'Daily Plan Return (USD equivalent)' : 'Mining Credits Today'}</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5"><Money usd={user.planTerms ? metrics.totalInvestmentUsd * user.planTerms.dailyReturnPercent / 100 : metrics.miningRevenuePerDayUsd} />{user.planTerms ? ' / day' : ''}</div>
            </div>
            <div className="p-3 rounded-xl bg-ink-950/70 border border-line">
              <div className="text-fg-muted text-[11px]">Network Difficulty</div>
              <div className="text-white font-bold text-sm mt-0.5">{metrics.networkDifficulty}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-100/90 font-sans flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gold-100">Account records:</span> Your balances and earnings reflect recorded transactions. Fleet readings and production are shown above when the operator has supplied them.
            </div>
          </div>
        </div>

        {/* Right: Quick Action Shortcuts (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-ink-850/90 border border-line text-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <Award className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-bold uppercase tracking-wider font-mono">
                Investor Quick Navigation
              </span>
            </div>
            
            <div className="divide-y divide-line/80 mt-2">
              <button
                onClick={() => onNavigateTab('monthly-statements')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-fg-body hover:text-white group cursor-pointer"
              >
                <span>View Monthly Statements</span>
                <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-gold-500 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigateTab('earnings-history')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-fg-body hover:text-white group cursor-pointer"
              >
                <span>View Full Mining Earning Logs</span>
                <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-gold-500 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigateTab('reports')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-fg-body hover:text-white group cursor-pointer"
              >
                <span>View Investment Agreement</span>
                <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-gold-500 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigateTab('support')}
                className="w-full py-2.5 flex items-center justify-between text-xs text-fg-body hover:text-white group cursor-pointer"
              >
                <span>Contact Dedicated Relationship Manager</span>
                <ArrowRight className="w-3.5 h-3.5 text-fg-muted group-hover:text-gold-500 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] font-mono text-fg-muted text-center">
            Muscat MCT-01 Facility Node • SHA-256 Engine
          </div>
        </div>

      </div>

    </div>
  );
};
