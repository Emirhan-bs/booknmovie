const BEARER = import.meta.env.VITE_TMDB_BEARER;
const IS_DEV = import.meta.env.DEV;

const get = async (path, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const qs = query ? "?" + query : "";

  // Dev: direct (needs VPN), Prod (Vercel): use proxy
  const url = IS_DEV
    ? `https://api.themoviedb.org/3${path}${qs}`
    : `/api/tmdb${path}${qs}`;

  const options = IS_DEV
    ? {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${BEARER}`,
        },
      }
    : {};

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB ${res.status}: ${text}`);
  }
  return res.json();
};

export const getPosterUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const searchMovies = (query, page = 1) =>
  get("/search/movie", {
    query,
    page,
    include_adult: false,
    language: "tr-TR",
  });

export const getMovieDetails = (id) =>
  get(`/movie/${id}`, {
    append_to_response: "credits,videos,similar",
    language: "tr-TR",
  });

export const getTrending = (timeWindow = "week") =>
  get(`/trending/movie/${timeWindow}`, { language: "tr-TR" });

export const getTopRated = (page = 1) =>
  get("/movie/top_rated", { page, language: "tr-TR" });

export const getNowPlaying = (page = 1) =>
  get("/movie/now_playing", { page, language: "tr-TR" });

export const getUpcoming = (page = 1) =>
  get("/movie/upcoming", { page, language: "tr-TR" });

export const discoverMovies = (params = {}) =>
  get("/discover/movie", {
    sort_by: "popularity.desc",
    include_adult: false,
    language: "tr-TR",
    ...params,
  });

export const getGenres = () => get("/genre/movie/list", { language: "tr-TR" });

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
