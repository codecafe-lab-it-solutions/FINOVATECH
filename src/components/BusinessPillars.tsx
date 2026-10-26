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
        return <Cpu className="w-6 h-6 text-white" />;
      case 'Network':
        return <Network className="w-6 h-6 text-white" />;
      case 'Server':
        return <Server className="w-6 h-6 text-white" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-white" />;
      default:
        return <Cpu className="w-6 h-6 text-white" />;
    }
  };

  return (
    <section id="business-pillars" className="py-20 lg:py-28 bg-ink-900 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
                Core Capabilities
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Our Business Operations
            </h2>
            <p className="text-base text-fg-muted">
              Purpose-built computing architecture and disciplined infrastructure capabilities executing from Muscat, Sultanate of Oman.
            </p>
          </div>

          {onNavigate && (
            <button
              id="business-view-infra-btn"
              onClick={() => onNavigate('infrastructure')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-xs font-semibold text-white transition-colors self-start md:self-auto cursor-pointer"
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
              className="group relative rounded-2xl bg-ink-950 border border-line/90 p-6 sm:p-7 flex flex-col justify-between hover:bg-ink-800 hover:border-gold-700/50 hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header with Number and Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-ink-850 border border-line flex items-center justify-center shadow-2xs group-hover:border-gold-500/40 transition-colors">
                    {getIcon(card.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold text-fg-muted group-hover:text-gold-500 transition-colors">
                    CARD {card.number}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-white tracking-tight mb-2.5">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-fg-muted leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-5 border-t border-line/80 space-y-2">
                {card.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-fg-body">
                    <Check className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
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
