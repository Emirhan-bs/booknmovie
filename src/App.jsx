import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Card from "./components/Card";
import Modal from "./components/Modal";
import AuthModal from "./components/AuthModal";
import Toast from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";
import {
  searchMovies,
  getTrending,
  getTopRated,
  discoverMovies,
  GENRE_IDS,
  getPosterUrl,
} from "./services/tmdb";
import {
  searchBooks,
  getBooksByGenre,
  normalizeBook,
  normalizeWork,
  getTrendingBooks,
  searchTurkishBooks,
} from "./services/openLibrary";

// ── Translations ─────────────────────────────────────────────────────────────
const STRINGS = {
  tr: {
    hero1: "Bir Sonraki Favori",
    hero2: "Hikayeni Keşfet",
    heroSub: "TMDB ve Open Library destekli — film ve kitap keşfet",
    discover: "Keşfet",
    trending: "🔥 Trend",
    favorites: "♥ Favoriler",
    myList: "☰ Listem",
    signIn: "Giriş Yap",
    signOut: "Çıkış",
    trendingTitle: "Şu An Trend",
    trendingSub: "Bu haftanın en popüler filmleri",
    noFavorites: "Henüz favori yok",
    noList: "Listeniz boş",
    nothingFound: "Sonuç bulunamadı",
    browseAndSave: "Beğendiğinizi keşfedin ve kaydedin.",
    tryDifferent: "Farklı bir arama veya tür deneyin.",
    exploreNow: "Keşfet",
    searchResults: "Arama Sonuçları",
    discoverSub: "Bu haftanın trend film ve kitapları",
    poweredBy: "ile desteklenmektedir",
    langToggle: "EN",
  },
  en: {
    hero1: "Your Next Favorite",
    hero2: "Story Awaits",
    heroSub: "Discover movies & books powered by TMDB and Open Library",
    discover: "Discover",
    trending: "🔥 Trending",
    favorites: "♥ Favorites",
    myList: "☰ My List",
    signIn: "Sign In",
    signOut: "Sign out",
    trendingTitle: "Trending Now",
    trendingSub: "Top-rated & most popular this week",
    noFavorites: "No favorites saved yet",
    noList: "Your list is empty",
    nothingFound: "Nothing found",
    browseAndSave: "Browse and save titles you love.",
    tryDifferent: "Try a different search or genre.",
    exploreNow: "Explore Now",
    searchResults: "Search Results",
    discoverSub: "Trending movies & books this week",
    poweredBy: "Powered by",
    langToggle: "TR",
  },
};

