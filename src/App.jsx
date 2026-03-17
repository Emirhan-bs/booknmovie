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

// ── i18n ──────────────────────────────────────────────────────────────────────
export const STRINGS = {
  tr: {
    hero1: "Bir Sonraki Favori",
    hero2: "Hikayeni Keşfet",
    heroSub: "TMDB ve Open Library destekli — dilediğin film ve kitabı keşfet",
    discover: "Keşfet",
    trending: "🔥 Trend",
    favorites: "♥ Favoriler",
    myList: "☰ Listem",
    signIn: "Giriş Yap",
    signOut: "Çıkış",
    welcome: "Hoş geldin",
    welcomeBack: "Tekrar hoş geldin",
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
    poweredBy: "Destekleyen",
    langToggle: "🇬🇧 EN",
    saved: "Kaydedildi ♥",
    removed: "Kaldırıldı",
    addedToList: "Listeye eklendi ✓",
    removedFromList: "Listeden kaldırıldı",
    reviewPosted: "Yorum paylaşıldı! ✓",
    signInToReview: "Yorum yazmak için giriş yapın...",
    writeReview: "Yorum yaz...",
    postReview: "Gönder",
    communityReviews: "Yorumlar",
    synopsis: "Özet",
    cast: "Oyuncular",
    director: "Yönetmen",
    by: "Yazan",
    favoriteBtn: "♡ Favori",
    favoritedBtn: "♥ Kaydedildi",
    listBtn: "+ Listeye Ekle",
    listedBtn: "✓ Listede",
    signInRequired: "Giriş yapmanız gerekiyor",
    noAccount: "Hesabınız yok mu?",
    hasAccount: "Hesabınız var mı?",
    signUp: "Üye ol",
    createAccount: "Hesap Oluştur",
    displayName: "Kullanıcı adı",
    email: "E-posta",
    password: "Şifre",
    fillAll: "Lütfen tüm alanları doldurun",
    joinTitle: "BooknMovie'ye Katıl",
    loginTitle: "Tekrar Hoş Geldin",
    loginSub: "Hesabınıza giriş yapın",
    signupSub: "Ücretsiz hesap oluşturun",
    pages: "sayfa",
    min: "dk",
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
    welcome: "Welcome",
    welcomeBack: "Welcome back",
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
    langToggle: "🇹🇷 TR",
    saved: "Saved ♥",
    removed: "Removed",
    addedToList: "Added to list ✓",
    removedFromList: "Removed from list",
    reviewPosted: "Review posted! ✓",
    signInToReview: "Sign in to write a review...",
    writeReview: "Write a review...",
    postReview: "Post",
    communityReviews: "Community Reviews",
    synopsis: "Synopsis",
    cast: "Top Cast",
    director: "Director",
    by: "by",
    favoriteBtn: "♡ Favorite",
    favoritedBtn: "♥ Saved",
    listBtn: "+ My List",
    listedBtn: "✓ In List",
    signInRequired: "Please sign in",
    noAccount: "No account?",
    hasAccount: "Have an account?",
    signUp: "Sign up",
    createAccount: "Create Account",
    displayName: "Display name",
    email: "Email address",
    password: "Password",
    fillAll: "Please fill in all fields",
    joinTitle: "Join BooknMovie",
    loginTitle: "Welcome Back",
    loginSub: "Sign in to your account",
    signupSub: "Create your free account",
    pages: "pages",
    min: "min",
  },
};

