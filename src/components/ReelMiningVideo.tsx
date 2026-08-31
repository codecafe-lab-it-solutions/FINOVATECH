import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Flame, 
  Zap, 
  Activity, 
  Radio, 
  Upload,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { MiningPodReelCanvas } from './MiningPodReelCanvas';
import finovatechMiningVideo from '../assets/finoatech_mining.mp4';

interface ReelMiningVideoProps {
  className?: string;
}

const REEL_VIDEOS = [
  {
    id: 'asic-racks',
    title: 'FINOVATECH MCT-01 Mining Array',
    subtitle: 'ASIC Silicon Cluster • 112 TH/s',
    videoUrl: finovatechMiningVideo || '/finoatech_mining.mp4',
    location: 'Muscat Site 01',
    hashrate: '112.4 TH/s',
    power: '3.24 kW/unit',
    temp: '64.2°C'
  },
  {
    id: 'wind-power',
    title: 'Renewable Generation Substation',
    subtitle: 'Green Energy Node • 3.2 MW Input',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Wind_Turbines_in_the_Sunset.webm/Wind_Turbines_in_the_Sunset.webm.720p.vp9.webm',
    location: 'Muscat Hybrid Node',
    hashrate: '114.8 TH/s',
    power: '3.18 kW/unit',
    temp: '62.8°C'
  },
  {
    id: 'thermal-cooling',
    title: 'Hot/Cold Aisle Thermal Containment',
    subtitle: 'Negative Pressure • Delta 14°C',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/82/Wind_turbines_generating_electricity.webm/Wind_turbines_generating_electricity.webm.480p.vp9.webm',
    location: 'Thermal Exhaust Bay',
    hashrate: '110.9 TH/s',
    power: '3.21 kW/unit',
    temp: '65.1°C'
  }
];

