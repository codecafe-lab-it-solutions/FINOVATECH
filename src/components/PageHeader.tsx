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
    <div className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 bg-[#070B14] text-white border-b border-gray-800 overflow-hidden">
      {/* Background Hero Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={backgroundImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-transform duration-1000"
        />
        {/* Layered cinematic gradient for perfect text contrast and depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#0B1120]/90 to-[#0B1120]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/70" />
        
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
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-gray-400"
          >
            <Home className="w-3.5 h-3.5 text-[#F7931A]" />
            <span>FINOVATECK</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-gray-200 font-semibold">{category}</span>
        </div>

        {/* Category Pill / Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/80 backdrop-blur-md border border-gray-700/80 text-xs font-mono font-semibold text-gray-200 shadow-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-[#F7931A] animate-pulse"></span>
          <span className="tracking-wider uppercase">{badge || category.toUpperCase()}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-4">
          {title}
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6">
          {subtitle}
        </p>

        {/* Optional Contextual Metrics / Highlights Chips */}
        {metrics && metrics.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-900/80 backdrop-blur-md border border-gray-700/80 text-xs font-mono text-gray-300 shadow-xs"
              >
                <span className="text-gray-400">{m.label}:</span>
                <span className="font-bold text-[#F7931A]">{m.value}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

