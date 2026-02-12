import { useState } from "react";

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
    <div style={{ flex: 1, minWidth: "min(100%, 180px)" }}>
      <p
        style={{
          margin: "0 0 8px",
          color: "#7060a0",
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
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
              padding: "6px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  // Senin verdiğin icon'ları kullan
  const quickGenres = [
    {
      key: "Fantasy",
      label: isTR ? "Fantezi" : "Fantasy",
      icon: (
        <img
          src="/public/magic-hat.svg"
          alt="Fantasy"
          style={{
            width: "20px",
            height: "20px",
            filter:
              "brightness(0) saturate(100%) invert(55%) sepia(64%) saturate(1500%) hue-rotate(240deg)",
          }}
        />
      ),
    },
    {
      key: "Sci-Fi",
      label: isTR ? "Bilim Kurgu" : "Sci-Fi",
      icon: (
        <img
          src="/public/scifi.svg"
          alt="Sci-Fi"
          style={{
            width: "20px",
            height: "20px",
            filter:
              "brightness(0) saturate(100%) invert(55%) sepia(64%) saturate(1500%) hue-rotate(240deg)",
          }}
        />
      ),
    },
    {
      key: "Romance",
      label: isTR ? "Romantik" : "Romance",
      icon: (
        <img
          src="/public/heart.svg"
          alt="Romance"
          style={{
            width: "20px",
            height: "20px",
            filter:
              "brightness(0) saturate(100%) invert(55%) sepia(64%) saturate(1500%) hue-rotate(240deg)",
          }}
        />
      ),
    },
    {
      key: "Horror",
      label: isTR ? "Korku" : "Horror",
      icon: (
        <img
          src="/public/horror.svg"
          alt="Horror"
          style={{
            width: "20px",
            height: "20px",
            filter:
              "brightness(0) saturate(100%) invert(55%) sepia(64%) saturate(1500%) hue-rotate(240deg)",
          }}
        />
      ),
    },
    {
      key: "Thriller",
      label: isTR ? "Gerilim" : "Thriller",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" />
          <circle
            cx="12"
            cy="12"
            r="6"
            fill="none"
            stroke="#0c0a14"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
    {
      key: "Drama",
      label: "Drama",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 13.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 5.5c-2.33 0-4.32-1.45-5.12-3.5h1.67c.7 1.19 1.97 2 3.45 2s2.75-.81 3.45-2h1.67c-.8 2.05-2.79 3.5-5.12 3.5zm5-5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: "820px",
        margin: "0 auto",
        padding: "0 clamp(12px, 3vw, 20px)",
      }}
    >
      {/* Search bar */}
      <div
        style={{
          background: "#13111a",
          border: "1px solid #3a2a5a",
          borderRadius: "20px",
          padding: "clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 12px)",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          boxShadow: "0 20px 60px #00000060",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            color: "#a855f7",
            fontSize: "clamp(18px, 4vw, 22px)",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ⌕
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder={isTR ? "Film, kitap ara..." : "Search movies, books..."}
          style={{
            flex: "1 1 140px",
            background: "transparent",
            border: "none",
            color: "#f5f0ff",
            fontSize: "clamp(14px, 3.5vw, 16px)",
            fontFamily: "'DM Sans', sans-serif",
            padding: "10px 4px",
            outline: "none",
            minWidth: 0,
          }}
        />
        <button
          onClick={() => setFiltersOpen((p) => !p)}
          style={{
            background: filtersOpen ? "#a855f720" : "#1a0f2e",
            border: `1px solid ${filtersOpen ? "#a855f7" : "#3a2a5a"}`,
            color: filtersOpen ? "#a855f7" : "#7060a0",
            padding: "8px 12px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {isTR ? "⊞ Filtre" : "⊞ Filter"}
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
            padding: "10px 18px",
            borderRadius: "12px",
            cursor: loading ? "wait" : "pointer",
            fontSize: "clamp(13px, 3vw, 14px)",
            fontFamily: "'DM Mono', monospace",
            fontWeight: "700",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
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
            borderRadius: "16px",
            padding: "18px",
            marginTop: "10px",
            display: "flex",
            gap: "14px",
            flexDirection: "column",
            animation: "slideDown 0.2s ease",
          }}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
              padding: "11px",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            {isTR ? "Uygula" : "Apply"}
          </button>
        </div>
      )}

      {/* Quick genre chips with icons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "16px",
        }}
      >
        {quickGenres.map((g) => (
          <button
            key={g.key}
            onClick={() =>
              onSearch({
                query,
                genre: g.key,
                format: "All",
                language: "All",
                yearRange: "All",
              })
            }
            style={{
              background: "#13111a",
              border: "1px solid #3a2a5a",
              color: "#7060a0",
              padding: "7px 14px",
              borderRadius: "18px",
              cursor: "pointer",
              fontSize: "clamp(11px, 2.5vw, 13px)",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#a855f7";
              e.currentTarget.style.color = "#a855f7";
              const img = e.currentTarget.querySelector("img");
              if (img)
                img.style.filter =
                  "brightness(0) saturate(100%) invert(55%) sepia(100%) saturate(2000%) hue-rotate(240deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#3a2a5a";
              e.currentTarget.style.color = "#7060a0";
              const img = e.currentTarget.querySelector("img");
              if (img)
                img.style.filter =
                  "brightness(0) saturate(100%) invert(55%) sepia(64%) saturate(1500%) hue-rotate(240deg)";
            }}
          >
            <span
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {g.icon}
            </span>
            <span>{g.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
