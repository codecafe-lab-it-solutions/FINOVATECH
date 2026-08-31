import React from 'react';
import { Cpu, Network, Server, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { BUSINESS_CARDS } from '../data/companyData';
import { PageRoute } from '../types';

interface BusinessPillarsProps {
  onNavigate?: (route: PageRoute) => void;
}

export const BusinessPillars: React.FC<BusinessPillarsProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#111827]" />;
      case 'Network':
        return <Network className="w-6 h-6 text-[#111827]" />;
      case 'Server':
        return <Server className="w-6 h-6 text-[#111827]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#111827]" />;
      default:
        return <Cpu className="w-6 h-6 text-[#111827]" />;
    }
  };

  return (
    <section id="business-pillars" className="py-20 lg:py-28 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F7931A]"></span>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-500">
                Core Capabilities
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Our Business Operations
            </h2>
            <p className="text-base text-gray-600">
              Purpose-built computing architecture and disciplined infrastructure capabilities executing from Muscat, Sultanate of Oman.
            </p>
          </div>

          {onNavigate && (
            <button
              id="business-view-infra-btn"
              onClick={() => onNavigate('infrastructure')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-900 transition-colors self-start md:self-auto cursor-pointer"
            >
              <span>View Technical Infrastructure</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_CARDS.map((card) => (
            <div
              key={card.id}
              id={`business-card-${card.id}`}
              className="group relative rounded-2xl bg-[#F8F9FA] border border-gray-200/90 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header with Number and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-2xs group-hover:border-[#F7931A]/40 transition-colors">
                    {getIcon(card.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-[#F7931A] transition-colors">
                    CARD {card.number}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-[#111827] tracking-tight mb-2.5">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-5 border-t border-gray-200/80 space-y-2">
                {card.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <Check className="w-3.5 h-3.5 text-[#F7931A] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
