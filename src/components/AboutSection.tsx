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
    <section id="about-section" className="py-20 lg:py-28 bg-ink-950 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-gold-500"></span>
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
            Corporate Profile & Operations
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Building Infrastructure for the Digital Asset Economy
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-fg-muted leading-relaxed">
              <p>
                <strong className="font-semibold text-white">FINOVATECK Mining Company</strong> is a Muscat-based digital-assets and Bitcoin-mining enterprise focused on developing and operating high-density technology infrastructure supporting the global digital-asset economy.
              </p>
              <p>
                Our approach combines computing infrastructure, operational discipline, and technology-driven execution to build resilient, sovereign digital-asset operations with strict engineering standards and transparent operational horizons.
              </p>
              {showExtended && (
                <p className="text-fg-muted">
                  Operating under a defined four-year lease term from Muscat, FINOVATECK applies systematic facility management, thermal optimization, and institutional governance to ensure every Megawatt of computing power delivers resilient cryptographic integrity.
                </p>
              )}
            </div>

            {/* Core Institutional Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-fg-muted uppercase font-mono">Headquarters</div>
                    <div className="text-sm font-bold text-white">Muscat, Oman</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-fg-muted uppercase font-mono">Operating Term</div>
                    <div className="text-sm font-bold text-white">4-Year Defined Lease</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-fg-muted uppercase font-mono">Core Discipline</div>
                    <div className="text-sm font-bold text-white">Bitcoin Mining Compute</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Established 2 October 2025</div>
                  </div>
                </div>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-2">
                <button
                  id="about-learn-more-btn"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold-500 transition-colors cursor-pointer group"
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
