export interface Movie {
  id: string;
  title: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  rating: string;
  releaseYear: number;
  duration: string;
  matchPercentage: number;
  genres: string[];
  categories: string[];
  videoUrl?: string;
  isNew?: boolean;
  isTopTen?: boolean;
  topTenRank?: number;
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
}
