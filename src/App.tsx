import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Search, Film, Star, AlertCircle, Compass, ListPlus, Play, Info } from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieRow from "./components/MovieRow";
import SkeletonRow from "./components/SkeletonRow";
import MovieDetailModal from "./components/MovieDetailModal";
import VideoPlayerModal from "./components/VideoPlayerModal";

import { MOVIES, CATEGORIES_CONFIG } from "./data/movies";
import { Movie } from "./types";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activePlayingMovie, setActivePlayingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");

  // 1. Simulate data loading with Skeleton Shimmers
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // 2. Load Watchlist from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cinestream-watchlist");
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading watchlist from localStorage:", e);
    }
  }, []);

  // 3. Watchlist Toggle Handler (Persisted to LocalStorage)
  const handleToggleWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const updated = prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId];
      try {
        localStorage.setItem("cinestream-watchlist", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving watchlist to localStorage:", e);
      }
      return updated;
    });
  };

  // Find the primary featured hero movie
  const heroMovie = MOVIES.find((m) => m.id === "hero-aetheria") || MOVIES[0];

  // Get watchlist movies
  const watchlistMovies = MOVIES.filter((m) => watchlist.includes(m.id));

  // Handle Search Filtering
  const filteredMovies = searchQuery
    ? MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : MOVIES;

  // Simple scroll utility
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white relative flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Header Navigation */}
      <Navbar
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        watchlistCount={watchlist.length}
        activeCategoryFilter={activeCategoryFilter}
        setActiveCategoryFilter={setActiveCategoryFilter}
        scrollToSection={scrollToSection}
      />

      {/* 2. Main content area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {isLoading ? (
            /* Shimmer Skeleton Load State */
            <motion.div
              key="loader-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-24 pb-12 space-y-4"
            >
              {/* Hero Banner Shimmer Placeholder */}
              <div className="px-4 md:px-12 mb-8">
                <div className="w-full h-[40vh] md:h-[65vh] bg-neutral-900 rounded-2xl relative overflow-hidden flex flex-col justify-end p-6 md:p-12 space-y-4 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  <div className="h-4 w-32 bg-neutral-800 rounded" />
                  <div className="h-8 md:h-12 w-2/3 bg-neutral-800 rounded" />
                  <div className="h-4 w-1/2 bg-neutral-800 rounded" />
                  <div className="flex gap-4 pt-2">
                    <div className="h-10 w-28 bg-neutral-800 rounded-lg" />
                    <div className="h-10 w-28 bg-neutral-800 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Multiple row shimmers */}
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </motion.div>
          ) : searchQuery ? (
            /* Search Results Overlay Screen */
            <motion.div
              key="search-results-pane"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="pt-24 px-4 md:px-12 pb-16 space-y-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-gray-400 text-sm tracking-wider uppercase font-semibold">Search Results for</span>
                  <h2 className="text-white text-xl md:text-3xl font-extrabold mt-0.5">"{searchQuery}"</h2>
                </div>
                <span className="text-sm text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  {filteredMovies.length} matches found
                </span>
              </div>

              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                  {filteredMovies.map((movie) => {
                    const isInList = watchlist.includes(movie.id);
                    return (
                      <div
                        key={movie.id}
                        className="bg-neutral-900/60 rounded-lg overflow-hidden border border-white/5 flex flex-col h-full group/search-card relative hover:border-white/20 transition-all duration-300 shadow-lg"
                      >
                        {/* Vertical Poster area */}
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/search-card:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/search-card:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                            <button
                              onClick={() => setActivePlayingMovie(movie)}
                              className="p-3 bg-white text-black hover:bg-neutral-200 rounded-full transition cursor-pointer shadow-lg"
                              title="Play"
                            >
                              <Play className="w-4 h-4 fill-black" />
                            </button>
                            <button
                              onClick={() => setSelectedMovie(movie)}
                              className="p-3 bg-neutral-800 text-white hover:bg-neutral-700 rounded-full transition cursor-pointer shadow-lg border border-white/10"
                              title="More info"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title details block */}
                        <div className="p-3 flex flex-col justify-between grow space-y-2">
                          <div>
                            <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-1 group-hover/search-card:text-netflix-red transition-colors">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 mt-1 font-medium">
                              <span className="text-emerald-400 font-bold">{movie.matchPercentage}% Match</span>
                              <span>•</span>
                              <span>{movie.releaseYear}</span>
                              <span>•</span>
                              <span className="border border-white/20 px-1 py-0.5 rounded-[3px] text-[8px] font-mono leading-none">
                                {movie.rating}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleWatchlist(movie.id)}
                            className={`w-full py-1.5 px-2 rounded text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-150 border cursor-pointer ${
                              isInList
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            }`}
                          >
                            {isInList ? (
                              <>
                                <Heart className="w-3 h-3 fill-current" /> Added
                              </>
                            ) : (
                              <>
                                <ListPlus className="w-3.5 h-3.5" /> Add to List
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* No Search Results State */
                <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto space-y-4">
                  <div className="p-4 bg-white/5 rounded-full border border-white/10">
                    <AlertCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-white text-lg font-bold">No streaming titles match your search</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Try checking your spelling, looking up general genre terms (like "Sci-Fi", "Comedy", "Action"), or selecting titles directly from our menu.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-5 py-2 bg-netflix-red text-white text-xs font-bold tracking-widest uppercase rounded hover:bg-red-700 transition cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Traditional Home Browsing layout */
            <motion.div
              key="main-rows-pane"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pb-16"
            >
              {/* Massive Cinematic Hero banner */}
              <Hero
                movie={heroMovie}
                onPlay={setActivePlayingMovie}
                onSelect={setSelectedMovie}
                onToggleWatchlist={handleToggleWatchlist}
                isInWatchlist={watchlist.includes(heroMovie.id)}
              />

              {/* Dynamic Watchlist Row (Shown only if user added any items) */}
              <div id="watchlist-row-section">
                <AnimatePresence>
                  {watchlistMovies.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-white/5 pb-2"
                    >
                      <MovieRow
                        title="My Personal Watchlist"
                        movies={watchlistMovies}
                        onSelect={(m) => setSelectedMovie(m)}
                        onPlay={(m) => setActivePlayingMovie(m)}
                        watchlist={watchlist}
                        onToggleWatchlist={handleToggleWatchlist}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* General Category Rows */}
              {CATEGORIES_CONFIG.map((category) => {
                const categoryMovies = MOVIES.filter((m) =>
                  m.categories.includes(category.id)
                );
                return (
                  <MovieRow
                    key={category.id}
                    title={category.title}
                    movies={categoryMovies}
                    onSelect={(m) => setSelectedMovie(m)}
                    onPlay={(m) => setActivePlayingMovie(m)}
                    watchlist={watchlist}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Immersive Overlay modals */}
      <AnimatePresence>
        {/* Movie Detailed Drawer Modal */}
        {selectedMovie && (
          <MovieDetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onPlay={(m) => setActivePlayingMovie(m)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {/* Cinematic Mock Video Player Modal */}
        {activePlayingMovie && (
          <VideoPlayerModal
            movie={activePlayingMovie}
            onClose={() => setActivePlayingMovie(null)}
          />
        )}
      </AnimatePresence>

      {/* 4. Elegant Footer */}
      <footer className="bg-netflix-black border-t border-white/5 py-8 md:py-12 text-center text-xs text-gray-500 font-light select-none space-y-3 px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 font-medium mb-3">
          <span className="hover:text-white cursor-pointer transition">Audio Description</span>
          <span className="hover:text-white cursor-pointer transition">Help Center</span>
          <span className="hover:text-white cursor-pointer transition">Gift Cards</span>
          <span className="hover:text-white cursor-pointer transition">Media Center</span>
          <span className="hover:text-white cursor-pointer transition">Privacy & Terms</span>
        </div>
        <p>© 2026 CineStream Streaming Inc. All rights reserved. Built with React, Tailwind CSS, & Framer Motion.</p>
        <p className="font-mono text-[10px] text-gray-600">
          Development Server: Port 3000 | Production build verified
        </p>
      </footer>
    </div>
  );
}