// ── Normalize movie ───────────────────────────────────────────────────────────
const normalizeMovie = (movie) => ({
  id: `movie_${movie.id}`,
  tmdbId: movie.id,
  type: "movie",
  title: movie.title || movie.original_title || "Bilinmiyor",
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
    movie.original_language === "tr"
      ? "Türkçe"
      : movie.original_language === "en"
        ? "English"
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
});

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    style={{
      background: "#13111a",
      border: "1px solid #231f2e",
      borderRadius: "18px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: "260px",
        background: "#1c1827",
        animation: "shimmer 1.5s infinite",
      }}
    />
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          height: "16px",
          background: "#1c1827",
          borderRadius: "6px",
          width: "80%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div
        style={{
          height: "13px",
          background: "#1c1827",
          borderRadius: "6px",
          width: "55%",
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle, count }) => (
  <div style={{ marginBottom: "24px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "14px",
        flexWrap: "wrap",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#f5f0ff",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "28px",
          fontWeight: "700",
        }}
      >
        {title}
      </h2>
      {count > 0 && (
        <span
          style={{
            color: "#6060a0",
            fontFamily: "'DM Mono', monospace",
            fontSize: "13px",
          }}
        >
          {count} sonuç
        </span>
      )}
    </div>
    {subtitle && (
      <p
        style={{
          margin: "6px 0 0",
          color: "#6060a0",
          fontFamily: "'DM Mono', monospace",
          fontSize: "13px",
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// ── AppInner ──────────────────────────────────────────────────────────────────
function AppInner() {
  const { favorites, myList } = useFavorites();
  const [lang, setLang] = useState("en");
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
      const allBooks = [...books, ...turkishBooks];
      const mixed = [];
      const max = Math.max(movies.length, allBooks.length);
      for (let i = 0; i < max; i++) {
        if (movies[i]) mixed.push(movies[i]);
        if (allBooks[i]) mixed.push(allBooks[i]);
      }
      setItems(mixed);
    } catch (e) {
      console.error("loadDefault error:", e);
      showToast("İçerik yüklenemedi. Lütfen tekrar deneyin.");
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
      if (format === "All" || format === "Movie" || format === "Film") {
        if (query)
          promises.push(
            searchMovies(query).then((r) =>
              (r.results || []).map(normalizeMovie),
            ),
          );
        else if (genre && genre !== "All") {
          const gid = GENRE_IDS[genre];
          const yp =
            yearRange !== "All"
              ? {
                  "primary_release_date.gte": `${yearRange.split("-")[0]}-01-01`,
                  "primary_release_date.lte": `${yearRange.split("-")[1] || "2026"}-12-31`,
                }
              : {};
          promises.push(
            discoverMovies({ with_genres: gid, ...yp }).then((r) =>
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
        } else if (genre && genre !== "All") {
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
      if (language !== "All" && language !== "Tümü" && language !== "")
        combined = combined.filter((i) => i.language === language);
      if (yearRange !== "All") {
        const [from, to] = yearRange.split("-").map(Number);
        combined = combined.filter(
          (i) => i.year && i.year >= from && i.year <= (to || 2030),
        );
      }
      if (format === "All") {
        const mv = combined.filter((i) => i.type === "movie");
        const bk = combined.filter((i) => i.type === "book");
        const mixed = [];
        for (let i = 0; i < Math.max(mv.length, bk.length); i++) {
          if (mv[i]) mixed.push(mv[i]);
          if (bk[i]) mixed.push(bk[i]);
        }
        setItems(mixed);
      } else {
        setItems(combined);
      }
      if (combined.length === 0)
        showToast(lang === "tr" ? "Sonuç bulunamadı." : "No results found.");
    } catch (e) {
      console.error("Search error:", e);
      showToast(lang === "tr" ? "Arama başarısız." : "Search failed.");
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
        background: "#0c0a14",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f5f0ff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#0a0812; }
        ::-webkit-scrollbar-thumb { background:#3a2a5a; border-radius:3px; }
        input, textarea { color-scheme:dark; }
        input:focus, textarea:focus { outline:none !important; border-color:#c084fc !important; box-shadow:0 0 0 3px #c084fc15 !important; }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:0.3}50%{opacity:0.8} }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{opacity:0.3}50%{opacity:0.7}100%{opacity:0.3} }
        @keyframes cardIn { from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)} }
        .card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:24px; }
        @media(max-width:640px){ .card-grid{grid-template-columns:repeat(2,1fr);gap:14px;} }
        @media(max-width:400px){ .card-grid{grid-template-columns:1fr;} }
        button:hover { opacity:0.88; }
      `}</style>

      {/* Ambient */}
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
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #7c3aed18 0%, transparent 65%)",
            top: "-350px",
            left: "-200px",
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #db277715 0%, transparent 65%)",
            bottom: "-100px",
            right: "-150px",
            animation: "pulse 10s ease-in-out infinite 3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #0ea5e910 0%, transparent 65%)",
            top: "40%",
            right: "20%",
            animation: "pulse 6s ease-in-out infinite 1.5s",
          }}
        />
      </div>

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
            padding: "64px 24px 48px",
            textAlign: "center",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(30px)",
            transition: "all 0.9s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
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
                fill="#fdf4ff"
                fillOpacity="0.92"
              />
              <rect x="8" y="20" width="6" height="55" rx="2" fill="#9333ea" />
              <line
                x1="18"
                y1="34"
                x2="40"
                y2="34"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="18"
                y1="41"
                x2="40"
                y2="41"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="18"
                y1="48"
                x2="32"
                y2="48"
                stroke="#a855f7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.5"
              />
              <circle
                cx="68"
                cy="42"
                r="24"
                fill="#1a0f2e"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <circle cx="68" cy="42" r="3" fill="#a855f7" />
              {[0, 60, 120, 180, 240, 300].map((d, i) => (
                <circle
                  key={i}
                  cx={68 + 16 * Math.cos((d * Math.PI) / 180)}
                  cy={42 + 16 * Math.sin((d * Math.PI) / 180)}
                  r="3"
                  fill="#a855f7"
                  fillOpacity="0.6"
                />
              ))}
              <polygon points="62,36 62,48 74,42" fill="#a855f7" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px,7vw,80px)",
              fontWeight: "700",
              lineHeight: "1.05",
              marginBottom: "14px",
              background:
                "linear-gradient(135deg, #f5f0ff 20%, #a855f7 60%, #ec4899 100%)",
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
              color: "#7060a0",
              fontSize: "17px",
              fontFamily: "'DM Mono', monospace",
              maxWidth: "500px",
              margin: "0 auto 40px",
              lineHeight: "1.7",
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
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 28px 80px",
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
                background: "linear-gradient(135deg, #a855f715, #ec489910)",
                border: "1px solid #a855f730",
                borderRadius: "20px",
                padding: "20px 24px",
                marginBottom: "28px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                style={{ fontSize: "28px", animation: "pulse 2s infinite" }}
              >
                🔥
              </span>
              <div>
                <h3
                  style={{
                    color: "#f5f0ff",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "22px",
                    marginBottom: "4px",
                  }}
                >
                  {t.trendingTitle}
                </h3>
                <p
                  style={{
                    color: "#7060a0",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "13px",
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
            <div style={{ textAlign: "center", padding: "100px 20px" }}>
              <div
                style={{ fontSize: "70px", marginBottom: "20px", opacity: 0.2 }}
              >
                ◎
              </div>
              <h3
                style={{
                  color: "#4a3a7a",
                  fontFamily: "'Cormorant Garamond', serif",
                  marginBottom: "10px",
                  fontSize: "24px",
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
                  color: "#3a2a6a",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "14px",
                  marginBottom: "24px",
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
                    background: "linear-gradient(135deg, #a855f7, #ec4899)",
                    border: "none",
                    color: "#fff",
                    padding: "12px 28px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "14px",
                    fontWeight: "600",
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

        <footer
          style={{
            borderTop: "1px solid #1e1530",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "#2a1a4a",
              fontFamily: "'DM Mono', monospace",
              fontSize: "12px",
            }}
          >
            {t.poweredBy}:{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#a855f750", textDecoration: "none" }}
            >
              TMDB
            </a>{" "}
            &amp;{" "}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#a855f750", textDecoration: "none" }}
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
          lang={lang}
          t={t}
        />
      )}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          showToast={showToast}
          lang={lang}
          t={t}
        />
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
