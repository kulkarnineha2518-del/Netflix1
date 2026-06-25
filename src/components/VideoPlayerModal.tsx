import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  ArrowLeft, RotateCcw, RotateCw, Settings, Subtitles 
} from "lucide-react";
import { Movie } from "../types";

interface VideoPlayerModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function VideoPlayerModal({ movie, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isSubtitlesActive, setIsSubtitlesActive] = useState(false);

  // Controls hide timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  // Video Events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);

    // Auto-play
    video.play().catch(() => {
      // Browsers prevent autoplayers sometimes, handled gracefully
    });

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
    };
  }, [movie]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    videoRef.current.muted = nextMute;
    if (!nextMute && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Fullscreen change listener (handles Esc key press)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  // Format seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div 
      id="video-player-container"
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
        className="w-full h-full object-contain"
        loop
        playsInline
      />

      {/* Buffering Indicator */}
      <AnimatePresence>
        {isBuffering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-30 pointer-events-none"
          >
            <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg font-medium tracking-wide">Buffering cinematic stream...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click overlay for play/pause */}
      <div 
        className="absolute inset-0 z-10 cursor-pointer" 
        onClick={togglePlay}
      />

      {/* Top Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-20 pointer-events-auto"
          >
            <div className="flex items-center gap-4">
              <button 
                id="btn-back-from-player"
                onClick={onClose} 
                className="p-3 text-white hover:bg-white/20 rounded-full transition-all duration-200 cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <span className="text-gray-400 text-xs tracking-wider uppercase font-semibold">Now Playing</span>
                <h1 className="text-white text-lg md:text-2xl font-bold tracking-tight">{movie.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-netflix-red text-white tracking-widest uppercase rounded">
                1080p Ultra HD
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-semibold bg-white/20 text-white tracking-wider rounded">
                Stereo 5.1
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Controls (Quick Skip/Play visual indicator) */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12 z-20 pointer-events-auto"
          >
            <button
              onClick={skipBackward}
              className="p-4 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              title="10 Seconds Back"
            >
              <RotateCcw className="w-8 h-8" />
            </button>

            <button
              onClick={togglePlay}
              className="p-6 rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-2xl"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-10 h-10 fill-black" /> : <Play className="w-10 h-10 fill-black ml-1" />}
            </button>

            <button
              onClick={skipForward}
              className="p-4 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              title="10 Seconds Forward"
            >
              <RotateCw className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 pointer-events-auto flex flex-col gap-4"
          >
            {/* Progress Slider Bar */}
            <div className="flex items-center gap-4 w-full">
              <span className="text-gray-300 font-mono text-sm w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-netflix-red focus:outline-none hover:h-2 transition-all duration-100"
                style={{
                  background: `linear-gradient(to right, #E50914 0%, #E50914 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                }}
              />
              <span className="text-gray-300 font-mono text-sm w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Icons Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-netflix-red transition-colors duration-150 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                </button>

                {/* Volume slider container */}
                <div className="flex items-center gap-3 group">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-netflix-red transition-colors duration-150 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover:w-20 transition-all duration-300 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-netflix-red hover:accent-white focus:outline-none"
                    style={{
                      background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                    }}
                  />
                </div>

                <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
                  <span>Match:</span>
                  <span className="text-emerald-400 font-bold">{movie.matchPercentage}% Match</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Speed indicator button */}
                <button
                  onClick={changeSpeed}
                  className="text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition-colors duration-150 cursor-pointer"
                  title="Playback Speed"
                >
                  {playbackRate === 1 ? "1.0x" : `${playbackRate}x`}
                </button>

                {/* Subtitles toggle */}
                <button
                  onClick={() => setIsSubtitlesActive(!isSubtitlesActive)}
                  className={`transition-colors duration-150 cursor-pointer ${isSubtitlesActive ? "text-netflix-red" : "text-white hover:text-gray-300"}`}
                  title="Toggle Captions"
                >
                  <Subtitles className="w-6 h-6" />
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-netflix-red transition-colors duration-150 cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mock Subtitles Overlay */}
      {isSubtitlesActive && isPlaying && (
        <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none px-4 max-w-2xl">
          <p className="bg-black/75 text-white px-4 py-2 rounded text-base md:text-xl font-medium tracking-wide shadow-lg border border-white/5">
            {currentTime < 10 ? "[Eerie synthesized orchestra music rises]" : 
             currentTime < 20 ? `"${movie.title}: This continent represents the gateway to absolute spatial memory."` :
             currentTime < 35 ? "[Ambient waves of sound echoing from deep within the core]" :
             `"Once we trigger the generator, there is no turning back."`}
          </p>
        </div>
      )}
    </div>
  );
}
