import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Plus, Check, Info, ChevronDown, ThumbsUp } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  key?: React.Key | any;
  movie: Movie;
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: string) => void;
}

export default function MovieCard({
  movie,
  onSelect,
  onPlay,
  isInWatchlist,
  onToggleWatchlist,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`card-${movie.id}`}
      className="relative flex-none w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] rounded-lg cursor-pointer transition-all duration-300 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(movie)}
    >
      {/* Standard Poster Card (Visible by default) */}
      <div className="w-full h-full rounded-lg overflow-hidden relative border border-white/5 bg-neutral-900 shadow-md">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Rank Badge (Optional) */}
        {movie.isTopTen && movie.topTenRank && (
          <div className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-full border border-amber-400 text-amber-400 font-bold font-mono text-xs shadow-lg">
            #{movie.topTenRank}
          </div>
        )}

        {/* Floating "New" pill */}
        {movie.isNew && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-netflix-red text-white text-[9px] font-extrabold rounded shadow uppercase tracking-wider">
            New
          </div>
        )}
      </div>

      {/* Floating Detailed Card on Hover (Elevated Card) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 0 }}
            animate={{ 
              scale: 1.15, 
              opacity: 1, 
              y: -40,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
            }}
            exit={{ scale: 0.9, opacity: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute inset-0 w-[200px] sm:w-[240px] md:w-[280px] h-fit bg-netflix-dark rounded-xl overflow-hidden z-40 border border-white/10 left-1/2 -translate-x-1/2 origin-bottom"
            onClick={(e) => {
              // Clicking anywhere on card opens details, unless action buttons clicked
              e.stopPropagation();
              onSelect(movie);
            }}
          >
            {/* Visual Header of Hover Card */}
            <div className="relative aspect-video w-full">
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark to-transparent" />
              
              {/* Quick Title overlay */}
              <h4 className="absolute bottom-2 left-3 text-white font-extrabold text-sm sm:text-base drop-shadow-md pr-4 truncate">
                {movie.title}
              </h4>
            </div>

            {/* Hover Card Content Detail */}
            <div className="p-4 space-y-3 bg-netflix-dark">
              {/* Interaction Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(movie);
                    }}
                    className="p-2 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                    title="Play trailer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(movie.id);
                    }}
                    className="p-2 bg-neutral-800 text-white border border-neutral-700 rounded-full hover:border-white transition cursor-pointer"
                    title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    {isInWatchlist ? (
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(movie);
                  }}
                  className="p-2 bg-neutral-800 text-white border border-neutral-700 rounded-full hover:border-white transition cursor-pointer"
                  title="More details"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Match Percentage & Core Metadata */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-emerald-400 font-bold">{movie.matchPercentage}% Match</span>
                  <span className="border border-white/35 px-1 py-[0.5px] rounded text-[10px] tracking-wide font-mono">
                    {movie.rating}
                  </span>
                  <span className="text-gray-400">{movie.duration}</span>
                </div>

                {/* Subtitle / Year */}
                <div className="text-[11px] text-gray-400 font-medium">
                  Released in {movie.releaseYear} • Audio: 5.1
                </div>
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-1.5 py-0.5 bg-neutral-800 text-gray-300 text-[10px] rounded"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
