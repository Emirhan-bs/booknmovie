const BASE_URL = import.meta.env.DEV
  ? "https://api.themoviedb.org/3"
  : "/api/tmdb";
const BEARER = import.meta.env.VITE_TMDB_BEARER;

const get = async (path, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}${query ? "?" + query : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB ${res.status}: ${text}`);
  }

  return res.json();
};

export const getPosterUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const searchMovies = (query, page = 1) =>
  get("/search/movie", { query, page, include_adult: false });

export const getMovieDetails = (id) =>
  get(`/movie/${id}`, { append_to_response: "credits,videos,similar" });

export const getTrending = (timeWindow = "week") =>
  get(`/trending/movie/${timeWindow}`);

export const getTopRated = (page = 1) => get("/movie/top_rated", { page });

export const getNowPlaying = (page = 1) => get("/movie/now_playing", { page });

export const getUpcoming = (page = 1) => get("/movie/upcoming", { page });

export const discoverMovies = (params = {}) =>
  get("/discover/movie", {
    sort_by: "popularity.desc",
    include_adult: false,
    ...params,
  });

export const getGenres = () => get("/genre/movie/list");

export const getMoviesByGenre = (genreId, page = 1) =>
  get("/discover/movie", { with_genres: genreId, page });

// Map TMDB genre names to IDs (common ones)
export const GENRE_IDS = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  Animation: 16,
};