export const ReelMiningVideo: React.FC<ReelMiningVideoProps> = ({ className = '' }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [liveHashrate, setLiveHashrate] = useState<number>(112.4);
  const [liveTemp, setLiveTemp] = useState<number>(64.8);
  const [fanRpm, setFanRpm] = useState<number>(5840);
  const [viewMode, setViewMode] = useState<'hybrid' | 'canvas' | 'video'>('hybrid');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentVideo = REEL_VIDEOS[activeVideoIndex];

  // Auto-play when active index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [activeVideoIndex]);

  // Live telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveHashrate(+(110 + Math.random() * 4.8).toFixed(1));
      setLiveTemp(+(63.2 + Math.random() * 2.5).toFixed(1));
      setFanRpm(Math.floor(5750 + Math.random() * 220));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveVideoIndex((prev) => (prev + 1) % REEL_VIDEOS.length);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      
      {/* Reel Shell Container (9:16 Aspect Ratio) */}
      <div 
        onClick={togglePlay}
        className="relative w-[290px] sm:w-[320px] lg:w-[340px] aspect-[9/16] rounded-3xl overflow-hidden bg-[#090D16] border-[5px] border-gray-900 shadow-2xl ring-1 ring-gray-800/90 group cursor-pointer select-none transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/15 hover:border-gray-800"
      >
        
        {/* Layer 1: 60fps High-Density ASIC Mining Pod Animation (Hardware Simulation) */}
        {(viewMode === 'hybrid' || viewMode === 'canvas') && (
          <MiningPodReelCanvas activeMode={activeVideoIndex} />
        )}

        {/* Layer 2: Streaming Background Reel Video */}
        {(viewMode === 'hybrid' || viewMode === 'video') && (
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              viewMode === 'hybrid' ? 'opacity-40 mix-blend-screen' : 'opacity-100'
            }`}
          />
        )}

        {/* Ambient Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/90 via-transparent to-gray-950/95 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/30 pointer-events-none" />

        {/* 1. Multi-Segment Stories / Reel Progress Bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5 pointer-events-none">
          {REEL_VIDEOS.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F7931A] transition-all duration-150"
                style={{
                  width: idx < activeVideoIndex ? '100%' : idx === activeVideoIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* 2. Top Header Bar */}
        <div className="absolute top-6 left-0 right-0 px-4 pt-2 z-20 flex items-center justify-between text-white font-mono text-[11px]">
          
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-bold text-[10px] tracking-wider text-red-400">REC</span>
            <span className="text-gray-300 text-[10px]">MCT-01</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Mute Button */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/15 transition-transform active:scale-90 cursor-pointer shadow-md"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-300" /> : <Volume2 className="w-3.5 h-3.5 text-[#F7931A]" />}
            </button>

            {/* Switch Reel Stream */}
            <button
              onClick={handleNextVideo}
              title="Next Mining Reel Stream"
              className="p-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/15 transition-transform active:scale-90 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* 3. Floating Play / Pause Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all">
            <div className="w-16 h-16 rounded-full bg-[#F7931A] text-gray-950 flex items-center justify-center shadow-2xl pl-1 scale-110 transition-transform">
              <Play className="w-7 h-7 fill-current" />
            </div>
          </div>
        )}

        {/* 4. Live Mining Telemetry HUD Overlay */}
        <div className="absolute top-16 left-4 z-20 space-y-1.5 font-mono text-[10px] text-white">
          
          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 w-fit shadow-md">
            <Zap className="w-3.5 h-3.5 text-[#F7931A]" />
            <span className="text-gray-300">HASH:</span>
            <span className="font-bold text-[#F7931A]">{liveHashrate} TH/s</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 w-fit shadow-md">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-gray-300">CORE:</span>
            <span className="font-bold text-emerald-400">{liveTemp} °C</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 w-fit shadow-md">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-gray-300">FANS:</span>
            <span className="font-bold text-cyan-300">{fanRpm} RPM</span>
          </div>
        </div>

        {/* 5. Right-Hand Reel Action Toolbar */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-3">
          
          {/* Live Node Beacon */}
          <div className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-md border border-white/15 flex flex-col items-center justify-center text-white text-[9px] font-mono shadow-lg">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[8px] text-gray-400 font-bold">LIVE</span>
          </div>

          {/* Reel Feed Switcher Indicator */}
          <div 
            onClick={handleNextVideo}
            title="Next Mining Reel Feed"
            className="w-10 h-10 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/15 flex flex-col items-center justify-center text-white text-[10px] font-mono shadow-lg cursor-pointer hover:border-[#F7931A] transition-colors"
          >
            <span className="text-[#F7931A] font-bold">0{activeVideoIndex + 1}</span>
            <span className="text-[8px] text-gray-400">/03</span>
          </div>

          {/* Mode Switcher (Hybrid vs Canvas vs Video) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode((m) => m === 'hybrid' ? 'canvas' : m === 'canvas' ? 'video' : 'hybrid');
            }}
            title={`Current view: ${viewMode}. Tap to change visual mode.`}
            className="w-10 h-10 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/15 flex flex-col items-center justify-center text-white text-[9px] font-mono shadow-lg cursor-pointer hover:border-cyan-400 transition-colors"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Upload Custom Mining Video File */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            title="Upload custom mining video file from device"
            className="w-10 h-10 rounded-full bg-black/80 hover:bg-[#F7931A] hover:text-gray-950 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
          >
            <Upload className="w-4 h-4" />
          </div>

        </div>

        {/* 6. Bottom Narrative & Verification Metadata */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-4 z-20 text-white space-y-1.5">
          
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F7931A] text-gray-950 text-[10px] font-extrabold uppercase font-mono tracking-wider">
              ASIC POD // MCT-01
            </span>
            <span className="text-[10.5px] font-mono text-gray-300">
              Muscat, Oman
            </span>
          </div>

          <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
            {currentVideo.title}
          </h4>

          <p className="text-[11.5px] text-gray-300 line-clamp-2 leading-relaxed">
            High-density containerized Bitcoin computing cluster operating under continuous thermal and electrical modulation.
          </p>

          <div className="text-[10px] font-mono text-[#F7931A] flex items-center gap-2 pt-0.5">
            <span>#FINOVATECH</span>
            <span>#BitcoinMining</span>
            <span>#OmanInfrastructure</span>
          </div>

        </div>

        {/* Hidden File Input for Custom Video Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="video/mp4,video/webm,video/mov,video/m4v"
          onChange={handleFileUpload}
          className="hidden"
        />

      </div>

      {/* Reel Subtitle Caption / Interaction Helper */}
      <div className="flex items-center justify-between w-[290px] sm:w-[320px] lg:w-[340px] mt-3 px-1 text-xs text-gray-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tap Reel to {isPlaying ? 'Pause' : 'Play'}</span>
        </span>
        <button
          onClick={() => handleNextVideo()}
          className="text-[#F7931A] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
        >
          <span>Next Feed ({activeVideoIndex + 1}/3)</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};

