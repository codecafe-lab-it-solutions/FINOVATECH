import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageRoute } from '../types';

interface PageHeaderMetric {
  label: string;
  value: string;
}

interface PageHeaderProps {
  category: string;
  title: string;
  subtitle: string;
  onNavigate: (route: PageRoute) => void;
  backgroundImage?: string;
  badge?: string;
  metrics?: PageHeaderMetric[];
  /** Paper variant of the banner. Defaults to the dark treatment. */
  theme?: 'dark' | 'light';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  subtitle,
  onNavigate,
  backgroundImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85',
  badge,
  metrics,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';

  /* theme-light repoints the colour variables for this subtree, so the
     plain utilities below follow on their own. The exceptions are the
     /opacity variants, which compile to a literal colour and therefore
     have to be branched by hand. */
  return (
    <div
      className={`relative pt-28 pb-14 sm:pt-36 sm:pb-20 border-b border-line overflow-hidden ${
        isLight ? 'theme-light bg-ink-900' : 'bg-ink-950 text-white'
      }`}
    >
      {/* Background Hero Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={backgroundImage}
          alt=""
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transform scale-105 ${
            isLight ? 'opacity-10' : 'opacity-30'
          }`}
        />
        {/* Layered gradient for text contrast and depth */}
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F7F8FA] via-[rgba(247,248,250,0.92)] to-[rgba(247,248,250,0.78)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8FA] via-transparent to-[rgba(247,248,250,0.7)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900/90 to-ink-900/75" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
          </>
        )}

        {/* Subtle grid overlay */}
        <div
          className={isLight ? 'absolute inset-0 opacity-[0.07]' : 'absolute inset-0 opacity-15'}
          style={{
            backgroundImage: isLight
              ? `linear-gradient(to right, #0A0D12 1px, transparent 1px), linear-gradient(to bottom, #0A0D12 1px, transparent 1px)`
              : `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-fg-body mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-gold-500" />
            <span>FINOVATECK</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-white">{category}</span>
        </div>

        {/* Category Pill / Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md text-xs font-semibold shadow-sm mb-4 ${
            isLight
              ? 'bg-[#FFFFFF] border border-[#E4E7EC] text-[#1F2937]'
              : 'bg-ink-800/80 border border-line-warm/80 text-fg-body'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
          <span className="tracking-eyebrow uppercase">{badge || category.toUpperCase()}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-4">
          {title}
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-fg-body max-w-3xl leading-relaxed mb-6">
          {subtitle}
        </p>

        {/* Optional Contextual Metrics / Highlights Chips */}
        {metrics && metrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {metrics.map((m, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg backdrop-blur-md text-xs shadow-xs ${
                  isLight
                    ? 'bg-[#FFFFFF] border border-[#E4E7EC]'
                    : 'bg-ink-850/80 border border-line-warm/80'
                }`}
              >
                <span className="text-fg-body">{m.label}:</span>
                <span className="font-mono font-bold text-gold-500">{m.value}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
