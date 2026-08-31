import React, { useState } from 'react';
import { Cpu, Zap, Fan, Network, Activity, ShieldCheck, Check, Layers, ChevronRight } from 'lucide-react';
import { INFRASTRUCTURE_PILLARS } from '../data/companyData';
import { PageRoute } from '../types';

interface MiningInfrastructureProps {
  onNavigate?: (route: PageRoute) => void;
}

export const MiningInfrastructure: React.FC<MiningInfrastructureProps> = ({ onNavigate }) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(INFRASTRUCTURE_PILLARS[0].id);

  const selectedPillar = INFRASTRUCTURE_PILLARS.find((p) => p.id === selectedPillarId) || INFRASTRUCTURE_PILLARS[0];

  const getPillarIcon = (iconName: string, active: boolean) => {
    const iconClass = `w-5 h-5 ${active ? 'text-[#F7931A]' : 'text-gray-600'}`;
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Fan':
        return <Fan className={iconClass} />;
      case 'Network':
        return <Network className={iconClass} />;
      case 'Activity':
        return <Activity className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  return (
    <section id="infrastructure-section" className="py-20 lg:py-28 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
              Infrastructure Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Institutional Infrastructure Components
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Every layer of FINOVATECH's computational facility in Muscat is engineered to institutional specifications for thermal resilience, energy efficiency, and uninterrupted connectivity.
          </p>
        </div>

        {/* 6 Tab Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {INFRASTRUCTURE_PILLARS.map((pillar) => {
            const isSelected = selectedPillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                id={`infra-tab-${pillar.id}`}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#111827] text-white border-gray-900 shadow-md ring-1 ring-[#F7931A]/40'
                    : 'bg-[#F8F9FA] text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}>
                    {getPillarIcon(pillar.iconName, isSelected)}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#F7931A] animate-pulse"></span>
                  )}
                </div>
                <div className="text-xs sm:text-[13px] font-bold tracking-tight line-clamp-2">
                  {pillar.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Detailed Architecture Card */}
        <div className="rounded-2xl bg-[#F8F9FA] border border-gray-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Narrative & Engineering Key Points */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-mono font-semibold text-gray-600 mb-3">
                  <span>INFRASTRUCTURE MODULE: {selectedPillar.id.toUpperCase()}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  {selectedPillar.title}
                </h3>
                <p className="text-sm font-medium text-[#F7931A] mt-1">
                  {selectedPillar.tagline}
                </p>
              </div>

              <p className="text-base text-gray-600 leading-relaxed">
                {selectedPillar.description}
              </p>

              {/* Engineering Highlights */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                  Engineering Standards & Design Protocols
                </div>
                {selectedPillar.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-white p-3.5 rounded-xl border border-gray-200/80">
                    <Check className="w-4 h-4 text-[#F7931A] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Technical Specification Ledger */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500">
                    Technical Specifications
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    Verified Specs
                  </span>
                </div>

                <div className="space-y-3.5">
                  {selectedPillar.specs.map((spec, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100/70 text-xs sm:text-sm gap-1">
                      <span className="text-gray-500 font-normal">{spec.label}</span>
                      <span className="font-mono font-bold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-gray-400 font-mono">
                  * Hardware specifications configured in adherence to Muscat climate and electrical regulatory parameters.
                </div>
              </div>

              {onNavigate && (
                <button
                  id="infra-full-page-btn"
                  onClick={() => onNavigate('infrastructure')}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Explore Full Infrastructure Architecture</span>
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
