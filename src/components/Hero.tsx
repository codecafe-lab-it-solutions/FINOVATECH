import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';
import { OPERATING_FACTS } from '../data/companyData';
import finovateckMiningVideo from '../assets/finoatech_mining.mp4';
import heroPoster from '../assets/stills/hero-poster.webp';

interface HeroProps {
  onNavigate: (route: PageRoute) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-play trigger on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  /* These were previously re-rolled every 2.8s, so the uptime figure
     changed between renders and disagreed with the rest of the page.
     They are stated targets now, and they read from the one source. */
  const telemetry = [
    { label: 'Algorithm', value: 'SHA-256 Protocol', sub: 'Bitcoin Core Network' },
    { label: 'Uptime Target', value: `${OPERATING_FACTS.uptimeTarget} Availability`, sub: 'Continuous Monitoring' },
    { label: 'Location', value: 'Muscat, Oman', sub: OPERATING_FACTS.coordinates, mono: true },
    { label: 'Framework', value: '4-Year Charter', sub: 'Defined Term Lease' },
  ];

  return (
    <section
      id="hero-section"
      /* The hero owns the whole first screen: at anything under 100dvh the
         next section's light background shows below the fold. dvh rather
         than vh so mobile browser chrome does not overshoot it. The stack
         inside is tight enough to clear the fold on a 631px-tall viewport,
         which is what 92vh used to push the stat cards past. */
      className="relative flex items-center min-h-[100dvh] pt-24 pb-12 overflow-hidden border-b border-line bg-ink-950"
    >
      {/* ── FULL-BLEED BACKGROUND FOOTAGE ────────────────────────────
          The footage runs edge to edge. Legibility is bought with a
          centred dark pool behind the copy rather than by dimming the
          whole frame, so the turbines and pods stay clearly visible
          around the edges while the headline sits on solid contrast. */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={finovateckMiningVideo || '/finoatech_mining.mp4'}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.78]"
        />

        {/* Edge anchoring: darkens under the navbar and fades into the
            next section, leaving the middle of the frame open. The bottom
            third resolves fully to the page colour so the stat cards sit
            on a clean base rather than on moving footage. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,13,17,0.88)_0%,transparent_32%,transparent_58%,rgba(11,13,17,0.92)_88%,#0B0D11_100%)]" />

        {/* The text pool — strong at the centre, gone by the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_68%_58%_at_50%_44%,rgba(0,0,0,0.80),rgba(0,0,0,0.35)_62%,transparent_80%)]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">

        {/* Status badge. The location half was cut — the subheading
            directly below already says Muscat, Sultanate of Oman. */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/45 border border-white/15 shadow-xl backdrop-blur-md mb-5 max-w-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="text-xs font-semibold text-white tracking-eyebrow uppercase truncate">
            Node <span className="font-mono">{OPERATING_FACTS.nodeId}</span> Operational
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] sm:leading-[1.06] text-shadow-media">
            Powering the Future of Digital Assets
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl font-medium text-white/90 max-w-2xl mx-auto leading-snug text-shadow-media">
            Bitcoin mining and industrial computing infrastructure, operated from Muscat, Sultanate of Oman.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full">
          <button
            id="hero-explore-cta"
            onClick={() => onNavigate('operations')}
            className="btn-primary w-full sm:w-auto px-8 py-4 text-base group min-h-[48px]"
          >
            <span>Explore Our Operations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            id="hero-secondary-cta"
            onClick={() => onNavigate('infrastructure')}
            className="btn-secondary w-full sm:w-auto px-8 py-4 text-base backdrop-blur-md bg-black/35 min-h-[48px]"
          >
            View Infrastructure
          </button>
        </div>

        {/* Telemetry Grid — champagne-gold panels over the footage. The
            surface is a light gold rather than the saturated #D4AF37 of
            the CTA above: four blocks of the button's own gold would
            flatten it. Colours are literal because the hero runs
            dark-themed while these panels are a light surface. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          {telemetry.map((t) => (
            <div
              key={t.label}
              className="p-4 rounded-2xl bg-[linear-gradient(145deg,rgba(248,237,201,0.96)_0%,rgba(233,214,157,0.94)_100%)] backdrop-blur-md border border-[#D4AF37]/70 shadow-xl hover:border-[#D4AF37] transition-colors"
            >
              <div className="text-xs font-semibold uppercase tracking-eyebrow text-[#14100A] mb-1.5">
                {t.label}
              </div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-[#14100A]">
                {t.value}
              </div>
              <div className={`text-xs text-[#574620] mt-0.5 ${t.mono ? 'font-mono' : ''}`}>{t.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
