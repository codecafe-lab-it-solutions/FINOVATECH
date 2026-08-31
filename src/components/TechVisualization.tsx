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
    <section id="technology-visualization-section" className="py-20 lg:py-28 bg-[#0F172A] text-white border-b border-gray-800 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#F7931A]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#F7931A]">
                Interactive Simulation
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Technology & Infrastructure Pipeline
            </h2>
            <p className="text-base text-gray-400">
              Visualizing the end-to-end operational flow from ASIC silicon computation in Muscat to global Bitcoin network consensus.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-300 transition-colors cursor-pointer border border-gray-700"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#F7931A]" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
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
                    ? 'bg-gray-900 border-[#F7931A] text-white shadow-lg ring-1 ring-[#F7931A]/30'
                    : 'bg-gray-950/70 border-gray-800 text-gray-400 hover:bg-gray-900/80 hover:border-gray-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#F7931A]/20 text-[#F7931A]' : 'bg-gray-900 text-gray-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">0{idx + 1}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-bold tracking-tight text-white mb-0.5">
                    {stage.title}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">
                    {stage.subtitle}
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F7931A]"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail & Real-Time Telemetry Monitor */}
        <div className="rounded-2xl bg-gray-950 border border-gray-800 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Detail Description */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#F7931A]">
                <span>STAGE 0{activeStageIndex + 1} INSPECTOR</span>
                <span>•</span>
                <span className="text-gray-400">{activeStage.telemetryKey}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {activeStage.title}: {activeStage.subtitle}
              </h3>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {activeStage.detail}
              </p>

              {/* Data Flow Animation Bar */}
              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400">Data Synchronization</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active Stream MCT-01 → Global Consensus
                </span>
              </div>
            </div>

            {/* Right Live Simulation Telemetry Matrix */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-gray-900 border border-gray-800 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-gray-400">
                <span className="font-bold text-gray-300">FACILITY TELEMETRY</span>
                <span className="text-[10px] text-gray-500">LIVE FEED</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Voltage Stability:</span>
                <span className="text-emerald-400 font-bold">{telemetry.voltageStability}%</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Local Stratum RTT:</span>
                <span className="text-emerald-400 font-bold">{telemetry.rttLatency} ms</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Hash Execution Rate:</span>
                <span className="text-[#F7931A] font-bold">{telemetry.hashRateTH} TH/s (Nominal)</span>
              </div>

              <div className="flex justify-between items-center text-gray-300">
                <span className="text-gray-400">Operating Standard:</span>
                <span className="text-gray-200">Muscat Facility MCT-01</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
