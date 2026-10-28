import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Cpu,
  Flame,
  Activity,
  X
} from 'lucide-react';

import video2 from '../assets/video_2.mp4';
import poster2 from '../assets/stills/reel-2.webp';
import video5 from '../assets/video_5.mp4';
import poster5 from '../assets/stills/reel-5.webp';
import video6 from '../assets/video_6.mp4';
import poster6 from '../assets/stills/reel-6.webp';
import video8 from '../assets/video_8.mp4';
import poster8 from '../assets/stills/reel-8.webp';

export interface ReelItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  src: string;
  poster: string;
  stats: string;
  icon: React.ElementType;
}

export const REELS_DATA: ReelItem[] = [
  {
    id: 'reel-2',
    title: 'Thermal Negative-Pressure Exhaust',
    category: 'Cooling Dynamics',
    caption: 'High-volume exhaust bays expelling thermal heat with engineered 14°C delta isolation.',
    src: video2 || '/video_2.mp4',
    poster: poster2,
    stats: 'Delta T 14.2°C • Continuous',
    icon: Flame
  },
  {
    id: 'reel-5',
    title: 'ASIC Silicon Hashboards & Telemetry',
    category: 'Hardware Core',
    caption: 'Individual hashboard micro-sensors tracking chip temperature, voltage regulation, and fan RPM.',
    src: video5 || '/video_5.mp4',
    poster: poster5,
    stats: '68°C Junction • <1.2ms RTT',
    icon: Cpu
  },
  {
    id: 'reel-6',
    title: 'Industrial High-CFM Fan Matrix',
    category: 'Airflow Systems',
    caption: 'Aerodynamic intake fans drawing filtered ambient airflow across mining heat sinks.',
    src: video6 || '/video_6.mp4',
    poster: poster6,
    stats: '6,200 RPM • High Flow',
    icon: Activity
  },
  {
    id: 'reel-8',
    title: 'Master Control & Stratum Operations',
    category: 'Operations Desk',
    caption: 'Automated fleet monitoring and real-time hash balance dispatch to Bitcoin mining pools.',
    src: video8 || '/video_8.mp4',
    poster: poster8,
    stats: '99.9% Target • Stratum V2',
    icon: Activity
  }
];

