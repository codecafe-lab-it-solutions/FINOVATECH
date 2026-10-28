import React from 'react';
import { Cpu, Zap, Fan, Activity, Globe, Microchip, CheckCircle2, ChevronRight } from 'lucide-react';
import { MINING_PROCESS_STEPS } from '../data/companyData';
import { PageRoute } from '../types';

interface BitcoinMiningSectionProps {
  onNavigate?: (route: PageRoute) => void;
}

export const BitcoinMiningSection: React.FC<BitcoinMiningSectionProps> = ({ onNavigate }) => {
  const getStepIcon = (iconName: string) => {
    // The cards are a light surface on a dark band, so this is a literal
    // value rather than a token, which would resolve for the dark theme.
    const iconClass = 'w-5 h-5 text-[#0A0D12]';
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
    <section id="bitcoin-mining-section" className="py-12 md:py-16 lg:py-24 bg-ink-880 band-seam border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Technical Methodology
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Engineering the Infrastructure Behind Bitcoin
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            Bitcoin mining is not simply running software—it is an exacting discipline of industrial computing, thermodynamics, power management, and real-time network orchestration.
          </p>
        </div>

        {/* Requirements Grid (8 Disciplines) */}
        <div className="mb-14 p-6 rounded-2xl bg-ink-850 border border-line/90 shadow-2xs">
          <div className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500 mb-4">
            Critical Infrastructure Requirements for Industrial Mining
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {coreDisciplines.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-fg-body">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Process Steps Bar */}
        <div className="mb-6">
          <div className="text-xs mb-3">
            <span className="font-semibold uppercase tracking-eyebrow text-gold-500">Operational Flow Sequence</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MINING_PROCESS_STEPS.map((step, idx) => {
              return (
                <div
                  key={step.id}
                  id={`mining-step-${step.id}`}
                  className="relative p-4 rounded-xl text-left border border-[#E4E7EC] shadow-sm flex flex-col justify-between bg-white bg-dot-grid"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-[#0A0D12] text-white">
                        {step.stepNumber}
                      </span>
                      <div className="p-1.5 rounded-lg bg-[#0A0D12]/6">
                        {getStepIcon(step.iconName)}
                      </div>
                    </div>

                    <div className="text-sm font-bold tracking-tight text-[#0A0D12]">
                      {step.title}
                    </div>
                    {/* Near-black rather than the usual secondary grey: the
                        dot grid sits behind this line, and mid-grey over a
                        texture reads washed out at 12px. */}
                    <div className="text-xs font-medium mt-0.5 text-[#1F2937]">
                      {step.subtitle}
                    </div>
                  </div>

                  {idx < MINING_PROCESS_STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden lg:block absolute right-[-0.875rem] top-1/2 -translate-y-1/2 w-3 h-px bg-gold-700"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {onNavigate && (
          <div className="mt-10 flex justify-center">
            <button
              id="mining-deep-dive-btn"
              onClick={() => onNavigate('mining')}
              className="btn-primary px-6 py-3 text-sm"
            >
              <span>Mining Technical Specs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
