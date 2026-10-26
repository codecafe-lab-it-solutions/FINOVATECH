import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Wind, 
  Gauge, 
  Network, 
  Lock,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const InfrastructureArchitectureCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'computing' | 'energy' | 'governance'>('computing');

  return (
    <div className="w-full max-w-lg mx-auto lg:max-w-none">
      
      {/* Main Glassmorphic Institutional Architecture Container */}
      <div className="relative rounded-3xl bg-ink-900 border border-line p-6 sm:p-7 shadow-2xl text-white overflow-hidden transition-all duration-300">
        
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header & Node Identification */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-line/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ink-850 border border-line-warm flex items-center justify-center text-gold-500 shadow-inner">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-fg-muted font-semibold flex items-center gap-2">
                <span>FACILITY NODE MCT-01</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-fg-body mt-0.5">
                Industrial Bitcoin Infrastructure
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/70 text-emerald-400 text-xs font-mono font-medium">
            <span>SHA-256 ACTIVE</span>
          </div>
        </div>

        {/* Interactive Architecture Selector Tabs */}
        <div className="relative z-10 grid grid-cols-3 gap-1.5 p-1 bg-ink-850/90 rounded-xl border border-line my-5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('computing')}
            className={`py-2 px-2.5 rounded-lg text-center font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'computing'
                ? 'bg-gold-500 text-black shadow-md font-bold'
                : 'text-fg-muted hover:text-fg-body hover:bg-ink-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="truncate">Computing</span>
          </button>

          <button
            onClick={() => setActiveTab('energy')}
            className={`py-2 px-2.5 rounded-lg text-center font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'energy'
                ? 'bg-gold-500 text-black shadow-md font-bold'
                : 'text-fg-muted hover:text-fg-body hover:bg-ink-800/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate">Power Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`py-2 px-2.5 rounded-lg text-center font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'governance'
                ? 'bg-gold-500 text-black shadow-md font-bold'
                : 'text-fg-muted hover:text-fg-body hover:bg-ink-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="truncate">Standards</span>
          </button>
        </div>

        {/* Tab 1: High-Density Computing Topology */}
        {activeTab === 'computing' && (
          <div className="relative z-10 space-y-4">
            
            {/* Visual Container Pod Schematic Box */}
            <div className="p-4 rounded-2xl bg-ink-950/90 border border-line/90 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted">
                <span className="flex items-center gap-1.5 text-fg-body">
                  <Layers className="w-3.5 h-3.5 text-gold-500" />
                  Modular Containerized Enclosure
                </span>
                <span className="text-emerald-400 font-semibold">100% Operational</span>
              </div>

              {/* Racks Graphic Visualization */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((rack) => (
                  <div 
                    key={rack} 
                    className="p-2.5 rounded-xl bg-ink-850/90 border border-line flex flex-col items-center justify-between text-center group hover:border-gold-500/50 transition-colors"
                  >
                    <div className="text-[10px] font-mono text-fg-muted font-semibold mb-1.5">
                      RACK-0{rack}
                    </div>
                    {/* Simulated ASIC Hashboards */}
                    <div className="w-full space-y-1 my-1">
                      <div className="h-1.5 w-full bg-emerald-500/80 rounded-xs" />
                      <div className="h-1.5 w-full bg-emerald-500/80 rounded-xs" />
                      <div className="h-1.5 w-full bg-gold-500 rounded-xs" />
                      <div className="h-1.5 w-full bg-gold-400/80 rounded-xs" />
                    </div>
                    <div className="text-[9px] font-mono text-fg-muted mt-1">
                      112 TH/s
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted pt-1 border-t border-line">
                <span>Thermal Aisle Isolation</span>
                <span className="text-fg-body">Negative Pressure Exhaust</span>
              </div>
            </div>

            {/* Compute Highlights Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-ink-850/70 border border-line">
                <div className="text-fg-muted text-[10px] uppercase">Consensus Layer</div>
                <div className="text-sm font-bold text-white mt-0.5">Bitcoin Core L1</div>
                <div className="text-[10px] text-fg-muted mt-1">Direct Stratum Protocol</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-850/70 border border-line">
                <div className="text-fg-muted text-[10px] uppercase">Telemetry Latency</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">&lt; 1.2ms RTT</div>
                <div className="text-[10px] text-fg-muted mt-1">Direct Fiber Uplink</div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Energy & Substation Topology */}
        {activeTab === 'energy' && (
          <div className="relative z-10 space-y-4">
            
            <div className="p-4 rounded-2xl bg-ink-950/90 border border-line/90 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted">
                <span className="flex items-center gap-1.5 text-fg-body">
                  <Gauge className="w-3.5 h-3.5 text-gold-200" />
                  Electrical Distribution
                </span>
                <span className="text-gold-200 font-semibold">Substation Feed</span>
              </div>

              {/* Power Distribution Diagram */}
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-ink-850/90 border border-line">
                  <span className="text-fg-body">Primary Interconnect</span>
                  <span className="text-white font-bold">33 kV Step-Down</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-ink-850/90 border border-line">
                  <span className="text-fg-body">Power Factor Efficiency</span>
                  <span className="text-emerald-400 font-bold">0.985 Active</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-ink-850/90 border border-line">
                  <span className="text-fg-body">Load Modulation</span>
                  <span className="text-gold-500 font-bold">Continuous Curtailment</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-fg-muted pt-1 border-t border-line">
                <span>Energy Source</span>
                <span className="text-fg-body">Industrial Grid + Sovereign Capacity</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-ink-850/70 border border-line">
                <div className="text-fg-muted text-[10px] uppercase">Thermal Target</div>
                <div className="text-sm font-bold text-white mt-0.5">Delta T 14.2°C</div>
                <div className="text-[10px] text-fg-muted mt-1">Controlled Airflow</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-850/70 border border-line">
                <div className="text-fg-muted text-[10px] uppercase">Power Utilization</div>
                <div className="text-sm font-bold text-gold-200 mt-0.5">PUE ~ 1.12</div>
                <div className="text-[10px] text-fg-muted mt-1">High-Efficiency Fans</div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Institutional Standards & Governance */}
        {activeTab === 'governance' && (
          <div className="relative z-10 space-y-4">
            
            <div className="p-4 rounded-2xl bg-ink-950/90 border border-line/90 space-y-2.5">
              <div className="text-xs font-mono font-semibold text-fg-body flex items-center gap-1.5 mb-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Institutional Compliance Framework
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-ink-850/80 border border-line">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-fg-body font-semibold">4-Year Defined Term Charter</div>
                    <div className="text-[10px] text-fg-muted">Institutional site lease framework</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-ink-850/80 border border-line">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-fg-body font-semibold">Executive Governance</div>
                    <div className="text-[10px] text-fg-muted">Documented operational standards</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-ink-850/80 border border-line">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-fg-body font-semibold">Jurisdiction & Location</div>
                    <div className="text-[10px] text-fg-muted">Muscat, Sultanate of Oman</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-ink-850/70 border border-line">
                <div className="text-fg-muted text-[10px] uppercase">Commencement</div>
                <div className="text-sm font-bold text-white mt-0.5">October 2, 2025</div>
                <div className="text-[10px] text-fg-muted mt-1">Phase 1 Deployed</div>
              </div>
              <div className="p-3 rounded-xl bg-ink-850/70 border border-line">
                <div className="text-fg-muted text-[10px] uppercase">Security Level</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Tier-3 Industrial</div>
                <div className="text-[10px] text-fg-muted mt-1">24/7 CCTV & Access Control</div>
              </div>
            </div>

          </div>
        )}

        {/* Footer Verification Stamp */}
        <div className="relative z-10 mt-5 pt-4 border-t border-line flex items-center justify-between text-xs font-mono text-fg-muted">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-fg-body">23.5880° N, 58.3829° E</span>
          </div>
          <span className="text-emerald-400 font-semibold">Verified Facility</span>
        </div>

      </div>

      {/* Supporting Under-Card Pill */}
      <div className="mt-3 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-ink-850 border border-line/90 shadow-xs text-xs">
        <div className="flex items-center gap-2.5 text-fg-body">
          <span className="w-2 h-2 rounded-full bg-gold-500" />
          <span className="font-semibold text-white">Muscat Computing Array MCT-01</span>
        </div>
        <span className="font-mono text-fg-muted text-[11px]">Sultanate of Oman</span>
      </div>

    </div>
  );
};
