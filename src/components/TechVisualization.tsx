import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Fan, Network, Activity, Globe, Play, Pause, RefreshCw } from 'lucide-react';

export const TechVisualization: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState({
    activeChips: 2840,
    voltageStability: 99.98,
    airflowRate: 4200,
    rttLatency: 1.4,
    verifiedBlocks: 842109,
    hashRateTH: 342.8
  });

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
      telemetryKey: 'Thermal Delta: 12.8°C • Negative Pressure',
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

  useEffect(() => {
    const jitter = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        voltageStability: +(99.94 + Math.random() * 0.05).toFixed(2),
        rttLatency: +(1.2 + Math.random() * 0.4).toFixed(1),
        hashRateTH: +(340 + Math.random() * 5).toFixed(1)
      }));
    }, 2000);
    return () => clearInterval(jitter);
  }, []);

  const activeStage = pipelineStages[activeStageIndex];

  return (
    <section id="technology-visualization-section" className="py-20 lg:py-28 bg-ink-950 text-white border-b border-line relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gold-500">
                Interactive Simulation
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Technology & Infrastructure Pipeline
            </h2>
            <p className="text-base text-fg-muted">
              Visualizing the end-to-end operational flow from ASIC silicon computation in Muscat to global Bitcoin network consensus.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-xs font-mono text-fg-body transition-colors cursor-pointer border border-line-warm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-gold-500" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPlaying ? 'Pause Auto-Cycle' : 'Resume Auto-Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
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
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                  isActive
                    ? 'bg-ink-850 border-gold-500 text-white shadow-lg ring-1 ring-gold-500/30'
                    : 'bg-ink-950/70 border-line text-fg-muted hover:bg-ink-850/80 hover:border-gold-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-gold-500/20 text-gold-500' : 'bg-ink-850 text-fg-muted'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-fg-muted">0{idx + 1}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold tracking-tight text-white mb-0.5">
                    {stage.title}
                  </div>
                  <div className="text-[11px] text-fg-muted truncate">
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
        <div className="rounded-2xl bg-ink-950 border border-line p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Detail Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-gold-500">
                <span>STAGE 0{activeStageIndex + 1} INSPECTOR</span>
                <span>•</span>
                <span className="text-fg-muted">{activeStage.telemetryKey}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeStage.title}: {activeStage.subtitle}
              </h3>

              <p className="text-sm sm:text-base text-fg-body leading-relaxed">
                {activeStage.detail}
              </p>

              {/* Data Flow Animation Bar */}
              <div className="p-3 rounded-xl bg-ink-850/80 border border-line flex items-center justify-between text-xs font-mono">
                <span className="text-fg-muted">Data Synchronization</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Stream MCT-01 → Global Consensus
                </span>
              </div>
            </div>

            {/* Right Live Simulation Telemetry Matrix */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-ink-850 border border-line font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-line text-fg-muted">
                <span className="font-bold text-fg-body">FACILITY TELEMETRY</span>
                <span className="text-[10px] text-fg-muted">LIVE FEED</span>
              </div>

              <div className="flex justify-between items-center text-fg-body">
                <span className="text-fg-muted">Voltage Stability:</span>
                <span className="text-emerald-400 font-bold">{telemetry.voltageStability}%</span>
              </div>

              <div className="flex justify-between items-center text-fg-body">
                <span className="text-fg-muted">Local Stratum RTT:</span>
                <span className="text-emerald-400 font-bold">{telemetry.rttLatency} ms</span>
              </div>

              <div className="flex justify-between items-center text-fg-body">
                <span className="text-fg-muted">Hash Execution Rate:</span>
                <span className="text-gold-500 font-bold">{telemetry.hashRateTH} TH/s (Nominal)</span>
              </div>

              <div className="flex justify-between items-center text-fg-body">
                <span className="text-fg-muted">Operating Standard:</span>
                <span className="text-fg-body">Muscat Facility MCT-01</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
