import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Play, Plus, Check, ThumbsUp, Calendar, Clock, Award, Star } from "lucide-react";
import { Movie } from "../types";
import { MOVIES } from "../data/movies";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export default function MovieDetailModal({
  movie,
  onClose,
  onPlay,
  watchlist,
  onToggleWatchlist,
}: MovieDetailModalProps) {
  const isInWatchlist = watchlist.includes(movie.id);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  // Filter similar movies based on category or genre
  useEffect(() => {
    const similar = MOVIES.filter(
      (m) =>
        m.id !== movie.id &&
        (m.genres.some((g) => movie.genres.includes(g)) ||
          m.categories.some((c) => movie.categories.includes(c)))
    ).slice(0, 4);
    setRecommendedMovies(similar);
  }, [movie]);

  // Lock scroll on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div 
      id={`detail-modal-${movie.id}`}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 backdrop-blur-md pt-10 pb-16 px-4"
      onClick={onClose}
    >
      {/* Modal Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 180 }}
        className="relative w-full max-w-4xl bg-netflix-dark rounded-xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full hover:bg-white/20 text-white transition-all duration-150 cursor-pointer"
          title="Close details"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hero Poster Header */}
        <div className="relative h-[250px] md:h-[420px] w-full">
          {/* Backdrop Image */}
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover brightness-75"
            referrerPolicy="no-referrer"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-dark/60 via-transparent to-transparent" />

          {/* Movie Metadata overlay */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 z-10">
            <div className="flex items-center gap-2 mb-2">
              {movie.isNew && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-netflix-red rounded uppercase tracking-wider">
                  New
                </span>
              )}
              {movie.isTopTen && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-black bg-amber-400 rounded uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3" /> Top 10
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-5xl font-black tracking-tight text-white mb-4 drop-shadow-lg">
              {movie.title}
            </h1>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center gap-2.5 px-6 py-2.5 bg-white text-black font-semibold rounded hover:bg-white/90 active:scale-95 transition-all duration-150 shadow-md cursor-pointer text-sm md:text-base"
              >
                <Play className="w-5 h-5 fill-black" /> Play Trailer
              </button>

              <button
                onClick={() => onToggleWatchlist(movie.id)}
                className="flex items-center justify-center p-2.5 bg-black/40 hover:bg-white/15 text-white border border-white/35 hover:border-white rounded-full transition-all duration-150 cursor-pointer"
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                {isInWatchlist ? (
                  <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center justify-center p-2.5 bg-black/40 hover:bg-white/15 border rounded-full transition-all duration-150 cursor-pointer ${
                  isLiked ? "text-red-500 border-red-500" : "text-white border-white/35 hover:border-white"
                }`}
                title="Like movie"
              >
                <ThumbsUp className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Cinematic Details Grid */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-300">
              <span className="text-emerald-400 font-bold">{movie.matchPercentage}% Match</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-4 h-4" /> {movie.releaseYear}
              </span>
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-xs text-white tracking-wide font-mono">
                {movie.rating}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" /> {movie.duration}
              </span>
            </div>

            <p className="text-gray-100 text-base md:text-lg leading-relaxed font-light">
              {movie.description}
            </p>

            {/* Special Highlight */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white text-sm font-semibold">Award-Winning Performance</h4>
                <p className="text-gray-400 text-xs mt-0.5">
                  Praised by critics worldwide for its exceptional production quality, atmospheric tension, and boundary-pushing audio mixing.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Specs Column */}
          <div className="space-y-4 text-sm bg-black/25 p-5 rounded-lg border border-white/5">
            <div>
              <span className="text-gray-500 font-medium block mb-1">Genres:</span>
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-0.5 bg-white/10 text-white rounded text-xs hover:bg-white/15 transition-colors"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-1">Audio formats:</span>
              <span className="text-gray-300 font-mono text-xs">Dolby Atmos, Spatial Stereo 5.1</span>
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-1">Maturity rating:</span>
              <span className="text-gray-300">
                Rated <strong className="text-white">{movie.rating}</strong> for mature themes, suggestive content, and intense action sequences. Recommended for ages 13+.
              </span>
            </div>
          </div>
        </div>

        {/* Similar Recommended Titles */}
        {recommendedMovies.length > 0 && (
          <div className="px-6 pb-10 md:px-10">
            <h3 className="text-white font-bold text-lg md:text-xl mb-6 flex items-center gap-2">
              <span>More Like This</span>
              <span className="h-px bg-white/10 grow" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedMovies.map((rec) => {
                const isRecInWatchlist = watchlist.includes(rec.id);
                return (
                  <div
                    key={rec.id}
                    className="bg-black/40 rounded-lg overflow-hidden border border-white/10 flex flex-col h-full group"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={rec.backdropUrl}
                        alt={rec.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/60 rounded text-white">
                        {rec.rating}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col justify-between grow space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="text-white font-bold text-sm truncate">{rec.title}</h4>
                        </div>
                        <span className="text-emerald-400 font-bold text-xs">{rec.matchPercentage}% Match</span>
                        <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 font-light">
                          {rec.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-gray-400 text-xs">{rec.duration}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onPlay(rec)}
                            className="p-1.5 bg-white text-black hover:bg-white/85 rounded-full transition cursor-pointer"
                            title="Play similar title"
                          >
                            <Play className="w-3.5 h-3.5 fill-black" />
                          </button>
                          <button
                            onClick={() => onToggleWatchlist(rec.id)}
                            className="p-1.5 bg-black/40 border border-white/30 text-white hover:border-white rounded-full transition cursor-pointer"
                            title="Add/remove list"
                          >
                            {isRecInWatchlist ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
