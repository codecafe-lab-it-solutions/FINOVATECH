import React, { useState } from 'react';
import { Cpu, Zap, Fan, Network, Activity, ShieldCheck, Check, ChevronRight } from 'lucide-react';
import { INFRASTRUCTURE_PILLARS, OPERATING_FACTS } from '../data/companyData';
import { PageRoute } from '../types';
import podWall from '../assets/stills/pod-wall.webp';
import powerRack from '../assets/stills/power-rack.webp';

/* Each module gets the frame from the operator footage that actually
   shows it, so the spec ledger is backed by something real. */
const PILLAR_STILLS: Record<string, { src: string; alt: string }> = {
  hpc:        { src: podWall,   alt: 'Liquid-cooled mining units mounted on the compute wall' },
  energy:     { src: powerRack, alt: 'Per-rack breaker distribution and fused circuit runs' },
  cooling:    { src: podWall,   alt: 'Closed coolant manifold feeding the mining units' },
  network:    { src: powerRack, alt: 'Structured cabling running through the distribution rack' },
  monitoring: { src: powerRack, alt: 'Instrumented distribution board under routine inspection' },
  security:   { src: podWall,   alt: 'Secured compute wall inside the container envelope' },
};

interface MiningInfrastructureProps {
  onNavigate?: (route: PageRoute) => void;
}

export const MiningInfrastructure: React.FC<MiningInfrastructureProps> = ({ onNavigate }) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>(INFRASTRUCTURE_PILLARS[0].id);

  const selectedPillar = INFRASTRUCTURE_PILLARS.find((p) => p.id === selectedPillarId) || INFRASTRUCTURE_PILLARS[0];

  const getPillarIcon = (iconName: string, active: boolean) => {
    // The tabs are a light surface on a dark band, so these are literal
    // values rather than tokens, which would resolve for the dark theme.
    const iconClass = `w-5 h-5 ${active ? 'text-[#8A6B1E]' : 'text-[#0A0D12]'}`;
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={iconClass} />;
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Fan':
        return <Fan className={iconClass} />;
      case 'Network':
        return <Network className={iconClass} />;
      case 'Activity':
        return <Activity className={iconClass} />;
      case 'ShieldCheck':
        return <ShieldCheck className={iconClass} />;
      default:
        return <Cpu className={iconClass} />;
    }
  };

  return (
    <section id="infrastructure-section" className="py-12 md:py-16 lg:py-24 bg-ink-880 band-seam border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-12 lg:mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
              Infrastructure Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Institutional Infrastructure Components
          </h2>
          <p className="text-base sm:text-lg text-fg-body leading-relaxed">
            Every layer of FINOVATECK's computational facility in Muscat is engineered to institutional specifications for thermal resilience, energy efficiency, and uninterrupted connectivity.
          </p>
        </div>

        {/* 6 Tab Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {INFRASTRUCTURE_PILLARS.map((pillar) => {
            const isSelected = selectedPillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                id={`infra-tab-${pillar.id}`}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer flex flex-col bg-white bg-dot-grid ${
                  isSelected
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/45 shadow-lg'
                    : 'border-[#E4E7EC] hover:border-[#D4AF37] shadow-sm'
                }`}
              >
                <div className={`p-1.5 rounded-lg w-fit mb-3 ${isSelected ? 'bg-[#D4AF37]/20' : 'bg-[#0A0D12]/6'}`}>
                  {getPillarIcon(pillar.iconName, isSelected)}
                </div>
                {/* Two lines reserved so every label sits on one baseline. */}
                <div className="text-[13px] font-bold tracking-tight leading-snug line-clamp-2 lg:min-h-[2.5rem] text-[#0A0D12]">
                  {pillar.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Detailed Architecture Card */}
        {/* A light card on the dark band. theme-light repoints the colour
            variables for this subtree, so the bg-ink, text and border-line
            utilities inside resolve to their paper values untouched. */}
        <div className="theme-light rounded-2xl bg-ink-850 border border-line p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Narrative & Engineering Key Points */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-ink-800 border border-line text-xs font-semibold text-fg-body mb-3">
                  <span>Module</span>
                  <span className="font-mono text-white">{selectedPillar.id.toUpperCase()}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedPillar.title}
                </h3>
                <p className="text-sm font-medium text-gold-500 mt-1">
                  {selectedPillar.tagline}
                </p>
              </div>

              <p className="text-base text-fg-body leading-relaxed">
                {selectedPillar.description}
              </p>

              {/* Engineering Highlights */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                  Engineering Standards & Design Protocols
                </div>
                {/* Dark hairline and near-black copy: border-line resolves to
                    #E4E7EC on paper, which all but disappeared on these rows. */}
                {selectedPillar.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#1F2937] bg-ink-900 p-3.5 rounded-xl border border-[#1F2937]">
                    <Check className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The photo stretches to the narrative's height, so the two
                columns end on the same line instead of leaving a 250px
                hole under the bullets. */}
            <figure className="lg:col-span-5 media-frame min-h-[320px]">
              <img
                src={(PILLAR_STILLS[selectedPillar.id] || PILLAR_STILLS.hpc).src}
                alt={(PILLAR_STILLS[selectedPillar.id] || PILLAR_STILLS.hpc).alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Literal white: this caption sits on the photo's dark
                  gradient, so it must not follow the card into theme-light. */}
              <figcaption className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-10 bg-gradient-to-t from-black/85 to-transparent text-xs text-[rgba(255,255,255,0.9)]">
                {selectedPillar.title} · {OPERATING_FACTS.nodeId}
              </figcaption>
            </figure>

          </div>

          {/* The spec ledger is a full-width row now, which is also what
              stopped it from dictating the right column's height. */}
          <div className="mt-8 rounded-xl bg-ink-900 border border-line p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-line">
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Technical Specifications
              </span>
              <span className="text-xs text-fg-body">Design targets</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedPillar.specs.map((spec, idx) => (
                <div key={idx}>
                  <div className="text-xs text-fg-body mb-1">{spec.label}</div>
                  <div className="text-sm font-mono font-bold text-white leading-snug">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="pt-5 mt-5 border-t border-line text-xs text-fg-body leading-relaxed">
              Hardware specifications are configured for Muscat climate and electrical regulatory parameters.
            </div>
          </div>

          {/* The CTA used to hang under the right column only, which is also
              where the two columns fell out of step. It now closes the card. */}
          {onNavigate && (
            <div className="mt-8 pt-6 border-t border-line flex justify-center">
              <button
                id="infra-full-page-btn"
                onClick={() => onNavigate('infrastructure')}
                className="btn-primary px-6 py-3 text-sm"
              >
                <span>Explore Full Infrastructure Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