export const FacilityReelsViewer: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Track playing state and audio state per video index
  const [playingStates, setPlayingStates] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  const [mutedStates, setMutedStates] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true
  });

  const [selectedModalReel, setSelectedModalReel] = useState<ReelItem | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isModalPlaying, setIsModalPlaying] = useState<boolean>(true);
  const [isModalMuted, setIsModalMuted] = useState<boolean>(false);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Pause all videos except the specified index (or all if no index provided)
  const pauseAllOtherVideos = (currentIndex?: number) => {
    videoRefs.current.forEach((video, i) => {
      if (i !== currentIndex && video && !video.paused) {
        video.pause();
      }
    });
    setPlayingStates(prev => {
      const nextState: Record<number, boolean> = {
        0: false, 1: false, 2: false, 3: false,
        4: false, 5: false, 6: false, 7: false
      };
      if (typeof currentIndex === 'number') {
        nextState[currentIndex] = true;
      }
      return nextState;
    });
  };

  // Scroll controls
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 20 : 320;
      const scrollAmount = direction === 'left' ? -step : step;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const togglePlay = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      // Pause any currently playing video first
      pauseAllOtherVideos(index);
      video.play().then(() => {
        setPlayingStates(prev => ({ ...prev, [index]: true }));
      }).catch(() => {
        video.muted = true;
        video.play().catch(() => {});
        setPlayingStates(prev => ({ ...prev, [index]: true }));
      });
    } else {
      video.pause();
      setPlayingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const toggleMute = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRefs.current[index];
    if (!video) return;

    video.muted = !video.muted;
    setMutedStates(prev => ({ ...prev, [index]: video.muted }));
  };

  const openFullscreenReel = (reel: ReelItem) => {
    // Pause all carousel videos when opening modal
    pauseAllOtherVideos();
    setSelectedModalReel(reel);
    setIsModalPlaying(true);
    setIsModalMuted(false);
  };

  const closeFullscreenReel = () => {
    setSelectedModalReel(null);
  };

  // Two hard-edged blur blobs read as a smudge behind the reels; the gold
  // wash is one continuous gradient across the whole band instead.
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-ink-880 bg-gold-wash band-seam text-white relative overflow-hidden border-b border-line">

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-gold-500" />
              <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold-500">
                Facility Reels
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Muscat Mining Operations in Motion
            </h2>
            <p className="text-base sm:text-lg text-fg-body mt-2 max-w-2xl leading-relaxed">
              Swipe or scroll horizontally through real operational footage from FINOVATECK’s containerized computing pods, ASIC clusters, and electrical infrastructure.
            </p>
          </div>

          {/* Navigation Chevron Buttons */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              id="reels-scroll-left"
              onClick={() => scroll('left')}
              className="p-3 rounded-xl bg-ink-850/90 hover:bg-ink-800 border border-line-warm text-fg-body hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="reels-scroll-right"
              onClick={() => scroll('right')}
              className="p-3 rounded-xl bg-ink-850/90 hover:bg-ink-800 border border-line-warm text-fg-body hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Reel Track */}
        <div 
          ref={scrollContainerRef}
          /* Full-bleed scroll area whose content still starts on the
             container edge, so the first reel is neither clipped by the
             overflow nor inset from the heading above it. */
          className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPaddingLeft: '1rem' }}
        >
          {REELS_DATA.map((reel, idx) => {
            const isPlaying = playingStates[idx] ?? false;
            const isMuted = mutedStates[idx] ?? true;
            const IconComponent = reel.icon;

            return (
              <div
                key={reel.id}
                className="shrink-0 w-[270px] sm:w-[300px] snap-start group relative rounded-2xl bg-ink-850 border border-line hover:border-gold-500/60 overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                {/* 9:16 Vertical Video Frame */}
                <div 
                  className="relative aspect-[9/16] w-full bg-ink-950 overflow-hidden cursor-pointer"
                  onClick={() => togglePlay(idx)}
                >
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={reel.src}
                    poster={reel.poster}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onPlay={() => pauseAllOtherVideos(idx)}
                    onPause={() => setPlayingStates(prev => ({ ...prev, [idx]: false }))}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/60 pointer-events-none" />

                  {/* Top Bar: Feed Tag & Fullscreen trigger */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-950/80 backdrop-blur-md border border-white/15 text-xs text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono">FEED 0{idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Audio Toggle */}
                      <button
                        onClick={(e) => toggleMute(idx, e)}
                        className="p-1.5 rounded-full bg-ink-950/80 backdrop-blur-md border border-line-warm text-fg-body hover:text-gold-500 transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-gold-500" />}
                      </button>

                      {/* Expand / Fullscreen */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFullscreenReel(reel);
                        }}
                        className="p-1.5 rounded-full bg-ink-950/80 backdrop-blur-md border border-line-warm text-fg-body hover:text-white transition-colors cursor-pointer"
                        title="Expand Reel"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Center Play/Pause Overlay Indicator (Fades out when playing, shows on hover or pause) */}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                      isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-gold-500 text-black flex items-center justify-center shadow-2xl backdrop-blur-md transform transition-transform group-hover:scale-110">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Video Overlays */}
                  <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[rgba(11,13,17,0.72)] backdrop-blur-sm border border-white/15 text-white text-xs font-semibold">
                      <IconComponent className="w-3 h-3" />
                      <span>{reel.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                      {reel.title}
                    </h4>

                    <div className="text-xs font-mono text-white/75 drop-shadow-sm">
                      {reel.stats}
                    </div>
                  </div>
                </div>

                {/* Card Bottom Control Bar with explicit Play/Pause button & caption */}
                <div className="p-4 bg-ink-850 border-t border-line grow flex flex-col justify-between">
                  <p className="text-xs text-fg-body leading-relaxed">
                    {reel.caption}
                  </p>

                </div>

              </div>
            );
          })}
        </div>

        {/* Scroll Progress / Status Prompt */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-fg-body gap-2 border-t border-line pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{REELS_DATA.length} operational feeds</span>
          </div>
          <div>Scroll or drag horizontally · tap a reel to play</div>
        </div>

      </div>

      {/* Fullscreen Video Modal View */}
      {selectedModalReel && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={closeFullscreenReel}
        >
          <div 
            className="relative w-full max-w-md max-h-[90vh] bg-ink-950 rounded-2xl border border-line shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-line bg-ink-850/90 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white truncate max-w-[240px]">
                  {selectedModalReel.title}
                </span>
              </div>
              <button
                onClick={closeFullscreenReel}
                className="p-1.5 rounded-full bg-ink-800 hover:bg-ink-700 text-fg-body hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Video Player */}
            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
              <video
                ref={modalVideoRef}
                src={selectedModalReel.src}
                autoPlay
                loop
                muted={isModalMuted}
                playsInline
                className="w-full h-full object-cover"
              />

              {/* In-Modal Controls Overlay */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10">
                <button
                  onClick={() => {
                    if (modalVideoRef.current) {
                      if (modalVideoRef.current.paused) {
                        modalVideoRef.current.play();
                        setIsModalPlaying(true);
                      } else {
                        modalVideoRef.current.pause();
                        setIsModalPlaying(false);
                      }
                    }
                  }}
                  className="btn-primary px-4 py-2 text-xs shadow-lg"
                >
                  {isModalPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isModalPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={() => {
                    if (modalVideoRef.current) {
                      modalVideoRef.current.muted = !modalVideoRef.current.muted;
                      setIsModalMuted(modalVideoRef.current.muted);
                    }
                  }}
                  className="p-2.5 rounded-xl bg-ink-850/90 border border-line-warm text-fg-body hover:text-gold-500 font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  {isModalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold-500" />}
                  <span>{isModalMuted ? 'Muted' : 'Audio On'}</span>
                </button>
              </div>
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 bg-ink-850/95 border-t border-line space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gold-500 font-semibold">{selectedModalReel.category}</span>
                <span className="text-fg-body">{selectedModalReel.stats}</span>
              </div>
              <p className="text-xs text-fg-body leading-relaxed">
                {selectedModalReel.caption}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
