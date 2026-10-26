import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';
import finovateckMiningVideo from '../assets/finoatech_mining.mp4';

interface HeroProps {
  onNavigate: (route: PageRoute) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [hashRateFluctuation, setHashRateFluctuation] = useState<string>('99.94%');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Hashrate telemetry jitter
  useEffect(() => {
    const interval = setInterval(() => {
      const randomRate = (99.85 + Math.random() * 0.12).toFixed(2);
      setHashRateFluctuation(`${randomRate}%`);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Auto-play trigger on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const telemetry = [
    { label: 'ALGORITHM', value: 'SHA-256 Protocol', sub: 'Bitcoin Core Network', dot: 'bg-gold-500' },
    { label: 'UPTIME TARGET', value: `${hashRateFluctuation} Availability`, sub: 'Continuous Monitoring', dot: 'bg-emerald-400 animate-pulse', accent: true },
    { label: 'LOCATION', value: 'Muscat, Oman', sub: '23.5880° N, 58.3829° E', dot: 'bg-gold-400' },
    { label: 'FRAMEWORK', value: '4-Year Charter', sub: 'Renewable Term Lease', dot: 'bg-gold-200' },
  ];

  return (
    <section
      id="hero-section"
      className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-line bg-ink-950"
    >
      {/* 1. BACKGROUND MINING VIDEO LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={finovateckMiningVideo || '/finoatech_mining.mp4'}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-40 saturate-50"
        />

        {/* Deck-style blackout: the deck keeps photography at ~40% under heavy black */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,transparent,rgba(0,0,0,0.85))]" />

        {/* Gold bloom behind the wordmark */}
        <div className="absolute inset-x-0 top-0 h-[520px] bg-bloom" />

        {/* Light-trail ribbons — the deck's signature curves */}
        <svg
          className="absolute inset-x-0 top-10 w-full h-[420px] opacity-70"
          viewBox="0 0 1200 420"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroTrail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#CCA84F" stopOpacity="0" />
              <stop offset="45%" stopColor="#F4E183" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#CCA84F" stopOpacity="0" />
            </linearGradient>
            <filter id="heroTrailGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          {[
            'M-40 300 C 240 300, 330 90, 600 90 S 960 300, 1240 300',
            'M-40 370 C 280 370, 360 150, 600 150 S 920 370, 1240 370',
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="url(#heroTrail)" strokeWidth="6" filter="url(#heroTrailGlow)" opacity="0.5" />
              <path
                d={d}
                stroke="url(#heroTrail)"
                strokeWidth="1.25"
                strokeDasharray="200 400"
                className="animate-trace-flow"
                style={{ animationDelay: `${i * 2}s` }}
              />
            </g>
          ))}
        </svg>

        {/* Faint circuit texture */}
        <div className="absolute inset-0 bg-circuit" />
      </div>

      {/* 2. MAIN HERO CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-2 sm:pt-4 pb-4">

        {/* Location & Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-ink-850/80 border border-gold-700/40 shadow-xl backdrop-blur-md mb-6 sm:mb-7 hover:border-gold-500/70 transition-all max-w-full">
          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-gold-400 animate-pulse shrink-0 glow-gold-sm"></span>
          <span className="text-[11px] sm:text-xs font-semibold text-fg-body tracking-wider uppercase font-mono truncate">
            Muscat, Sultanate of Oman
          </span>
          <span className="text-gold-800 hidden xs:inline">|</span>
          <span className="text-[11px] sm:text-xs font-medium text-emerald-400 font-mono hidden xs:inline">
            MCT-01 Node Active
          </span>
        </div>

        {/* Main Headline — metal gradient on the emphasis line */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.12] sm:leading-[1.08]">
            Powering the Future of{' '}
            <span className="text-metal inline-block pb-1">Digital Assets</span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl font-medium text-fg-body max-w-3xl mx-auto leading-snug">
            Bitcoin Mining. Industrial Infrastructure. Built for the Next Era of Global Settlement.
          </p>
        </div>

        {/* Supporting Narrative */}
        <p className="text-xs sm:text-base lg:text-lg text-fg-muted leading-relaxed max-w-2xl mx-auto font-normal mb-7 sm:mb-9">
          FINOVATECK Mining Company operates high-density, containerized computing infrastructure engineered for thermal stability and sovereign energy efficiency from Muscat, Sultanate of Oman.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full">
          <button
            id="hero-explore-cta"
            onClick={() => onNavigate('operations')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[linear-gradient(180deg,#F4E183_0%,#E2C873_42%,#CCA84F_100%)] hover:brightness-110 text-black text-sm sm:text-base font-bold tracking-wide transition-all glow-gold hover:scale-[1.02] cursor-pointer group min-h-[48px]"
          >
            <span>Explore Our Operations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            id="hero-secondary-cta"
            onClick={() => onNavigate('infrastructure')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-ink-850/70 border border-gold-700/40 hover:border-gold-500/70 backdrop-blur-md text-fg-body hover:text-white text-sm sm:text-base font-semibold tracking-wide transition-all cursor-pointer min-h-[48px]"
          >
            View Infrastructure
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto text-left">
          {telemetry.map((t) => (
            <div
              key={t.label}
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-ink-850/80 backdrop-blur-md border border-line-warm shadow-lg hover:border-gold-700/60 transition-colors"
            >
              <div className="flex items-center justify-between text-fg-muted text-[10px] sm:text-[11px] font-mono mb-1">
                <span>{t.label}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
              </div>
              <div className={`text-xs sm:text-base font-bold tracking-tight ${t.accent ? 'text-emerald-400' : 'text-white'}`}>
                {t.value}
              </div>
              <div className="text-[10px] sm:text-[11px] text-fg-muted font-mono mt-0.5">{t.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
