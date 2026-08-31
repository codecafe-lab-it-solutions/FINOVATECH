import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Radio, 
  Sparkles,
  Server,
  Zap,
  Cpu,
  Layers,
  Flame,
  ShieldCheck,
  Activity,
  X
} from 'lucide-react';

import video1 from '../assets/video_1.mp4';
import video2 from '../assets/video_2.mp4';
import video3 from '../assets/video_3.mp4';
import video4 from '../assets/video_4.mp4';
import video5 from '../assets/video_5.mp4';
import video6 from '../assets/video_6.mp4';
import video7 from '../assets/video_7.mp4';
import video8 from '../assets/video_8.mp4';

export interface ReelItem {
  id: string;
  title: string;
  category: string;
  caption: string;
  src: string;
  stats: string;
  icon: React.ElementType;
}

export const REELS_DATA: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'MCT-01 High-Density ASIC Racks',
    category: 'Compute Array',
    caption: 'Active SHA-256 silicon clusters processing block transactions with 112 TH/s standard per unit.',
    src: video1 || '/video_1.mp4',
    stats: '112.4 TH/s • 3.24 kW',
    icon: Server
  },
  {
    id: 'reel-2',
    title: 'Thermal Negative-Pressure Exhaust',
    category: 'Cooling Dynamics',
    caption: 'High-volume exhaust bays expelling thermal heat with engineered 14°C delta isolation.',
    src: video2 || '/video_2.mp4',
    stats: 'Delta T 14.2°C • Continuous',
    icon: Flame
  },
  {
    id: 'reel-3',
    title: '33kV Substation & Power Distribution',
    category: 'Energy Grid',
    caption: 'Dedicated electrical step-down infrastructure delivering stabilized high-voltage industrial power.',
    src: video3 || '/video_3.mp4',
    stats: '0.985 Power Factor • 33 kV',
    icon: Zap
  },
  {
    id: 'reel-4',
    title: 'Modular Container Pod Alpha Deployment',
    category: 'Facility Pods',
    caption: 'Custom engineered weatherproof containers deployed on-site at Muscat facility node.',
    src: video4 || '/video_4.mp4',
    stats: 'Tier-3 Spec • Muscat Site',
    icon: Layers
  },
  {
    id: 'reel-5',
    title: 'ASIC Silicon Hashboards & Telemetry',
    category: 'Hardware Core',
    caption: 'Individual hashboard micro-sensors tracking chip temperature, voltage regulation, and fan RPM.',
    src: video5 || '/video_5.mp4',
    stats: '68°C Junction • &lt;1.2ms RTT',
    icon: Cpu
  },
  {
    id: 'reel-6',
    title: 'Industrial High-CFM Fan Matrix',
    category: 'Airflow Systems',
    caption: 'Aerodynamic intake fans drawing filtered ambient airflow across mining heat sinks.',
    src: video6 || '/video_6.mp4',
    stats: '6,200 RPM • High Flow',
    icon: Activity
  },
  {
    id: 'reel-7',
    title: 'Site Security & Perimeter Monitoring',
    category: 'Security & Access',
    caption: '24/7 biometric authentication, CCTV surveillance, and physical security protection.',
    src: video7 || '/video_7.mp4',
    stats: '24/7 Guarded • CCTV Active',
    icon: ShieldCheck
  },
  {
    id: 'reel-8',
    title: 'Master Control & Stratum Operations',
    category: 'Operations Desk',
    caption: 'Automated fleet monitoring and real-time hash balance dispatch to Bitcoin mining pools.',
    src: video8 || '/video_8.mp4',
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
      const scrollAmount = direction === 'left' ? -340 : 340;
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

  return (
    <section className="py-16 bg-[#0B1120] text-white relative overflow-hidden border-b border-gray-800">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F7931A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-[#F7931A] text-xs font-mono font-semibold mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>FACILITY REELS • 8 OPERATIONAL STREAMS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Muscat Mining Operations in Motion
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl">
              Swipe or scroll horizontally through real operational footage from FINOVATECH’s containerized computing pods, ASIC clusters, and electrical infrastructure.
            </p>
          </div>

          {/* Navigation Chevron Buttons */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              id="reels-scroll-left"
              onClick={() => scroll('left')}
              className="p-3 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="reels-scroll-right"
              onClick={() => scroll('right')}
              className="p-3 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Reel Track */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {REELS_DATA.map((reel, idx) => {
            const isPlaying = playingStates[idx] ?? false;
            const isMuted = mutedStates[idx] ?? true;
            const IconComponent = reel.icon;

            return (
              <div
                key={reel.id}
                className="shrink-0 w-[270px] sm:w-[300px] snap-start group relative rounded-3xl bg-gray-900 border border-gray-800 hover:border-[#F7931A]/60 overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                {/* 9:16 Vertical Video Frame */}
                <div 
                  className="relative aspect-[9/16] w-full bg-gray-950 overflow-hidden cursor-pointer"
                  onClick={() => togglePlay(idx)}
                >
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={reel.src}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onPlay={() => pauseAllOtherVideos(idx)}
                    onPause={() => setPlayingStates(prev => ({ ...prev, [idx]: false }))}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-gray-950/60 pointer-events-none" />

                  {/* Top Bar: Feed Tag & Fullscreen trigger */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur-md border border-gray-700/80 text-[10px] font-mono text-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>FEED 0{idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Audio Toggle */}
                      <button
                        onClick={(e) => toggleMute(idx, e)}
                        className="p-1.5 rounded-full bg-gray-950/80 backdrop-blur-md border border-gray-700 text-gray-300 hover:text-[#F7931A] transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#F7931A]" />}
                      </button>

                      {/* Expand / Fullscreen */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFullscreenReel(reel);
                        }}
                        className="p-1.5 rounded-full bg-gray-950/80 backdrop-blur-md border border-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
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
                    <div className="w-14 h-14 rounded-full bg-[#F7931A] text-gray-950 flex items-center justify-center shadow-2xl backdrop-blur-md transform transition-transform group-hover:scale-110">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current translate-x-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Bottom Video Overlays */}
                  <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F7931A]/20 border border-[#F7931A]/40 text-[#F7931A] text-[10px] font-mono font-bold">
                      <IconComponent className="w-3 h-3" />
                      <span>{reel.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug drop-shadow-md line-clamp-2">
                      {reel.title}
                    </h4>

                    <div className="text-[11px] font-mono text-emerald-400 font-semibold drop-shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>{reel.stats}</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Control Bar with explicit Play/Pause button & caption */}
                <div className="p-4 bg-gray-900 border-t border-gray-800 grow flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 font-normal">
                    {reel.caption}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 gap-2">
                    <button
                      id={`reel-play-btn-${idx + 1}`}
                      onClick={(e) => togglePlay(idx, e)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700'
                          : 'bg-[#F7931A] hover:bg-[#E58514] text-gray-950 shadow-md'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Video</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Reel</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Scroll Progress / Status Prompt */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-gray-500 gap-2 border-t border-gray-800/60 pt-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>8 High-Definition Telemetry Feeds Active (video_1 through video_8)</span>
          </div>
          <div className="text-gray-400">
            Scroll or drag horizontally • Tap any reel to play/pause
          </div>
        </div>

      </div>

      {/* Fullscreen Video Modal View */}
      {selectedModalReel && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          onClick={closeFullscreenReel}
        >
          <div 
            className="relative w-full max-w-md max-h-[90vh] bg-gray-950 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/90 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white truncate max-w-[240px]">
                  {selectedModalReel.title}
                </span>
              </div>
              <button
                onClick={closeFullscreenReel}
                className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white cursor-pointer transition-colors"
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
                  className="px-4 py-2 rounded-xl bg-[#F7931A] text-gray-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
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
                  className="p-2.5 rounded-xl bg-gray-900/90 border border-gray-700 text-gray-200 hover:text-[#F7931A] font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  {isModalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#F7931A]" />}
                  <span>{isModalMuted ? 'Muted' : 'Audio On'}</span>
                </button>
              </div>
            </div>

            {/* Modal Info Footer */}
            <div className="p-4 bg-gray-900/95 border-t border-gray-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F7931A] font-semibold">{selectedModalReel.category}</span>
                <span className="text-emerald-400">{selectedModalReel.stats}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {selectedModalReel.caption}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
