import { useState, useRef } from "react";

const GENRES_EN = [
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
const TR_TO_EN = {
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
const LANGS_TR = [
  "Tümü",
  "Türkçe",
  "English",
  "Spanish",
  "French",
  "Japanese",
  "Korean",
  "German",
];
const LANGS_EN = [
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
const YEARS = [
  "All",
  "2020-2026",
  "2010-2019",
  "2000-2009",
  "1990-1999",
  "1900-1989",
];

export default function SearchBar({ onSearch, loading, lang, t }) {
  const isTR = lang === "tr";
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(isTR ? "Tümü" : "All");
  const [format, setFormat] = useState(isTR ? "Tümü" : "All");
  const [language, setLanguage] = useState(isTR ? "Tümü" : "All");
  const [yearRange, setYearRange] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toEnglishGenre = (g) => (isTR ? TR_TO_EN[g] || g : g);
  const toEnglishFormat = (f) =>
    isTR ? (f === "Film" ? "Movie" : f === "Kitap" ? "Book" : "All") : f;
  const allLabel = isTR ? "Tümü" : "All";

  const doSearch = () => {
    onSearch({
      query,
      genre: toEnglishGenre(genre),
      format: toEnglishFormat(format),
      language: language === allLabel ? "All" : language,
      yearRange,
    });
  };

  const FilterRow = ({ label, options, value, onChange }) => (
    <div>
      <p
        style={{
          margin: "0 0 8px",
          color: "#7060a0",
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              background: value === opt ? "#a855f720" : "transparent",
              border: `1px solid ${value === opt ? "#a855f7" : "#3a2a5a"}`,
              color: value === opt ? "#a855f7" : "#7060a0",
              padding: "5px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
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

  const quickGenres = isTR
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
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {/* Search bar */}
      <div
        style={{
          background: "#13111a",
          border: "1px solid #3a2a5a",
          borderRadius: "22px",
          padding: "6px 6px 6px 20px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          boxShadow: "0 24px 80px #00000070",
        }}
      >
        <span style={{ color: "#a855f7", fontSize: "22px", lineHeight: 1 }}>
          ⌕
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder={
            isTR
              ? "Film, kitap, tür, ruh hali ara..."
              : "Search movies, books, genres, moods..."
          }
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "#f5f0ff",
            fontSize: "16px",
            fontFamily: "'DM Sans', sans-serif",
            padding: "11px 0",
            outline: "none",
          }}
        />
        <button
          onClick={() => setFiltersOpen((p) => !p)}
          style={{
            background: filtersOpen ? "#a855f720" : "#1a0f2e",
            border: `1px solid ${filtersOpen ? "#a855f7" : "#3a2a5a"}`,
            color: filtersOpen ? "#a855f7" : "#7060a0",
            padding: "9px 16px",
            borderRadius: "16px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "'DM Mono', monospace",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
        >
          {isTR ? "⊞ Filtreler" : "⊞ Filters"}
        </button>
        <button
          onClick={doSearch}
          disabled={loading}
          style={{
            background: loading
              ? "#3a2a5a"
              : "linear-gradient(135deg, #a855f7, #ec4899)",
            border: "none",
            color: "#fff",
            padding: "11px 26px",
            borderRadius: "16px",
            cursor: loading ? "wait" : "pointer",
            fontSize: "15px",
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
          {isTR ? "Ara" : "Search"}
        </button>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div
          style={{
            background: "#13111a",
            border: "1px solid #3a2a5a",
            borderRadius: "18px",
            padding: "22px",
            marginTop: "10px",
            display: "flex",
            gap: "18px",
            flexDirection: "column",
            animation: "slideDown 0.2s ease",
          }}
        >
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <FilterRow
              label={isTR ? "Format" : "Format"}
              options={isTR ? FORMATS_TR : FORMATS_EN}
              value={format}
              onChange={setFormat}
            />
            <FilterRow
              label={isTR ? "Tür" : "Genre"}
              options={isTR ? GENRES_TR : GENRES_EN}
              value={genre}
              onChange={setGenre}
            />
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <FilterRow
              label={isTR ? "Dil" : "Language"}
              options={isTR ? LANGS_TR : LANGS_EN}
              value={language}
              onChange={setLanguage}
            />
            <FilterRow
              label={isTR ? "Yıl" : "Year"}
              options={YEARS}
              value={yearRange}
              onChange={setYearRange}
            />
          </div>
          <button
            onClick={doSearch}
            style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              border: "none",
              color: "#fff",
              padding: "12px",
              borderRadius: "12px",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontWeight: "700",
              fontSize: "14px",
              width: "100%",
            }}
          >
            {isTR ? "Filtrele & Ara" : "Apply Filters & Search"}
          </button>
        </div>
      )}

      {/* Quick chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "18px",
        }}
      >
        {quickGenres.map((g) => {
          const label = g.split(" ")[1];
          const englishLabel = isTR ? TR_TO_EN[label] || label : label;
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
                background: "#13111a",
                border: "1px solid #3a2a5a",
                color: "#7060a0",
                padding: "7px 16px",
                borderRadius: "22px",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a855f7";
                e.currentTarget.style.color = "#a855f7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#3a2a5a";
                e.currentTarget.style.color = "#7060a0";
              }}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
