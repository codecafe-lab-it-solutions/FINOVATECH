import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Fan, Network, Activity, Globe, Play, Pause } from 'lucide-react';
import { OPERATING_FACTS } from '../data/companyData';

export const TechVisualization: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const pipelineStages = [
    {
      id: 'hardware',
      title: 'Mining Hardware',
      subtitle: 'ASIC Silicon Array',
      icon: Cpu,
      telemetryKey: 'Silicon Density: 5nm Microarchitecture',
      detail: 'High-density computational clusters calculating SHA-256 cryptographic proof hashes in continuous loops.'
    },
    {
      id: 'power',
      title: 'Power Infrastructure',
      subtitle: 'Three-Phase Regulation',
      icon: Zap,
      telemetryKey: 'Power Factor: 0.985 • Balanced Load',
      detail: 'Substation step-down transformers feeding regulated, surge-protected direct voltage to compute rows.'
    },
    {
      id: 'cooling',
      title: 'Cooling Systems',
      subtitle: 'Air Containment Flow',
      icon: Fan,
      telemetryKey: 'Thermal delta ' + OPERATING_FACTS.thermalDelta + ' · negative pressure',
      detail: 'Precision hot-aisle containment and high-CFM extraction maintaining optimal silicon junction temperatures.'
    },
    {
      id: 'network',
      title: 'Network Fabric',
      subtitle: 'Stratum V2 Protocol',
      icon: Network,
      telemetryKey: 'Internal RTT: 1.4ms • Zero Packet Jitter',
      detail: 'Isolated high-speed fiber backbone propagating prospective block headers directly to stratum endpoints.'
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Telemetry',
      subtitle: 'Real-Time Edge Sensors',
      icon: Activity,
      telemetryKey: 'Sensor Rate: 100ms Polling • Auto-Throttle',
      detail: 'Unified SCADA array assessing voltage, thermals, RPMs, and chip health with automated failover circuits.'
    },
    {
      id: 'bitcoin',
      title: 'Bitcoin Network',
      subtitle: 'Decentralized Consensus',
      icon: Globe,
      telemetryKey: 'Peer Protocol: Layer 1 Global Node Broadcast',
      detail: 'Valid mathematical nonce broadcast across global peer nodes, securing decentralized ledger state.'
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % pipelineStages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying, pipelineStages.length]);

  const activeStage = pipelineStages[activeStageIndex];

  return (
    <section id="technology-visualization-section" className="py-12 md:py-16 lg:py-24 bg-ink-880 band-seam text-white border-b border-line relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Interactive Simulation
              </span>
            </div>
            {/* Was 36px while every neighbouring H2 was 48px. */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Technology & Infrastructure Pipeline
            </h2>
            <p className="text-base sm:text-lg text-fg-body leading-relaxed">
              Visualizing the end-to-end operational flow from ASIC silicon computation in Muscat to global Bitcoin network consensus.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-secondary px-3.5 py-2 text-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-gold-500" /> : <Play className="w-4 h-4 text-gold-500" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            const isActive = activeStageIndex === idx;
            return (
              <button
                key={stage.id}
                id={`tech-pipeline-stage-${stage.id}`}
                onClick={() => {
                  setActiveStageIndex(idx);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col justify-between relative ${
                  isActive
                    ? 'bg-ink-800 border-gold-500 text-white'
                    : 'bg-ink-850 border-line text-fg-body hover:border-gold-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-gold-500/20 text-gold-500' : 'bg-ink-800 text-gold-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-fg-body">0{idx + 1}</span>
                  </div>
                  <div className="text-[13px] font-bold tracking-tight text-white mb-0.5 leading-snug lg:min-h-[2.5rem]">
                    {stage.title}
                  </div>
                  <div className="text-xs text-fg-body truncate">
                    {stage.subtitle}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail & Real-Time Telemetry Monitor */}
        <div className="rounded-2xl bg-ink-850 border border-line p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Detail Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono font-bold text-gold-500">STAGE 0{activeStageIndex + 1}</span>
                <span className="text-fg-body">·</span>
                <span className="text-fg-body">{activeStage.telemetryKey}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeStage.title}: {activeStage.subtitle}
              </h3>

              <p className="text-sm sm:text-base text-fg-body leading-relaxed">
                {activeStage.detail}
              </p>

              {/* Data Flow Animation Bar */}
              <div className="p-3 rounded-xl bg-ink-900 border border-line flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-fg-body">Data synchronization</span>
                <span className="text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono">{OPERATING_FACTS.nodeId}</span> → global consensus
                </span>
              </div>
            </div>

            {/* Right Live Simulation Telemetry Matrix */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-ink-900 border border-line text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-semibold uppercase tracking-eyebrow text-gold-500">Facility Targets</span>
              </div>

              {[
                ['Uptime target', OPERATING_FACTS.uptimeTarget],
                ['Power factor', '0.985'],
                ['Local stratum RTT', '< 1.2 ms'],
                ['Per-rack hashrate', OPERATING_FACTS.perRackHashrate],
                ['Thermal delta', OPERATING_FACTS.thermalDelta],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center gap-3">
                  <span className="text-fg-body">{label}</span>
                  <span className="font-mono font-bold text-white text-right">{value}</span>
                </div>
              ))}

              <p className="pt-2 border-t border-line text-fg-body leading-relaxed">
                Engineering targets for <span className="font-mono">{OPERATING_FACTS.nodeId}</span>, not a live feed.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