// ── Normalize movie ───────────────────────────────────────────────────────────
const normalizeMovie = (movie) => ({
  id: `movie_${movie.id}`,
  tmdbId: movie.id,
  type: "movie",
  title: movie.title || movie.original_title || "Unknown",
  director: null,
  cast: [],
  year: movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : null,
  genre: movie.genre_ids?.[0]
    ? Object.entries(GENRE_IDS).find(
        ([, id]) => id === movie.genre_ids[0],
      )?.[0] || "Drama"
    : movie.genres?.[0]?.name || "Drama",
  rating: movie.vote_average || null,
  language:
    movie.original_language === "en"
      ? "English"
      : movie.original_language === "tr"
        ? "Türkçe"
        : movie.original_language === "es"
          ? "Spanish"
          : movie.original_language === "fr"
            ? "French"
            : movie.original_language === "ja"
              ? "Japanese"
              : movie.original_language === "ko"
                ? "Korean"
                : movie.original_language === "de"
                  ? "German"
                  : movie.original_language?.toUpperCase() || "Unknown",
  posterPath: movie.poster_path || null,
  coverUrl: movie.poster_path ? getPosterUrl(movie.poster_path) : null,
  summary: movie.overview || "",
  tags: [],
  popularity: movie.popularity || 0,
});

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    style={{
      background: "#12121f",
      border: "1px solid #1e1e32",
      borderRadius: "16px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "240px",
        background: "#1a1a2e",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div
      style={{
        padding: "14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          height: "14px",
          background: "#1a1a2e",
          borderRadius: "4px",
          width: "80%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div
        style={{
          height: "11px",
          background: "#1a1a2e",
          borderRadius: "4px",
          width: "60%",
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, count }) => (
  <div style={{ marginBottom: "20px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#f0f0ff",
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
        }}
      >
        {title}
      </h2>
      {count > 0 && (
        <span
          style={{
            color: "#5050a0",
            fontFamily: "'DM Mono', monospace",
            fontSize: "12px",
          }}
        >
          {count} {count === 1 ? "result" : "results"}
        </span>
      )}
    </div>
    {subtitle && (
      <p
        style={{
          margin: "4px 0 0",
          color: "#5050a0",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
function AppInner() {
  const { favorites, myList } = useFavorites();
  const [lang, setLang] = useState("tr"); // default Turkish
  const t = STRINGS[lang];
  const [activeTab, setActiveTab] = useState("discover");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === "discover" && !hasSearched) loadDefault();
    if (activeTab === "trending") loadTrending();
  }, [activeTab]);

  const loadDefault = async () => {
    setLoading(true);
    try {
      const [moviesRes, booksRes, turkishRes] = await Promise.all([
        getTrending("week"),
        getTrendingBooks(10),
        searchTurkishBooks("roman", 8),
      ]);
      const movies = (moviesRes.results || []).slice(0, 12).map(normalizeMovie);
      const books = (booksRes.works || booksRes.docs || [])
        .slice(0, 10)
        .map((b) =>
          b.cover_id !== undefined ? normalizeWork(b) : normalizeBook(b),
        );
      const turkishBooks = (turkishRes.docs || [])
        .slice(0, 8)
        .map(normalizeBook);
      const mixed = [];
      const max = Math.max(movies.length, books.length + turkishBooks.length);
      const allBooks = [...books, ...turkishBooks];
      for (let i = 0; i < max; i++) {
        if (movies[i]) mixed.push(movies[i]);
        if (allBooks[i]) mixed.push(allBooks[i]);
      }
      setItems(mixed);
    } catch (e) {
      console.error("loadDefault error:", e);
      showToast("İçerik yüklenemedi. VPN açık olduğundan emin olun.");
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    setLoading(true);
    try {
      const [moviesRes, topRatedRes] = await Promise.all([
        getTrending("week"),
        getTopRated(1),
      ]);
      const trending = (moviesRes.results || []).map(normalizeMovie);
      const topRated = (topRatedRes.results || [])
        .slice(0, 8)
        .map(normalizeMovie);
      const all = [...trending, ...topRated].filter(
        (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i,
      );
      setItems(all);
    } catch (e) {
      console.error(e);
      showToast("Trend içerik yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({
    query,
    genre,
    format,
    language,
    yearRange,
  }) => {
    setLoading(true);
    setHasSearched(true);
    setActiveTab("discover");
    try {
      const promises = [];
      const isTurkish = language === "Türkçe";

      // Movies
      if (format === "All" || format === "Movie" || format === "Film") {
        if (query) {
          promises.push(
            searchMovies(query).then((r) =>
              (r.results || []).map(normalizeMovie),
            ),
          );
        } else if (genre && genre !== "All" && genre !== "Tümü") {
          const genreId = GENRE_IDS[genre];
          const yearParams =
            yearRange !== "All" && yearRange !== "Tümü"
              ? {
                  "primary_release_date.gte": `${yearRange.split("-")[0]}-01-01`,
                  "primary_release_date.lte": `${yearRange.split("-")[1] || "2026"}-12-31`,
                }
              : {};
          promises.push(
            discoverMovies({ with_genres: genreId, ...yearParams }).then((r) =>
              (r.results || []).map(normalizeMovie),
            ),
          );
        } else {
          promises.push(
            getTrending("week").then((r) =>
              (r.results || []).slice(0, 20).map(normalizeMovie),
            ),
          );
        }
      }

      // Books
      if (format === "All" || format === "Book" || format === "Kitap") {
        if (isTurkish) {
          promises.push(
            searchTurkishBooks(query || "roman", 20).then((r) =>
              (r.docs || []).map(normalizeBook),
            ),
          );
        } else if (query) {
          promises.push(
            searchBooks(query, 1, 20).then((r) =>
              (r.docs || []).map(normalizeBook),
            ),
          );
        } else if (genre && genre !== "All" && genre !== "Tümü") {
          promises.push(
            getBooksByGenre(genre, 20).then((r) => {
              const list = r.works || r.docs || [];
              return list.map((b) =>
                b.cover_id !== undefined ? normalizeWork(b) : normalizeBook(b),
              );
            }),
          );
        } else {
          promises.push(
            getTrendingBooks(20).then((r) => {
              const list = r.works || r.docs || [];
              return list.map((b) =>
                b.cover_id !== undefined ? normalizeWork(b) : normalizeBook(b),
              );
            }),
          );
        }
      }

      const results = await Promise.all(promises);
      let combined = results.flat();

      if (language !== "All" && language !== "Tümü" && language !== "") {
        combined = combined.filter((i) => i.language === language);
      }
      if (yearRange !== "All" && yearRange !== "Tümü") {
        const [from, to] = yearRange.split("-").map(Number);
        combined = combined.filter(
          (i) => i.year && i.year >= from && i.year <= (to || 2030),
        );
      }

      if (format === "All") {
        const movies = combined.filter((i) => i.type === "movie");
        const books = combined.filter((i) => i.type === "book");
        const mixed = [];
        const max = Math.max(movies.length, books.length);
        for (let i = 0; i < max; i++) {
          if (movies[i]) mixed.push(movies[i]);
          if (books[i]) mixed.push(books[i]);
        }
        setItems(mixed);
      } else {
        setItems(combined);
      }

      if (combined.length === 0)
        showToast(lang === "tr" ? "Sonuç bulunamadı." : "No results found.");
    } catch (e) {
      console.error("Search error:", e);
      showToast(
        lang === "tr"
          ? "Arama başarısız. Tekrar deneyin."
          : "Search failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const displayItems =
    activeTab === "favorites"
      ? favorites
      : activeTab === "mylist"
        ? myList
        : items;

  const skeletons = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080813",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f0f0ff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a15; }
        ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 3px; }
        input, textarea { color-scheme: dark; }
        input:focus, textarea:focus { outline: none !important; border-color: #FF6B35 !important; box-shadow: 0 0 0 2px #FF6B3520 !important; }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
        @keyframes pulse { 0%,100% { opacity:0.3 } 50% { opacity:0.7 } }
        @keyframes spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @keyframes shimmer { 0% { opacity:0.4 } 50% { opacity:0.8 } 100% { opacity:0.4 } }
        @keyframes cardIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:20px; }
        @media (max-width:640px) { .card-grid { grid-template-columns:repeat(2,1fr); gap:12px; } }
        @media (max-width:380px) { .card-grid { grid-template-columns:1fr; } }
      `}</style>

      {/* Ambient BG */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #FF6B3510 0%, transparent 70%)",
            top: "-300px",
            left: "-200px",
            animation: "pulse 7s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #4040aa0a 0%, transparent 70%)",
            bottom: "0",
            right: "-100px",
            animation: "pulse 9s ease-in-out infinite 3s",
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAuthClick={() => setShowAuth(true)}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <main style={{ paddingTop: "64px", position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <section
          style={{
            padding: "56px 24px 40px",
            textAlign: "center",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#F7C59F" />
                </linearGradient>
              </defs>
              <rect
                x="8"
                y="20"
                width="40"
                height="55"
                rx="4"
                fill="url(#hg)"
              />
              <rect
                x="12"
                y="24"
                width="32"
                height="47"
                rx="2"
                fill="#FFF5ED"
                fillOpacity="0.9"
              />
              <rect x="8" y="20" width="6" height="55" rx="2" fill="#E55A2B" />
              <line
                x1="18"
                y1="34"
                x2="40"
                y2="34"
                stroke="#FF6B35"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="18"
                y1="41"
                x2="40"
                y2="41"
                stroke="#FF6B35"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="68"
                cy="42"
                r="24"
                fill="#1A1A2E"
                stroke="#FF6B35"
                strokeWidth="2"
              />
              <circle cx="68" cy="42" r="3" fill="#FF6B35" />
              {[0, 60, 120, 180, 240, 300].map((d, i) => (
                <circle
                  key={i}
                  cx={68 + 16 * Math.cos((d * Math.PI) / 180)}
                  cy={42 + 16 * Math.sin((d * Math.PI) / 180)}
                  r="3"
                  fill="#FF6B35"
                  fillOpacity="0.6"
                />
              ))}
              <polygon points="62,36 62,48 74,42" fill="#FF6B35" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 6vw, 68px)",
              fontWeight: "900",
              lineHeight: "1.1",
              marginBottom: "10px",
              background: "linear-gradient(135deg, #f0f0ff 30%, #FF6B35 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t.hero1}
            <br />
            <em>{t.hero2}</em>
          </h1>
          <p
            style={{
              color: "#6060a0",
              fontSize: "15px",
              fontFamily: "'DM Mono', monospace",
              maxWidth: "480px",
              margin: "0 auto 36px",
              lineHeight: "1.6",
            }}
          >
            {t.heroSub}
          </p>

          <SearchBar
            onSearch={handleSearch}
            loading={loading}
            lang={lang}
            t={t}
          />
        </section>

        {/* Content */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px 80px",
          }}
        >
          {activeTab === "discover" && (
            <SectionHeader
              title={hasSearched ? t.searchResults : t.discover}
              subtitle={hasSearched ? null : t.discoverSub}
              count={loading ? 0 : displayItems.length}
            />
          )}
          {activeTab === "trending" && (
            <div
              style={{
                background: "#FF6B3510",
                border: "1px solid #FF6B3530",
                borderRadius: "16px",
                padding: "16px 20px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{ fontSize: "24px", animation: "pulse 2s infinite" }}
              >
                🔥
              </span>
              <div>
                <h3
                  style={{
                    color: "#f0f0ff",
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "18px",
                    marginBottom: "2px",
                  }}
                >
                  {t.trendingTitle}
                </h3>
                <p
                  style={{
                    color: "#6060a0",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                  }}
                >
                  {t.trendingSub}
                </p>
              </div>
            </div>
          )}
          {activeTab === "favorites" && (
            <SectionHeader
              title={t.favorites}
              subtitle={`${favorites.length} ${lang === "tr" ? "kayıtlı" : "saved"}`}
              count={0}
            />
          )}
          {activeTab === "mylist" && (
            <SectionHeader
              title={t.myList}
              subtitle={`${myList.length} ${lang === "tr" ? "öğe" : "items"}`}
              count={0}
            />
          )}

          {loading ? (
            <div className="card-grid">
              {skeletons.map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : displayItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div
                style={{ fontSize: "60px", marginBottom: "16px", opacity: 0.3 }}
              >
                ◎
              </div>
              <h3
                style={{
                  color: "#4040a0",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "8px",
                  fontSize: "20px",
                }}
              >
                {activeTab === "favorites"
                  ? t.noFavorites
                  : activeTab === "mylist"
                    ? t.noList
                    : t.nothingFound}
              </h3>
              <p
                style={{
                  color: "#3a3a6a",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "13px",
                  marginBottom: "20px",
                }}
              >
                {activeTab === "favorites" || activeTab === "mylist"
                  ? t.browseAndSave
                  : t.tryDifferent}
              </p>
              {(activeTab === "favorites" || activeTab === "mylist") && (
                <button
                  onClick={() => setActiveTab("discover")}
                  style={{
                    background: "#FF6B35",
                    border: "none",
                    color: "#fff",
                    padding: "10px 24px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "13px",
                  }}
                >
                  {t.exploreNow}
                </button>
              )}
            </div>
          ) : (
            <div className="card-grid">
              {displayItems.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    animation: `cardIn 0.4s ease ${Math.min(i * 0.04, 0.5)}s both`,
                  }}
                >
                  <Card item={item} onClick={setSelected} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid #1e1e32",
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#2a2a4a",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
            }}
          >
            {t.poweredBy}{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FF6B3560", textDecoration: "none" }}
            >
              TMDB
            </a>{" "}
            &amp;{" "}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#FF6B3560", textDecoration: "none" }}
            >
              Open Library
            </a>{" "}
            · BooknMovie {new Date().getFullYear()}
          </p>
        </footer>
      </main>

      {selected && (
        <Modal
          item={selected}
          onClose={() => setSelected(null)}
          onAuthRequired={() => {
            setSelected(null);
            setShowAuth(true);
          }}
          showToast={showToast}
        />
      )}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} showToast={showToast} />
      )}
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppInner />
      </FavoritesProvider>
    </AuthProvider>
  );
}
