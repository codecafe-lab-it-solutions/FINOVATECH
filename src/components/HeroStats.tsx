import React from 'react';
import { HERO_STATS } from '../data/companyData';

export const HeroStats: React.FC = () => {
  return (
    <section id="hero-statistics" className="relative bg-ink-900 border-b border-line overflow-hidden">
      {/* Gold hairline capping the strip, as the deck rules its panels */}
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#CCA84F_20%,#F4E183_50%,#CCA84F_80%,transparent)] opacity-60" />
      <div className="absolute inset-0 bg-circuit" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-11 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-line">
          {HERO_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              className={`flex flex-col group ${
                idx === 0
                  ? 'md:pr-8'
                  : idx === HERO_STATS.length - 1
                  ? 'md:pl-8'
                  : 'md:px-8'
              }`}
            >
              <div className="text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight font-mono text-metal leading-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mt-1.5">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="text-xs text-fg-muted mt-0.5 font-normal font-mono">
                  {stat.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
