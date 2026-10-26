import React from 'react';
import { Calendar, CheckCircle2, Clock, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { TIMELINE_ITEMS } from '../data/companyData';
import { PageRoute } from '../types';

interface OperationalTimelineProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OperationalTimeline: React.FC<OperationalTimelineProps> = ({ onNavigate }) => {
  return (
    <section id="timeline-section" className="py-20 lg:py-28 bg-ink-950 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
              Corporate Horizon
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Operational Timeline & Lifecycle
          </h2>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed">
            FINOVATECK executes with transparent roadmaps and defined operational horizons, adhering to scheduled lease commitments and high-standard infrastructure lifecycle management.
          </p>
        </div>

        {/* Timeline Grid (4 Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE_ITEMS.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isPlanned = item.status === 'planned';

            return (
              <div
                key={item.date}
                id={`timeline-item-${idx}`}
                className={`relative rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-300 ${
                  isCurrent
                    ? 'bg-ink-800 text-white border-gold-600/50 shadow-lg ring-2 ring-gold-500/30'
                    : isPlanned
                    ? 'bg-ink-950 text-white border-line hover:border-gold-700/50'
                    : 'bg-ink-850 text-white border-line/90 hover:border-gold-700/50'
                }`}
              >
                <div>
                  {/* Top Status & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                      isCurrent
                        ? 'bg-gold-500 text-black font-extrabold'
                        : isPlanned
                        ? 'bg-ink-700 text-fg-body'
                        : 'bg-ink-800 text-fg-body'
                    }`}>
                      {item.date}
                    </span>

                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      isCurrent
                        ? 'text-emerald-400 font-bold flex items-center gap-1'
                        : isPlanned
                        ? 'text-fg-muted font-semibold'
                        : 'text-emerald-400 font-semibold'
                    }`}>
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                      {item.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold tracking-tight mb-2">
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className={`text-sm leading-relaxed mb-4 ${
                    isCurrent ? 'text-fg-body' : 'text-fg-muted'
                  }`}>
                    {item.description}
                  </p>
                </div>

                {/* Granular Detail Box */}
                <div className={`mt-4 pt-4 border-t text-xs leading-relaxed ${
                  isCurrent
                    ? 'border-line text-fg-muted'
                    : 'border-line text-fg-muted'
                }`}>
                  {item.details}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Callout regarding 4-Year Lease Term */}
        <div className="mt-8 p-5 rounded-xl bg-ink-900 border border-line flex items-start gap-3.5">
          <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-fg-body leading-relaxed">
            <span className="font-bold text-white">Planned Operating Term Clarity:</span> Operations are planned under the current lease arrangement for four years from Muscat, after which operations are scheduled to close in full alignment with structured corporate planning.
          </div>
        </div>

      </div>
    </section>
  );
};
