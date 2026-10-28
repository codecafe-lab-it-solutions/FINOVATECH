import React, { useEffect, useRef } from 'react';
import { Building2, Shield, Cpu, Clock, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';
import { OPERATING_FACTS } from '../data/companyData';
import containerTech from '../assets/stills/container-tech.webp';
import containerTechVideo from '../assets/video_3.mp4';

interface AboutSectionProps {
  onNavigate?: (route: PageRoute) => void;
  showExtended?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate, showExtended = false }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* Play only while the section is on screen. The clip is ~5.7MB on top of
     the hero's own footage, so eager autoplay would pull it down for every
     visitor including those who never scroll this far. Muting in script as
     well as in markup is what satisfies the autoplay policies. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof IntersectionObserver === 'undefined') {
      video.muted = true;
      video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-section" className="theme-light py-12 md:py-16 lg:py-24 bg-ink-900 border-b border-line">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-gold-600"></span>
          <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
            Corporate Profile & Operations
          </span>
        </div>

        {/* items-center against a taller right column pushed the heading
            ~120px down and left the eyebrow floating on its own. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-stretch">

          {/* Left Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Building Infrastructure for the Digital Asset Economy
            </h2>

            <div className="space-y-4 text-base sm:text-lg text-fg-body leading-relaxed">
              <p>
                <strong className="font-semibold text-white">FINOVATECK Mining Company</strong> is a Muscat-based digital-assets and Bitcoin-mining enterprise focused on developing and operating high-density technology infrastructure supporting the global digital-asset economy.
              </p>
              <p>
                Our approach combines computing infrastructure, operational discipline, and technology-driven execution to build resilient, sovereign digital-asset operations with strict engineering standards and transparent operational horizons.
              </p>
              {showExtended && (
                <p className="text-fg-muted">
                  Operating under a defined four-year lease term from Muscat, FINOVATECK applies systematic facility management, thermal optimization, and institutional governance to ensure every Megawatt of computing power delivers resilient cryptographic integrity.
                </p>
              )}
            </div>

            {/* Core Institutional Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-fg-body uppercase tracking-eyebrow">Headquarters</div>
                    <div className="text-sm font-bold text-white">Muscat, Oman</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-fg-body uppercase tracking-eyebrow">Operating Term</div>
                    <div className="text-sm font-bold text-white">4-Year Defined Lease</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-fg-body uppercase tracking-eyebrow">Core Discipline</div>
                    <div className="text-sm font-bold text-white">Bitcoin Mining Compute</div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ink-850 border border-line/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-ink-800 text-fg-body shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-fg-body uppercase tracking-eyebrow">Established</div>
                    <div className="text-sm font-bold text-white">2 October 2025</div>
                  </div>
                </div>
              </div>
            </div>

            {onNavigate && (
              <div className="pt-2">
                <button
                  id="about-learn-more-btn"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-start gap-2 text-left text-sm font-semibold text-white hover:text-gold-500 transition-colors cursor-pointer group"
                >
                  <span>Learn more about our governance and corporate standards</span>
                  <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: site photography, so the corporate narrative
              lands against something real. The frame stretches to the
              narrative's height so both columns end on the same line. */}
          <div className="lg:col-span-6 flex flex-col">
            <figure className="media-frame card-invert aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-[420px]">
              {/* This was the poster still on its own, so the frame never
                  moved. The still is now the poster for its own footage,
                  which autoplays muted and inline the way the hero does. */}
              <video
                ref={videoRef}
                src={containerTechVideo}
                poster={containerTech}
                aria-label="FINOVATECK technician accessing a containerized mining unit on site"
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-10 bg-gradient-to-t from-black/85 to-transparent">
                <div className="text-sm font-bold text-white tracking-tight">
                  Site operations · {OPERATING_FACTS.nodeId}
                </div>
                <div className="text-xs font-mono text-white/70 mt-0.5">
                  Muscat, Sultanate of Oman
                </div>
              </figcaption>
            </figure>
          </div>

        </div>
      </div>
    </section>
  );
};
