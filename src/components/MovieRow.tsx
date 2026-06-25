import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "../types";
import MovieCard from "./MovieCard";

interface MovieRowProps {
  key?: React.Key | any;
  title: string;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  watchlist: string[];
  onToggleWatchlist: (movieId: string) => void;
}

export default function MovieRow({
  title,
  movies,
  onSelect,
  onPlay,
  watchlist,
  onToggleWatchlist,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check scroll position to toggle arrows
  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const row = rowRef.current;
    if (row) {
      row.addEventListener("scroll", checkScroll);
      // Run once on load to verify arrow states
      checkScroll();
      
      // Also add a resize listener
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (row) {
        row.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [movies]);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      // Scroll by 80% of current row width for pleasant spacing
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div id={`row-section-${title.replace(/\s+/g, '-').toLowerCase()}`} className="relative py-4 md:py-6 group/row">
      {/* Category Heading */}
      <h2 className="text-white text-md sm:text-lg md:text-xl font-bold tracking-tight px-4 md:px-12 mb-3 md:mb-4 hover:text-neutral-300 transition-colors duration-150 inline-block cursor-pointer">
        {title}
      </h2>

      {/* Slider Container Wrapper */}
      <div className="relative overflow-visible px-4 md:px-12">
        {/* Left Scroll Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center z-30 rounded-r opacity-0 group-hover/row:opacity-100 transition-all duration-200 shadow-xl border-r border-white/5 cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-8 h-8 hover:scale-125 transition-transform" />
          </button>
        )}

        {/* Scrollable Row Rail */}
        <div
          ref={rowRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3 overflow-y-visible"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onSelect}
              onPlay={onPlay}
              isInWatchlist={watchlist.includes(movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>

        {/* Right Scroll Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-0 bottom-0 w-10 md:w-12 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center z-30 rounded-l opacity-0 group-hover/row:opacity-100 transition-all duration-200 shadow-xl border-l border-white/5 cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-8 h-8 hover:scale-125 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
