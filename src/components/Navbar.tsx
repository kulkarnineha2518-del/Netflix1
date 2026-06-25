import React, { useState, useEffect } from "react";
import { Search, Bell, Film, Heart, Compass, Menu, X } from "lucide-react";

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  watchlistCount: number;
  activeCategoryFilter: string;
  setActiveCategoryFilter: (category: string) => void;
  scrollToSection: (sectionId: string) => void;
}

export default function Navbar({
  onSearch,
  searchQuery,
  watchlistCount,
  activeCategoryFilter,
  setActiveCategoryFilter,
  scrollToSection,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor document scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", filterId: "all", sectionId: "hero-banner" },
    { label: "Trending", filterId: "trending", sectionId: "row-section-trending-now" },
    { label: "Sci-Fi & Fantasy", filterId: "scifi", sectionId: "row-section-sci-fi-&-fantasy-blockbusters" },
    { label: "Action & Thrillers", filterId: "action", sectionId: "row-section-action-&-high-octane-thrillers" },
    { label: "Comedies", filterId: "comedies", sectionId: "row-section-award-winning-comedies" },
    { label: "My List", filterId: "mylist", sectionId: "watchlist-row-section" },
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    setActiveCategoryFilter(link.filterId);
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to the corresponding row/section
    setTimeout(() => {
      const el = document.getElementById(link.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center justify-between px-4 md:px-12 transition-all duration-500 select-none ${
        isScrolled || isMobileMenuOpen
          ? "bg-netflix-black shadow-lg border-b border-white/5"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      {/* Left side: Logo & Navigation Links */}
      <div className="flex items-center gap-4 lg:gap-10">
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick(navLinks[0])}
          className="flex items-center gap-1.5 cursor-pointer group"
        >
          <Film className="w-6 h-6 text-netflix-red group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xl md:text-2xl font-black tracking-tighter text-netflix-red bg-clip-text">
            CINESTREAM
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                activeCategoryFilter === link.filterId
                  ? "text-white font-semibold scale-105"
                  : "text-gray-300 hover:text-gray-400 font-medium"
              }`}
            >
              <span className="relative py-1">
                {link.label}
                {link.label === "My List" && watchlistCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-netflix-red text-white text-[10px] font-extrabold font-mono rounded-full leading-none inline-block">
                    {watchlistCount}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Right side: Search, Watchlist Indicator, & Profile */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Animated Search Bar */}
        <div className="relative flex items-center h-9 bg-black/40 border border-white/10 rounded-full px-2.5 transition-all duration-300">
          <Search className="w-5 h-5 text-gray-300 cursor-pointer" onClick={() => setIsSearchExpanded(true)} />
          <input
            type="text"
            placeholder="Search titles, genres..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none ml-2 w-32 sm:w-48 md:w-56 transition-all duration-300"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearch("")} 
              className="text-gray-400 hover:text-white ml-1 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dynamic Watchlist heart shortcut */}
        <button
          onClick={() => handleNavClick(navLinks[5])}
          className="relative text-gray-300 hover:text-white transition-colors duration-150 p-1.5 rounded-full hover:bg-white/5 cursor-pointer hidden sm:block"
          title="My Watchlist"
        >
          <Heart className={`w-5 h-5 ${watchlistCount > 0 ? "fill-netflix-red text-netflix-red" : ""}`} />
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-netflix-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* User profile avatar thumbnail */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"
            alt="User profile"
            className="w-8 h-8 rounded border border-white/20 object-cover group-hover:border-netflix-red transition-all duration-150"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Mobile Navigation Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 text-gray-300 hover:text-white cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-netflix-black border-b border-white/10 z-40 p-6 flex flex-col gap-4 lg:hidden shadow-2xl">
          <div className="text-gray-500 uppercase tracking-widest text-[10px] font-bold border-b border-white/5 pb-2">
            Navigation Menu
          </div>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className={`flex items-center justify-between text-left py-2 font-medium tracking-wide transition-colors ${
                activeCategoryFilter === link.filterId ? "text-netflix-red" : "text-gray-300 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              {link.label === "My List" && watchlistCount > 0 && (
                <span className="px-2 py-0.5 bg-netflix-red text-white text-xs font-bold rounded-full">
                  {watchlistCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
