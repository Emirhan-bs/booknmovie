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

  const quickGenres = [
    {
      key: "Fantasy",
      label: isTR ? "Fantezi" : "Fantasy",
      icon: (
        <img
          src="/magic-hat.png"
          alt="Fantasy"
          style={{
            width: "32px",
            height: "42px",
          }}
        />
      ),
    },
    {
      key: "Sci-Fi",
      label: isTR ? "Bilim Kurgu" : "Sci-Fi",
      icon: (
        <img
          src="/ufo.png"
          alt="Sci-Fi"
          style={{
            width: "32px",
            height: "42px",
          }}
        />
      ),
    },
    {
      key: "Romance",
      label: isTR ? "Romantik" : "Romance",
      icon: (
        <img
          src="/heart.png"
          alt="Romance"
          style={{
            width: "32px",
            height: "42px",
          }}
        />
      ),
    },
    {
      key: "Horror",
      label: isTR ? "Korku" : "Horror",
      icon: (
        <img
          src="/horror.png"
          alt="Horror"
          style={{
            width: "32px",
            height: "42px",
          }}
        />
      ),
    },
    {
      key: "Thriller",
      label: isTR ? "Gerilim" : "Thriller",
      icon: (
        <img
          src="/thriller.png"
          alt="Thriller"
          style={{
            width: "32px",
            height: "42px",
          }}
        />
      ),
    },
    {
      key: "Drama",
      label: "Drama",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 14 14"
          fill="#a855f7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 1,4.9664652 C 3.54449,11.092585 5.56,10.606465 5.56,10.606465 7.618367,9.3929952 6.614286,3.3844152 6.614286,3.3844152 4.749388,5.1844152 1,4.9664652 1,4.9664652 l 0,0 z m 1.748571,2.46857 c 0,0 -0.05878,-0.92939 0.526531,-1.05429 0,0 0.686939,-0.26816 1.054286,0.70286 0.0012,0 -0.63551,-0.57796 -1.580817,0.35143 l 0,0 z m 2.108572,-0.70286 c 0,0 -0.02449,-0.68571 0.52653,-0.88653 0,0 0.988164,-0.21796 1.054286,0.71143 0.0012,-10e-4 -0.852245,-0.44449 -1.580816,0.1751 l 0,0 z m -1.054286,1.75714 c 0,0 1.757143,0.0257 2.284898,-0.70285 0,0 0.309796,1.12163 -0.879184,1.40693 0,0 -1.054285,0.15796 -1.405714,-0.70408 l 0,0 z M 13,4.9664652 c 0,0 -3.749388,0.21795 -5.61551,-1.58205 0,0 -1.004082,6.00858 1.054286,7.2220498 0,0 2.016734,0.48612 4.561224,-5.6399998 l 0,0 z m -5.087755,0.86204 c 0.945306,0.91959 1.582041,0.35142 1.582041,0.35142 C 9.125714,7.1423752 8.44,6.8827852 8.44,6.8827852 7.853469,6.7493152 7.912245,5.8285052 7.912245,5.8285052 l 0,0 z m 2.108571,0.70285 c 0.728572,0.61102 1.582041,0.17511 1.582041,0.17511 -0.06735,0.92081 -1.054286,0.70285 -1.054286,0.70285 -0.544898,-0.19959 -0.527755,-0.87796 -0.527755,-0.87796 l 0,0 z m -2.142857,1.96653 c 0.351429,-0.85347 1.405714,-0.70408 1.405714,-0.70408 1.180409,0.28531 0.87796,1.41429 0.87796,1.41429 -0.526531,-0.72735 -2.283674,-0.71021 -2.283674,-0.71021 l 0,0 z" />
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
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#3a2a5a";
              e.currentTarget.style.color = "#7060a0";
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
