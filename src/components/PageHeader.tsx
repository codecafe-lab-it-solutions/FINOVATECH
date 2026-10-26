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
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  subtitle,
  onNavigate,
  backgroundImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85',
  badge,
  metrics,
}) => {
  return (
    <div className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 bg-ink-950 text-white border-b border-line overflow-hidden">
      {/* Background Hero Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={backgroundImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000"
        />
        {/* Layered cinematic gradient for perfect text contrast and depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900/90 to-ink-900/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/70" />
        
        {/* Subtle high-tech grid overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-fg-muted mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-fg-muted"
          >
            <Home className="w-3.5 h-3.5 text-gold-500" />
            <span>FINOVATECK</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-fg-muted" />
          <span className="text-fg-body font-semibold">{category}</span>
        </div>

        {/* Category Pill / Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink-800/80 backdrop-blur-md border border-line-warm/80 text-xs font-mono font-semibold text-fg-body shadow-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
          <span className="tracking-wider uppercase">{badge || category.toUpperCase()}</span>
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
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-ink-850/80 backdrop-blur-md border border-line-warm/80 text-xs font-mono text-fg-body shadow-xs"
              >
                <span className="text-fg-muted">{m.label}:</span>
                <span className="font-bold text-gold-500">{m.value}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

