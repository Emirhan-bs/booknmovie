import { useState, useRef } from "react";

const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
];
const GENRES_TR = [
  "Tümü",
  "Aksiyon",
  "Komedi",
  "Drama",
  "Fantezi",
  "Korku",
  "Gizem",
  "Romantik",
  "Bilim Kurgu",
  "Gerilim",
];
const GENRE_MAP_TR = {
  Tümü: "All",
  Aksiyon: "Action",
  Komedi: "Comedy",
  Drama: "Drama",
  Fantezi: "Fantasy",
  Korku: "Horror",
  Gizem: "Mystery",
  Romantik: "Romance",
  "Bilim Kurgu": "Sci-Fi",
  Gerilim: "Thriller",
};

const LANGUAGES_TR = [
  "Tümü",
  "Türkçe",
  "English",
  "Spanish",
  "French",
  "Japanese",
  "Korean",
  "German",
];
const LANGUAGES_EN = [
  "All",
  "Türkçe",
  "English",
  "Spanish",
  "French",
  "Japanese",
  "Korean",
  "German",
];

const FORMATS_TR = ["Tümü", "Film", "Kitap"];
const FORMATS_EN = ["All", "Movie", "Book"];

const YEAR_RANGES = [
  "All",
  "2020-2026",
  "2010-2019",
  "2000-2009",
  "1990-1999",
  "1900-1989",
];

export default function SearchBar({ onSearch, loading, lang, t }) {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(lang === "tr" ? "Tümü" : "All");
  const [format, setFormat] = useState(lang === "tr" ? "Tümü" : "All");
  const [language, setLanguage] = useState(lang === "tr" ? "Tümü" : "All");
  const [yearRange, setYearRange] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const inputRef = useRef(null);

  const getEnglishGenre = (g) => {
    if (lang === "tr") return GENRE_MAP_TR[g] || g;
    return g;
  };

  const handleSearch = () => {
    onSearch({
      query,
      genre: getEnglishGenre(genre),
      format:
        lang === "tr"
          ? format === "Film"
            ? "Movie"
            : format === "Kitap"
              ? "Book"
              : "All"
          : format,
      language: language === "Tümü" ? "All" : language,
      yearRange,
    });
  };

  const genres = lang === "tr" ? GENRES_TR : GENRES;
  const formats = lang === "tr" ? FORMATS_TR : FORMATS_EN;
  const languages = lang === "tr" ? LANGUAGES_TR : LANGUAGES_EN;
  const allLabel = lang === "tr" ? "Tümü" : "All";

  const FilterRow = ({ label, options, value, onChange }) => (
    <div>
      <p
        style={{
          margin: "0 0 6px",
          color: "#5050a0",
          fontSize: "10px",
          fontFamily: "'DM Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              background: value === opt ? "#FF6B3520" : "transparent",
              border: `1px solid ${value === opt ? "#FF6B35" : "#2a2a4a"}`,
              color: value === opt ? "#FF6B35" : "#6060a0",
              padding: "4px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.15s",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const quickGenres =
    lang === "tr"
      ? [
          "✦ Fantezi",
          "◈ Bilim Kurgu",
          "◉ Gerilim",
          "♥ Romantik",
          "△ Korku",
          "◆ Drama",
        ]
      : [
          "✦ Fantasy",
          "◈ Sci-Fi",
          "◉ Thriller",
          "♥ Romance",
          "△ Horror",
          "◆ Drama",
        ];

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      {/* Search input */}
      <div
        style={{
          background: "#0f0f1e",
          border: "1px solid #2a2a4a",
          borderRadius: "20px",
          padding: "6px 6px 6px 18px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          boxShadow: "0 20px 60px #00000060",
        }}
      >
        <span style={{ color: "#FF6B35", fontSize: "20px", lineHeight: 1 }}>
          ⌕
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={
            lang === "tr"
              ? "Film, kitap, tür, ruh hali ara..."
              : "Search movies, books, genres, moods..."
          }
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "#f0f0ff",
            fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            padding: "10px 0",
            outline: "none",
          }}
        />
        <button
          onClick={() => setFiltersOpen((p) => !p)}
          style={{
            background: filtersOpen ? "#FF6B3520" : "#1e1e32",
            border: `1px solid ${filtersOpen ? "#FF6B35" : "transparent"}`,
            color: filtersOpen ? "#FF6B35" : "#6060a0",
            padding: "8px 14px",
            borderRadius: "14px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
        >
          {t?.filters || "⊞ Filters"}
        </button>
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            background: loading
              ? "#3a3a5a"
              : "linear-gradient(135deg, #FF6B35, #E55A2B)",
            border: "none",
            color: "#fff",
            padding: "10px 22px",
            borderRadius: "14px",
            cursor: loading ? "wait" : "pointer",
            fontSize: "14px",
            fontFamily: "'DM Mono', monospace",
            fontWeight: "700",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {loading && (
            <span
              style={{
                display: "inline-block",
                width: "14px",
                height: "14px",
                border: "2px solid #ffffff40",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          )}
          {t?.search || "Search"}
        </button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div
          style={{
            background: "#0f0f1e",
            border: "1px solid #2a2a4a",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "8px",
            display: "flex",
            gap: "16px",
            flexDirection: "column",
            animation: "slideDown 0.2s ease",
          }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <FilterRow
              label={t?.format || "Format"}
              options={formats}
              value={format}
              onChange={setFormat}
            />
            <FilterRow
              label={t?.genre || "Genre"}
              options={genres}
              value={genre}
              onChange={setGenre}
            />
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <FilterRow
              label={t?.language || "Language"}
              options={languages}
              value={language}
              onChange={setLanguage}
            />
            <FilterRow
              label={t?.year || "Year"}
              options={YEAR_RANGES}
              value={yearRange}
              onChange={setYearRange}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              background: "linear-gradient(135deg, #FF6B35, #E55A2B)",
              border: "none",
              color: "#fff",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontWeight: "700",
              fontSize: "13px",
              width: "100%",
            }}
          >
            {t?.applyFilters || "Apply Filters & Search"}
          </button>
        </div>
      )}

      {/* Quick genre chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        {quickGenres.map((g) => {
          const label = g.split(" ")[1];
          const englishLabel =
            lang === "tr" ? GENRE_MAP_TR[label] || label : label;
          return (
            <button
              key={g}
              onClick={() =>
                onSearch({
                  query,
                  genre: englishLabel,
                  format: "All",
                  language: "All",
                  yearRange: "All",
                })
              }
              style={{
                background: "#12121f",
                border: "1px solid #2a2a4a",
                color: "#6060a0",
                padding: "6px 14px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#FF6B35";
                e.target.style.color = "#FF6B35";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#2a2a4a";
                e.target.style.color = "#6060a0";
              }}
            >
              {g}
            </button>
          );
        })}
        {/* Turkish books shortcut */}
        <button
          onClick={() =>
            onSearch({
              query: "roman",
              genre: "All",
              format: "Book",
              language: "Türkçe",
              yearRange: "All",
            })
          }
          style={{
            background: "#FF6B3515",
            border: "1px solid #FF6B3540",
            color: "#FF6B35",
            padding: "6px 14px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            transition: "all 0.2s",
          }}
        >
          🇹🇷 Türkçe Kitaplar
        </button>
      </div>
    </div>
  );
}
