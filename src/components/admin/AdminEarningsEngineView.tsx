import React, { useState } from 'react';
import {
  Cpu,
  Calculator,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Eye,
  Lock,
  Layers
} from 'lucide-react';
import { DailyCalculationRun } from '../../types';

interface AdminEarningsEngineViewProps {
  calculationRuns: DailyCalculationRun[];
  onTriggerCalculation?: () => void;
}

export const AdminEarningsEngineView: React.FC<AdminEarningsEngineViewProps> = ({
  calculationRuns: initialRuns,
  onTriggerCalculation
}) => {
  const [runs, setRuns] = useState<DailyCalculationRun[]>(initialRuns);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Live Engine parameters
  const [engineParams, setEngineParams] = useState({
    btcMinedToday: 1.4850,
    difficultyT: 84.65,
    networkHashrateEH: 635.4,
    powerTariffUsd: 0.042,
    managementFeePercent: 6.5,
    companyRetentionPercent: 12.0
  });

  const handleSimulateRun = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setShowPreviewModal(true);
    }, 800);
  };

  const handleApplyBatch = () => {
    const newRun: DailyCalculationRun = {
      id: `RUN-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      totalBtcMined: engineParams.btcMinedToday,
      networkDifficultyT: engineParams.difficultyT,
      networkHashrateEH: engineParams.networkHashrateEH,
      electricityCostUsd: 3120,
      managementFeesUsd: 1250,
      netDistributableBtc: 1.2950,
      investorsCreditedCount: 231,
      executionMode: 'Manual Override',
      executedBy: 'Gaurav K. Sharma (Super Admin)',
      executedAt: new Date().toLocaleTimeString(),
      status: 'Applied & Credited'
    };

    setRuns([newRun, ...runs]);
    setShowPreviewModal(false);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
    if (onTriggerCalculation) onTriggerCalculation();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AUTOMATED DAILY PRODUCTION LEDGER ENGINE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Earnings Calculation & Distribution Engine</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Calculates individual investor BTC entitlements from daily block payouts, handles OPEX deductions, and commits credits to investor wallets.
          </p>
        </div>

        <button
          onClick={handleSimulateRun}
          disabled={isSimulating}
          className="px-5 py-3 rounded-2xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Simulating Run...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Daily Calculation</span>
            </>
          )}
        </button>
      </div>

      {appliedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Success: Daily batch credited to 231 investor ledgers and logged to security audit trail.</span>
        </div>
      )}

      {/* Engine Parameters Card */}
      <div className="p-6 rounded-3xl bg-[#0F172A] border border-gray-800 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#F7931A]" />
          <span>Active Engine Mathematical Parameters (24-Hour Cycle)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase">Gross BTC Mined</div>
            <div className="text-base font-bold text-[#F7931A] mt-1">{engineParams.btcMinedToday} BTC</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase">Difficulty</div>
            <div className="text-base font-bold text-white mt-1">{engineParams.difficultyT} T</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase">Network Hashrate</div>
            <div className="text-base font-bold text-white mt-1">{engineParams.networkHashrateEH} EH/s</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase">Power Tariff</div>
            <div className="text-base font-bold text-emerald-400 mt-1">${engineParams.powerTariffUsd}/kWh</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase">Mgmt Fee</div>
            <div className="text-base font-bold text-white mt-1">{engineParams.managementFeePercent}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800">
            <div className="text-[10px] text-gray-400 uppercase">Company Retained</div>
            <div className="text-base font-bold text-purple-400 mt-1">{engineParams.companyRetentionPercent}%</div>
          </div>
        </div>
      </div>

      {/* Historical Runs Table */}
      <div className="rounded-3xl bg-[#0F172A] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase text-gray-300">
            Historical Calculation & Distribution Executions
          </h3>
          <span className="text-[11px] font-mono text-emerald-400">Automated Daily at 00:00 UTC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-900/40 text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-gray-800">
                <th className="py-3.5 px-4">Run ID & Date</th>
                <th className="py-3.5 px-3 text-right">Total BTC Mined</th>
                <th className="py-3.5 px-3 text-right">OPEX Deducted</th>
                <th className="py-3.5 px-3 text-right">Net Distributable BTC</th>
                <th className="py-3.5 px-3 text-center">Accounts Credited</th>
                <th className="py-3.5 px-3">Trigger Mode</th>
                <th className="py-3.5 px-3">Executed By</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 font-mono text-gray-300">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{run.id}</div>
                    <div className="text-[11px] text-gray-400">{run.date} • {run.executedAt}</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-[#F7931A]">
                    {run.totalBtcMined.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-right text-rose-400">
                    -${run.electricityCostUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-emerald-400">
                    +{run.netDistributableBtc.toFixed(4)} BTC
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      {run.investorsCreditedCount} Investors
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-300">{run.executionMode}</td>
                  <td className="py-3.5 px-3 text-gray-400">{run.executedBy}</td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {run.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Simulation Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0B1120] border border-gray-700 rounded-3xl shadow-2xl p-6 overflow-hidden space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#F7931A]" />
                <h3 className="text-lg font-bold text-white font-mono">Simulation Preview: Batch Distribution</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Gross 24-Hour Mining Production:</span>
                <span className="font-bold text-[#F7931A]">1.48500000 BTC</span>
              </div>
              <div className="flex items-center justify-between text-rose-400">
                <span>Power Tariff OPEX (13.6 MW @ $0.042/kWh):</span>
                <span>-0.12500000 BTC ($8,031 USD)</span>
              </div>
              <div className="flex items-center justify-between text-purple-400">
                <span>Corporate Management Retention:</span>
                <span>-0.06500000 BTC</span>
              </div>
              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-emerald-400 font-extrabold text-sm">
                <span>Net Credit To All 231 Active Investor Wallets:</span>
                <span>+1.29500000 BTC</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Applying this will immediately update balance ledgers and generate immutable audit logs.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBatch}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-bold font-mono text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Confirm & Credit Wallets
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
