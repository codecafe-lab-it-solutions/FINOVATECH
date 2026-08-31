import React from 'react';
import { Building2, Shield, Cpu, Clock, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';
import { InfrastructureArchitectureCard } from './InfrastructureArchitectureCard';

interface AboutSectionProps {
  onNavigate?: (route: PageRoute) => void;
  showExtended?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate, showExtended = false }) => {
  return (
    <section id="about-section" className="py-20 lg:py-28 bg-[#F8F9FA] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
            Corporate Profile & Operations
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Building Infrastructure for the Digital Asset Economy
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              <p>
                <strong className="font-semibold text-gray-900">FINOVATECH Mining Company</strong> is a Muscat-based digital-assets and Bitcoin-mining enterprise focused on developing and operating high-density technology infrastructure supporting the global digital-asset economy.
              </p>
              <p>
                Our approach combines computing infrastructure, operational discipline, and technology-driven execution to build resilient, sovereign digital-asset operations with strict engineering standards and transparent operational horizons.
              </p>
              {showExtended && (
                <p className="text-gray-600">
                  Operating under a defined four-year lease term from Muscat, FINOVATECH applies systematic facility management, thermal optimization, and institutional governance to ensure every Megawatt of computing power delivers resilient cryptographic integrity.
                </p>
              )}
            </div>

            {/* Core Institutional Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase font-mono">Headquarters</div>
                    <div className="text-sm font-bold text-gray-900">Muscat, Oman</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase font-mono">Operating Term</div>
                    <div className="text-sm font-bold text-gray-900">4-Year Defined Lease</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800 shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase font-mono">Core Discipline</div>
                    <div className="text-sm font-bold text-gray-900">Bitcoin Mining Compute</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800 shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase font-mono">Governance</div>
                    <div className="text-sm font-bold text-gray-900">Rayees Ahmad Bhat</div>
                  </div>
                </div>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-2">
                <button
                  id="about-learn-more-btn"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#111827] hover:text-[#F7931A] transition-colors cursor-pointer group"
                >
                  <span>Learn more about our governance and corporate standards</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Architectural Infrastructure Blueprint Card */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <InfrastructureArchitectureCard />
          </div>

        </div>
      </div>
    </section>
  );
};
