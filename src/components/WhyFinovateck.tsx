import React from 'react';
import { WHY_FINOVATECK } from '../data/companyData';
import { Cpu, ShieldCheck, Server, Compass } from 'lucide-react';
import { PageRoute } from '../types';

interface WhyFinovateckProps {
  onNavigate?: (route: PageRoute) => void;
}

export const WhyFinovateck: React.FC<WhyFinovateckProps> = ({ onNavigate }) => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Cpu className="w-5 h-5 text-gold-500" />;
      case 1:
        return <ShieldCheck className="w-5 h-5 text-gold-500" />;
      case 2:
        return <Server className="w-5 h-5 text-gold-500" />;
      case 3:
        return <Compass className="w-5 h-5 text-gold-500" />;
      default:
        return <Cpu className="w-5 h-5 text-gold-500" />;
    }
  };

  return (
    <section id="why-finovateck-section" className="theme-light py-12 md:py-16 lg:py-24 bg-ink-900 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Institutional Values
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Why FINOVATECK
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            Positioned as a disciplined industrial operator, FINOVATECK prioritizes physical infrastructure stability, transparent metrics, and verifiable computing performance.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_FINOVATECK.map((pillar, idx) => (
            <div
              key={pillar.title}
              id={`why-pillar-${idx}`}
              className="rounded-2xl bg-ink-850 border border-line p-7 flex flex-col shadow-2xs hover:shadow-md hover:border-gold-600 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/12 flex items-center justify-center mb-5">
                {getIcon(idx)}
              </div>

              {/* The metric was a grey chip in the corner; it is the card's
                  headline fact, so it leads. */}
              <div className="text-2xl font-extrabold text-gold-500 tracking-tight mb-1">
                {pillar.metric}
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2 lg:min-h-[3.5rem]">
                {pillar.title}
              </h3>

              {/* The second paragraph restated the first in 12px grey mono. */}
              <p className="text-base text-fg-body leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
