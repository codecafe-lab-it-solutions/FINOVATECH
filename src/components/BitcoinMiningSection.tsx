import React, { useState } from 'react';
import { Cpu, Zap, Fan, Activity, Globe, Microchip, ArrowRight, CheckCircle2, ChevronRight, Layers } from 'lucide-react';
import { MINING_PROCESS_STEPS } from '../data/companyData';
import { PageRoute } from '../types';

interface BitcoinMiningSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const BitcoinMiningSection: React.FC<BitcoinMiningSectionProps> = ({ onNavigate }) => {
  const [activeStepId, setActiveStepId] = useState<string>(MINING_PROCESS_STEPS[0].id);

  const activeStep = MINING_PROCESS_STEPS.find((s) => s.id === activeStepId) || MINING_PROCESS_STEPS[0];

  const getStepIcon = (iconName: string, isCurrent: boolean) => {
    const iconClass = `w-5 h-5 transition-transform group-hover:scale-110 ${
      isCurrent ? 'text-[#F7931A]' : 'text-gray-700'
    }`;
    switch (iconName) {
      case 'Microchip':
        return <Microchip className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'Fan':
        return <Fan className={iconClass} />;
      case 'Activity':
        return <Activity className={iconClass} />;
      case 'Globe':
        return <Globe className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  const coreDisciplines = [
    'Computing power & ASIC density',
    'Industrial energy management',
    'Hardware tuning & microcode optimization',
    'Specialized cooling & climate containment',
    'Sub-millisecond network connectivity',
    'Automated 24/7 telemetry monitoring',
    'Physical & cryptographic security',
    'Disciplined operational lifecycle'
  ];

  return (
    <section id="bitcoin-mining-section" className="py-20 lg:py-28 bg-[#F8F9FA] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
              Technical Methodology
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Engineering the Infrastructure Behind Bitcoin
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Bitcoin mining is not simply running software—it is an exacting discipline of industrial computing, thermodynamics, power management, and real-time network orchestration.
          </p>
        </div>

        {/* Requirements Grid (8 Disciplines) */}
        <div className="mb-14 p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 mb-4">
            Critical Infrastructure Requirements for Industrial Mining
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {coreDisciplines.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-[#F7931A] shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Process Steps Bar */}
        <div className="mb-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
            <span>Operational Flow Sequence</span>
            <span className="text-gray-400 font-normal">Click any step to inspect technical details</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MINING_PROCESS_STEPS.map((step, idx) => {
              const isSelected = activeStepId === step.id;
              return (
                <button
                  key={step.id}
                  id={`mining-step-btn-${step.id}`}
                  onClick={() => setActiveStepId(step.id)}
                  className={`group relative p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#111827] text-white border-gray-900 shadow-md ring-2 ring-[#F7931A]/30'
                      : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                        isSelected ? 'bg-gray-800 text-[#F7931A]' : 'bg-gray-100 text-gray-500'
                      }`}>
                        STEP {step.stepNumber}
                      </span>
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        {getStepIcon(step.iconName, isSelected)}
                      </div>
                    </div>
                    
                    <div className="text-sm font-bold tracking-tight">
                      {step.title}
                    </div>
                    <div className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      {step.subtitle}
                    </div>
                  </div>

                  {idx < MINING_PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-white border border-gray-300 text-gray-400 flex items-center justify-center text-[10px]">
                        →
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Deep Dive Inspector */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-gray-100 font-mono text-xs font-bold text-gray-700">
                  PHASE {activeStep.stepNumber}
                </span>
                <span className="text-xs font-semibold text-[#F7931A] uppercase tracking-wider">
                  {activeStep.subtitle}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                {activeStep.title} Integration & Execution
              </h3>

              <p className="text-base text-gray-600 leading-relaxed">
                {activeStep.description}
              </p>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-xs sm:text-sm text-gray-700 font-mono">
                <span className="text-gray-400 font-bold mr-2">TECHNICAL ARCHITECTURE:</span>
                {activeStep.techDetail}
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center p-6 rounded-xl bg-[#0F172A] text-white border border-gray-800">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800 text-xs font-mono text-gray-400">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Cluster Location:</span>
                  <span>Muscat MCT-01</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Execution Hash:</span>
                  <span className="text-[#F7931A]">SHA-256 Validated</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Target Efficiency:</span>
                  <span>&lt; 21.5 J/TH</span>
                </div>
              </div>

              {onNavigate && (
                <button
                  id="mining-deep-dive-btn"
                  onClick={() => onNavigate('mining')}
                  className="mt-5 w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Mining Technical Specs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
