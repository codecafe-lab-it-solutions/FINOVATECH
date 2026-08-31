import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowUpRight
} from 'lucide-react';
import { PageRoute } from '../types';
import finovatechMiningVideo from '../assets/finoatech_mining.mp4';

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

  return (
    <section
      id="hero-section"
      className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 lg:pt-40 lg:pb-24 overflow-hidden border-b border-gray-800 bg-[#0F172A]"
    >
      {/* 1. BACKGROUND REAL MINING VIDEO LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* FINOVATECH Authentic Mining Video Background */}
        <video
          ref={videoRef}
          src={finovatechMiningVideo || '/finoatech_mining.mp4'}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-75"
        />

        {/* Clean Directional Contrast Gradients (Keeps text razor sharp) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/70 to-[#0F172A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/60" />

        {/* Subtle institutional micro-grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* 2. MAIN EXPANSIVE HERO CONTENT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-2 sm:pt-4 pb-4">
        
        {/* Institutional Location & Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-900/90 border border-gray-700/90 shadow-xl backdrop-blur-md mb-5 sm:mb-6 hover:border-[#F7931A]/60 transition-all max-w-full">
          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#F7931A] animate-pulse shrink-0"></span>
          <span className="text-[11px] sm:text-xs font-semibold text-gray-200 tracking-wider uppercase font-mono truncate">
            Muscat, Sultanate of Oman
          </span>
          <span className="text-gray-600 hidden xs:inline">|</span>
          <span className="text-[11px] sm:text-xs font-medium text-emerald-400 font-mono hidden xs:inline">
            MCT-01 Node Active
          </span>
        </div>

        {/* Main Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto mb-5 sm:mb-6">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] sm:leading-[1.08]">
            Powering the Future of{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#F7931A] via-amber-400 to-[#F7931A]">
              Digital Assets
            </span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl font-medium text-gray-200 tracking-tight max-w-3xl mx-auto leading-snug">
            Bitcoin Mining. Industrial Infrastructure. Built for the Next Era of Global Settlement.
          </p>
        </div>

        {/* Supporting Narrative */}
        <p className="text-xs sm:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-md mb-6 sm:mb-8">
          FINOVATECH Mining Company operates high-density, containerized computing infrastructure engineered for thermal stability and sovereign energy efficiency from Muscat, Sultanate of Oman.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full">
          <button
            id="hero-explore-cta"
            onClick={() => onNavigate('operations')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#F7931A] hover:bg-[#E58514] text-gray-950 text-sm sm:text-base font-bold tracking-wide transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] cursor-pointer group min-h-[48px]"
          >
            <span>Explore Our Operations</span>
            <ArrowRight className="w-4 h-4 text-gray-950 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="hero-contact-cta"
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/90 hover:border-gray-500 text-white text-sm sm:text-base font-semibold tracking-wide transition-all shadow-lg backdrop-blur-md cursor-pointer min-h-[48px]"
          >
            <span>Contact FINOVATECH</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Centered Institutional Telemetry & Key Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl mx-auto text-left">
          
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800/90 shadow-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 text-[10px] sm:text-[11px] font-mono mb-1">
              <span>ALGORITHM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A]" />
            </div>
            <div className="text-xs sm:text-base font-bold text-white tracking-tight">SHA-256 Protocol</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">Bitcoin Core Network</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800/90 shadow-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 text-[10px] sm:text-[11px] font-mono mb-1">
              <span>UPTIME TARGET</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-xs sm:text-base font-bold text-emerald-400 tracking-tight">{hashRateFluctuation} Availability</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">Continuous Monitoring</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800/90 shadow-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 text-[10px] sm:text-[11px] font-mono mb-1">
              <span>LOCATION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
            <div className="text-xs sm:text-base font-bold text-white tracking-tight">Muscat, Oman</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">23.5880° N, 58.3829° E</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800/90 shadow-lg hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between text-gray-400 text-[10px] sm:text-[11px] font-mono mb-1">
              <span>FRAMEWORK</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <div className="text-xs sm:text-base font-bold text-white tracking-tight">4-Year Charter</div>
            <div className="text-[10px] sm:text-[11px] text-gray-400 font-mono mt-0.5">Renewable Term Lease</div>
          </div>

        </div>

      </div>
    </section>
  );
};

