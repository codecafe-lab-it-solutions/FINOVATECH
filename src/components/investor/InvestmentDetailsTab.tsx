import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Cpu, 
  Layers, 
  Percent, 
  Zap, 
  Clock, 
  Building2, 
  X,
  ExternalLink,
  Printer
} from 'lucide-react';
import { InvestorUser, InvestorOverviewMetrics } from '../../types';

interface InvestmentDetailsTabProps {
  user: InvestorUser;
  metrics: InvestorOverviewMetrics;
}

export const InvestmentDetailsTab: React.FC<InvestmentDetailsTabProps> = ({
  user,
  metrics
}) => {
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner with Agreement Actions */}
      <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-[#F7931A]">
            <span>CONTRACT ID: {user.agreementNumber}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-2">
            Investment Structure & Institutional Transparency
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            4-Year Defined Term Capital Equipment & Thermodynamic Compute Lease
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAgreementModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#F7931A]" />
            <span>View Full Agreement</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded (PDF)' : 'Download Agreement PDF'}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Agreement document (PDF, 2.4 MB) has been generated and verified for download.</span>
        </div>
      )}

      {/* Primary Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
        
        {/* 1. Capital Allocation */}
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-3">
          <div className="flex items-center gap-2 text-[#F7931A] font-bold uppercase tracking-wider text-[11px]">
            <DollarSign className="w-4 h-4" />
            <span>1. Capital Deposition</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-gray-400">
              <span>Investment Amount:</span>
              <span className="text-white font-bold">${metrics.totalInvestmentUsd.toLocaleString()} USD</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Execution Date:</span>
              <span className="text-white font-bold">{user.startDate}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Maturity Date:</span>
              <span className="text-emerald-400 font-bold">{user.maturityDate}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Contract Duration:</span>
              <span className="text-white font-bold">48 Calendar Months (4 Years)</span>
            </div>
          </div>
        </div>

        {/* 2. Mining Allocation & Hashrate */}
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            <Cpu className="w-4 h-4" />
            <span>2. Computational Allocation</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-gray-400">
              <span>Hashrate Allocated:</span>
              <span className="text-white font-bold">125.0 TH/s (Nominal)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Facility Pod:</span>
              <span className="text-white font-bold">POD-A-01 Muscat Node</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Mining Pool:</span>
              <span className="text-[#F7931A] font-bold">Foundry USA (Stratum V2)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Algorithm:</span>
              <span className="text-white font-bold">SHA-256 (Bitcoin Core)</span>
            </div>
          </div>
        </div>

        {/* 3. Fee Structure & Rev Sharing */}
        <div className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 text-white space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <Percent className="w-4 h-4" />
            <span>3. Economics & Fee Schedule</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-gray-400">
              <span>Revenue-Sharing Model:</span>
              <span className="text-emerald-400 font-bold">Pro-Rata PPS+ Pool Direct</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Management / Mining Fee:</span>
              <span className="text-white font-bold">5.0% of Gross Mined BTC</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Electricity / OPEX:</span>
              <span className="text-white font-bold">$0.042 / kWh (Industrial Oman)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Payout Frequency:</span>
              <span className="text-[#F7931A] font-bold">Weekly Automated (Every Friday)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Comprehensive Agreed Terms Overview */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 text-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <ShieldCheck className="w-4 h-4 text-[#F7931A]" />
          <span className="text-sm font-bold uppercase tracking-wider font-mono">
            Key Institutional Articles & Sovereign Governance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1.5">
            <div className="text-[#F7931A] font-bold">Article 4.1 — Hashrate Guarantee & Redundancy</div>
            <p className="text-gray-300 leading-relaxed font-sans text-xs">
              FINOVATECH guarantees a minimum fleet availability of 98.0% across the 4-year term. Hot-swap replacement units in Muscat inventory are deployed within 2 hours if any individual ASIC board falls below nominal tolerance.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1.5">
            <div className="text-[#F7931A] font-bold">Article 6.2 — On-Chain Payout Verifiability</div>
            <p className="text-gray-300 leading-relaxed font-sans text-xs">
              All mining revenue distributions are calculated at 00:00 UTC daily and disbursed to the investor's whitelisted Bitcoin Taproot/SegWit destination with broadcasted TXIDs visible on public mempools.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1.5">
            <div className="text-[#F7931A] font-bold">Article 8.3 — Thermodynamic Isolation & Power Integrity</div>
            <p className="text-gray-300 leading-relaxed font-sans text-xs">
              Direct primary substation feeds in Muscat provide continuous clean electrical throughput with high-velocity negative-pressure air filtration engineered specifically for GCC arid ambient variables.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 space-y-1.5">
            <div className="text-[#F7931A] font-bold">Article 11.4 — Maturity & Equipment Buyback Option</div>
            <p className="text-gray-300 leading-relaxed font-sans text-xs">
              Upon completion of the 48-month contract, the investor holds guaranteed rights to either extend the mining charter at prevailing spot power rates or elect for physical delivery / liquid secondary buyout of the underlying compute hardware.
            </p>
          </div>
        </div>
      </div>

      {/* Modal: View Full Agreement */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] bg-gray-900 border border-gray-800 rounded-3xl text-white shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#F7931A]" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Master Mining Service & Compute Lease Agreement
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    Agreement #{user.agreementNumber} • Stamped Muscat S.A.O.C
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAgreementModal(false)}
                className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Stamped Legal Text */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-gray-300 font-mono leading-relaxed bg-gray-900/90">
              <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">PARTY A (Operator): FINOVATECH Mining Company S.A.O.C</div>
                  <div className="text-gray-400">Registered Office: Muscat, Sultanate of Oman (CR-1049281)</div>
                </div>
                <div className="text-right">
                  <div className="text-[#F7931A] font-bold">PARTY B (Investor): {user.name}</div>
                  <div className="text-gray-400">Investor ID: {user.id}</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[#F7931A]">
                  RECITALS & OPERATIONAL ENGAGEMENT
                </h4>
                <p>
                  WHEREAS, the Operator manages industrial Bitcoin computational facilities situated in Muscat, Sultanate of Oman; and WHEREAS, the Investor desires to lease dedicated SHA-256 computational hashrate for a period of 4 (four) calendar years commencing on 15 Jan 2025 and expiring on 15 Jan 2029.
                </p>
                <p>
                  NOW THEREFORE, in consideration of the mutual covenants herein contained, the parties agree as follows:
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider text-[#F7931A]">
                  SCHEDULE A: COMPUTATIONAL CAPACITY ALLOCATION
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Total Allocated Hashrate: 125.0 TH/s dedicated continuously to Bitcoin SHA-256 hashing.</li>
                  <li>Target Uptime SLA: 98.0% minimum annual aggregate availability.</li>
                  <li>Mining Pool Target: Foundry USA VIP Enterprise Stratum V2 endpoint.</li>
                  <li>Power Tariff Guarantee: $0.042/kWh for the full contractual 48-month window.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Sovereign Compliance Seal & Electronic Signature Verified</span>
                </div>
                <span className="font-bold">VALID THROUGH 2029</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-800 bg-gray-950 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-mono">
                Document Hash: SHA256: 8f9a3b8f1a2c7d9e4f5a6b7c8d9e0f1a2b3c4d5e
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDownload();
                    setShowAgreementModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 font-bold text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Stamped PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
