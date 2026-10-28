import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';
import { TIMELINE_ITEMS } from '../data/companyData';
import { PageRoute } from '../types';

interface OperationalTimelineProps {
  onNavigate?: (route: PageRoute) => void;
}

/* One treatment per status, applied in one place. Previously each card
   announced its status twice — once as a badge, once as "• CURRENT" —
   and the last card used pure black while the others did not. */
const STATUS_STYLE = {
  completed: {
    card: 'bg-ink-850 border-line',
    marker: 'bg-ink-800 border-line text-fg-body',
    date: 'bg-ink-800 text-fg-body',
  },
  current: {
    card: 'bg-ink-850 border-gold-500',
    marker: 'bg-gold-500 border-gold-500 text-[#0A0D12]',
    date: 'bg-gold-500 text-[#0A0D12]',
  },
  planned: {
    card: 'bg-ink-850 border-line border-dashed',
    marker: 'bg-ink-850 border-line border-dashed text-fg-body',
    date: 'bg-ink-800 text-fg-body',
  },
} as const;

export const OperationalTimeline: React.FC<OperationalTimelineProps> = ({ onNavigate }) => {
  return (
    <section id="timeline-section" className="py-12 md:py-16 lg:py-24 bg-ink-880 band-seam border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Corporate Horizon
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Operational Timeline & Lifecycle
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            FINOVATECK executes with transparent roadmaps and defined operational horizons, adhering to scheduled lease commitments and high-standard infrastructure lifecycle management.
          </p>
        </div>

        {/* A timeline now reads as one — a rule through four markers, rather
            than four boxes that happen to sit in a row. */}
        <div className="relative">
          <div
            aria-hidden
            className="hidden lg:block absolute left-0 right-0 top-5 h-px bg-line"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE_ITEMS.map((item, idx) => {
              const style = STATUS_STYLE[item.status as keyof typeof STATUS_STYLE] ?? STATUS_STYLE.planned;
              const isCurrent = item.status === 'current';

              return (
                <div key={item.date} id={`timeline-item-${idx}`} className="relative flex flex-col">
                  {/* Marker on the rule */}
                  <div className="relative z-10 mb-5 flex items-center lg:justify-start">
                    <span
                      className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${style.marker}`}
                    >
                      {item.status === 'completed' ? (
                        <Check className="w-5 h-5" />
                      ) : isCurrent ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </span>
                  </div>

                  <div
                    className={`rounded-2xl p-6 border flex flex-col grow transition-colors ${style.card} ${
                      isCurrent ? 'shadow-lg' : 'hover:border-gold-700'
                    }`}
                  >
                    <span className={`self-start text-xs font-mono font-bold px-2.5 py-1 rounded-md mb-4 ${style.date}`}>
                      {item.date}
                    </span>

                    <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-fg-body">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-line text-xs leading-relaxed text-fg-body">
                      {item.details}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Informational Callout regarding 4-Year Lease Term */}
        <div className="mt-8 p-5 rounded-xl bg-ink-850 border border-line flex items-start gap-3.5">
          <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
          <div className="text-sm text-fg-body leading-relaxed">
            <span className="font-bold text-white">Planned operating term:</span> operations run under the current lease arrangement for four years from Muscat, after which they are scheduled to close in line with structured corporate planning.
          </div>
        </div>

      </div>
    </section>
  );
};
