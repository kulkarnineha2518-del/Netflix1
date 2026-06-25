import React, { useState } from "react";
import { Play, Info, Award, Volume2, VolumeX, Sparkles } from "lucide-react";
import { Movie } from "../types";

interface HeroProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onSelect: (movie: Movie) => void;
  onToggleWatchlist: (movieId: string) => void;
  isInWatchlist: boolean;
}

export default function Hero({
  movie,
  onPlay,
  onSelect,
  onToggleWatchlist,
  isInWatchlist,
}: HeroProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div
      id="hero-banner"
      className="relative w-full h-[55vh] sm:h-[70vh] md:h-[90vh] bg-black flex items-center overflow-hidden select-none"
    >
      {/* Background Image / Poster */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover brightness-[0.70] scale-105 animate-[zoom_60s_infinite_alternate]"
          loading="eager"
          referrerPolicy="no-referrer"
        />

        {/* Multi-directional Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/80 via-netflix-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-black/30 via-transparent to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 mt-16 md:mt-24">
        <div className="max-w-xl md:max-w-2xl space-y-4 md:space-y-6">
          {/* Tagline Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] md:text-xs font-extrabold text-black bg-amber-400 rounded-full uppercase tracking-wider shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Blockbuster Feature
            </span>
            <span className="px-2.5 py-0.5 text-[10px] md:text-xs font-extrabold text-white bg-netflix-red rounded uppercase tracking-widest shadow-md">
              New Series
            </span>
            <span className="text-gray-300 text-xs md:text-sm font-semibold tracking-wide flex items-center gap-1">
              • {movie.releaseYear} • {movie.duration} • {movie.rating}
            </span>
          </div>

          {/* Epic Movie Title */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl leading-none">
            {movie.title}
          </h1>

          {/* Top 10 Rating badge */}
          {movie.isTopTen && (
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 md:w-9 md:h-9 bg-netflix-red rounded-lg flex flex-col items-center justify-center text-white font-extrabold font-sans text-xs md:text-sm shadow-md">
                TOP
                <span className="text-[10px] leading-none mt-[-2px]">10</span>
              </div>
              <span className="text-white font-bold text-sm md:text-base tracking-wide drop-shadow-md">
                #1 in Movies Today
              </span>
            </div>
          )}

          {/* Subtitle / Description */}
          <p className="text-gray-200 text-sm md:text-lg font-light leading-relaxed drop-shadow-md max-w-lg md:max-w-xl line-clamp-3">
            {movie.description}
          </p>

          {/* Interaction Toolbar */}
          <div className="flex items-center gap-3 md:gap-4 pt-2">
            {/* Play Button */}
            <button
              id="hero-play-button"
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 active:scale-95 transition-all duration-200 shadow-xl cursor-pointer text-sm sm:text-base"
              title="Play Trailer Now"
            >
              <Play className="w-5 h-5 fill-black" /> Play
            </button>

            {/* More Info Button */}
            <button
              id="hero-info-button"
              onClick={() => onSelect(movie)}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-white/15 text-white border border-white/20 font-bold rounded-lg hover:bg-white/30 hover:border-white active:scale-95 transition-all duration-200 shadow-xl cursor-pointer text-sm sm:text-base backdrop-blur-md"
              title="Learn More Information"
            >
              <Info className="w-5 h-5" /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Floating Right Side Controls (Mute & Age Rating) */}
      <div className="absolute bottom-16 sm:bottom-24 right-0 z-10 flex items-center gap-3 md:gap-4 select-none">
        {/* Mock Audio Track Volume button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 sm:p-3 bg-black/40 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all duration-150 cursor-pointer hidden md:block"
          title={isMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-gray-300" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>

        {/* Standard maturity rating block */}
        <div className="bg-neutral-800/80 backdrop-blur-md border-l-4 border-netflix-red text-white py-1.5 md:py-2 pl-4 pr-10 rounded-l text-xs md:text-sm font-bold font-mono tracking-wider shadow-md">
          {movie.rating}
        </div>
      </div>
    </div>
  );
}
