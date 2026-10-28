import React, { useState } from 'react';
import { OPERATING_FRAMEWORK } from '../data/companyData';
import { PageRoute } from '../types';

interface OperatingFrameworkProps {
  onNavigate?: (route: PageRoute) => void;
}

export const OperatingFramework: React.FC<OperatingFrameworkProps> = ({ onNavigate }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section id="operating-framework-section" className="theme-light py-12 md:py-16 lg:py-24 bg-ink-900 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              System Integration
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Our Operating Framework
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            Bitcoin mining is an integrated system of physical architecture, thermodynamic balance, electrical engineering, and disciplined governance—orchestrated centrally by FINOVATECK.
          </p>
        </div>

        {/* The cards used to sit in a white bordered container on a light
            section — a card inside a card inside a section. */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {OPERATING_FRAMEWORK.map((node) => {
              const isHovered = hoveredNode === node.number;
              return (
                <div
                  key={node.number}
                  id={`framework-node-${node.number}`}
                  onMouseEnter={() => setHoveredNode(node.number)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`group relative rounded-2xl p-7 border transition-all duration-300 flex flex-col ${
                    isHovered
                      ? 'bg-ink-850 border-gold-600 shadow-lg -translate-y-1'
                      : 'bg-ink-850 border-line hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm bg-gold-500/12 text-gold-500">
                        {node.number}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500 text-right">
                        {node.role}
                      </span>
                    </div>

                    {/* A gold gradient on white reads as muddy brown. */}
                    <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
                      {node.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-fg-body">
                      {node.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Mid-page CTA. The "F" placeholder mark is replaced by the
              real lockup, and the plain-text link is now a button. */}
          <div className="card-invert mt-8 p-6 rounded-2xl bg-ink-850 border border-line flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <img
                src="/logo-mark.png"
                alt=""
                width={400}
                height={284}
                className="h-12 w-auto object-contain shrink-0"
              />
              <div>
                <div className="text-base font-bold text-white">
                  Centralized FINOVATECK integration
                </div>
                <div className="text-sm text-fg-body mt-0.5 leading-relaxed">
                  Synchronizing high-density computing, power distribution and thermal equilibrium as a single operational discipline.
                </div>
              </div>
            </div>

            {onNavigate && (
              <button
                id="framework-explore-ops-btn"
                onClick={() => onNavigate('operations')}
                className="btn-primary w-full sm:w-auto px-5 py-3 text-sm shrink-0"
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
