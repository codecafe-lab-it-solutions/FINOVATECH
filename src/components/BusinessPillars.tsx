import React from 'react';
import { Cpu, Network, Server, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { BUSINESS_CARDS } from '../data/companyData';
import { PageRoute } from '../types';

interface BusinessPillarsProps {
  onNavigate?: (route: PageRoute) => void;
}

export const BusinessPillars: React.FC<BusinessPillarsProps> = ({ onNavigate }) => {
  const iconClass = 'w-6 h-6 text-gold-500';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'Network':
        return <Network className={iconClass} />;
      case 'Server':
        return <Server className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  return (
    <section id="business-pillars" className="theme-light bg-grid-lines py-12 md:py-16 lg:py-24 bg-ink-900 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-600"></span>
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Core Capabilities
              </span>
            </div>
            {/* Was 36px while every neighbouring H2 was 48px. */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our Business Operations
            </h2>
            <p className="text-base sm:text-lg text-fg-body leading-relaxed">
              Purpose-built computing architecture and disciplined infrastructure capabilities executing from Muscat, Sultanate of Oman.
            </p>
          </div>

          {onNavigate && (
            <button
              id="business-view-infra-btn"
              onClick={() => onNavigate('infrastructure')}
              className="btn-secondary px-4 py-2.5 text-sm self-start md:self-auto whitespace-nowrap"
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
              className="group relative rounded-2xl bg-ink-850 border border-line p-7 flex flex-col justify-between hover:border-gold-600 hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Header with Number and Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/12 flex items-center justify-center">
                    {getIcon(card.iconName)}
                  </div>
                </div>

                {/* Reserved for two lines so every card's body starts on the
                    same baseline regardless of how the title wraps. */}
                <h3 className="text-xl font-bold text-white tracking-tight mb-2.5 lg:min-h-[3.5rem]">
                  {card.title}
                </h3>

                <p className="text-sm text-fg-body leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-5 border-t border-line/80 space-y-2">
                {card.features.slice(0, 3).map((feature, idx) => (
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
