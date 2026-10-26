import React, { useState } from 'react';
import { OPERATING_FRAMEWORK } from '../data/companyData';
import { Layers, Shield, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';

interface OperatingFrameworkProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OperatingFramework: React.FC<OperatingFrameworkProps> = ({ onNavigate }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section id="operating-framework-section" className="py-20 lg:py-28 bg-ink-900 border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-20 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-fg-muted">
              System Integration
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Our Operating Framework
          </h2>
          <p className="text-base sm:text-lg text-fg-muted leading-relaxed">
            Bitcoin mining is an integrated system of physical architecture, thermodynamic balance, electrical engineering, and disciplined governance—orchestrated centrally by FINOVATECK.
          </p>
        </div>

        {/* Centralized Hub Architecture Diagram */}
        <div className="relative rounded-3xl bg-ink-850 border border-line p-6 sm:p-12 shadow-xs overflow-hidden">
          
          {/* Subtle Grid Backdrop */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Desktop Circular / Radial Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {OPERATING_FRAMEWORK.map((node) => {
              const isHovered = hoveredNode === node.number;
              return (
                <div
                  key={node.number}
                  id={`framework-node-${node.number}`}
                  onMouseEnter={() => setHoveredNode(node.number)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`group relative rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                    isHovered
                      ? 'bg-ink-800 text-white border-gold-600/50 shadow-lg -translate-y-1'
                      : 'bg-ink-950 text-white border-line/90 hover:border-gold-700/50 hover:bg-ink-800 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-sm ${
                        isHovered ? 'bg-ink-800 text-gold-500' : 'bg-ink-850 text-fg-muted border border-line'
                      }`}>
                        PHASE {node.number}
                      </span>
                      <span className={`text-[11px] font-mono uppercase tracking-wider ${
                        isHovered ? 'text-fg-body' : 'text-gold-500'
                      }`}>
                        {node.role}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold tracking-tight mb-2 text-metal inline-block">
                      {node.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed ${isHovered ? 'text-fg-body' : 'text-fg-muted'}`}>
                      {node.description}
                    </p>
                  </div>

                  {/* Operational Linkage indicator */}
                  <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                    isHovered ? 'border-line text-fg-muted' : 'border-line text-fg-muted'
                  }`}>
                    <span>FINOVATECK ORCHESTRATION</span>
                    <span className="text-gold-500">✓ ACTIVE</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Hub Core Card (Institutional Anchor) */}
          <div className="mt-8 p-6 rounded-2xl bg-ink-950 text-white border border-line flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-ink-850 border border-line-warm flex items-center justify-center text-gold-500 font-extrabold text-lg shrink-0">
                F
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-wide">
                  CENTRALIZED FINOVATECK INTEGRATION
                </div>
                <div className="text-xs text-fg-muted mt-0.5">
                  Synchronizing high-density computing, power distribution, and thermal equilibrium as a unified operational discipline.
                </div>
              </div>
            </div>

            {onNavigate && (
              <button
                id="framework-explore-ops-btn"
                onClick={() => onNavigate('operations')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ink-850 hover:bg-ink-700 text-white text-xs font-bold tracking-wide transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                View Operational Workflows
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
