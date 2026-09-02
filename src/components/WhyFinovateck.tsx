import React from 'react';
import { WHY_FINOVATECK } from '../data/companyData';
import { Cpu, ShieldCheck, Server, Compass, Check } from 'lucide-react';
import { PageRoute } from '../types';

interface WhyFinovateckProps {
  onNavigate?: (route: PageRoute) => void;
}

export const WhyFinovateck: React.FC<WhyFinovateckProps> = ({ onNavigate }) => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Cpu className="w-5 h-5 text-[#F7931A]" />;
      case 1:
        return <ShieldCheck className="w-5 h-5 text-[#F7931A]" />;
      case 2:
        return <Server className="w-5 h-5 text-[#F7931A]" />;
      case 3:
        return <Compass className="w-5 h-5 text-[#F7931A]" />;
      default:
        return <Cpu className="w-5 h-5 text-[#F7931A]" />;
    }
  };

  return (
    <section id="why-finovateck-section" className="py-20 lg:py-28 bg-[#F8F9FA] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
              Institutional Values
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Why FINOVATECK
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Positioned as a disciplined industrial operator, FINOVATECK prioritizes physical infrastructure stability, transparent metrics, and verifiable computing performance.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_FINOVATECK.map((pillar, idx) => (
            <div
              key={pillar.title}
              id={`why-pillar-${idx}`}
              className="rounded-2xl bg-white border border-gray-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-gray-300 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                    {getIcon(idx)}
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm bg-gray-100 text-gray-600">
                    {pillar.metric}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#111827] tracking-tight mb-2">
                  {pillar.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 leading-normal font-mono">
                {pillar.detail}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
