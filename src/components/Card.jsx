import { useState } from "react";
import { getPosterUrl } from "../services/tmdb";

const GENRE_COLORS = {
  Fantasy: "#2d1b4e",
  "Sci-Fi": "#0d1b2e",
  Thriller: "#2d1040",
  Romance: "#3d0a30",
  Drama: "#1a1040",
  Horror: "#1a0505",
  Mystery: "#0a1a2e",
  Action: "#1a1a05",
  Comedy: "#1a2a05",
  Fiction: "#0d1b2e",
  default: "#1a0f2e",
};
const GENRE_ICONS = {
  Fantasy: "✦",
  "Sci-Fi": "◈",
  Thriller: "◉",
  Romance: "♥",
  Drama: "◆",
  Horror: "△",
  Mystery: "◇",
  Action: "▶",
  Comedy: "◎",
  Fiction: "◈",
  default: "◈",
};

export default function Card({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const icon = GENRE_ICONS[item.genre] || GENRE_ICONS.default;
  const color = GENRE_COLORS[item.genre] || GENRE_COLORS.default;

  const imageUrl =
    item.type === "movie"
      ? item.posterPath
        ? getPosterUrl(item.posterPath, "w342")
        : null
      : item.coverUrl || null;

  const showImage = imageUrl && !imgError;

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1a0f2e" : "#13111a",
        border: `1px solid ${hovered ? "#a855f7" : "#231f2e"}`,
        borderRadius: "18px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
        boxShadow: hovered
          ? `0 24px 60px ${color}90, 0 0 0 1px #a855f730`
          : "0 4px 20px #00000060",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Poster */}
      <div
        style={{
          height: "260px",
          position: "relative",
          overflow: "hidden",
          background: showImage
            ? "#000"
            : `linear-gradient(135deg, ${color} 0%, #0c0a14 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showImage ? (
          <img
            src={imageUrl}
            alt={item.title}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.07)" : "scale(1)",
            }}
          />
        ) : (
          <>
            <div
              style={{
                fontSize: "90px",
                opacity: 0.1,
                position: "absolute",
                transform: "rotate(-15deg) scale(2)",
                color: "#fff",
              }}
            >
              {icon}
            </div>
            <div
              style={{
                fontSize: "60px",
                position: "relative",
                zIndex: 1,
                filter: "drop-shadow(0 4px 16px #00000080)",
              }}
            >
              {icon}
            </div>
          </>
        )}

        {/* Type badge */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: item.type === "movie" ? "#a855f7" : "#10b981",
            color: "#fff",
            fontSize: "10px",
            fontFamily: "'DM Mono', monospace",
            padding: "4px 10px",
            borderRadius: "22px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: "700",
            backdropFilter: "blur(4px)",
          }}
        >
          {item.type === "movie" ? "Film" : "Kitap"}
        </div>

        {/* Rating */}
        {item.rating && (
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              background: "#000000bb",
              backdropFilter: "blur(8px)",
              color: "#a855f7",
              fontSize: "12px",
              fontFamily: "'DM Mono', monospace",
              padding: "4px 10px",
              borderRadius: "22px",
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            ★{" "}
            {typeof item.rating === "number"
              ? item.rating.toFixed(1)
              : item.rating}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "90px",
            background: "linear-gradient(to top, #13111a, transparent)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "7px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#f5f0ff",
            fontSize: "15px",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: "700",
            lineHeight: "1.3",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: "#a855f7",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {item.type === "book" ? `${item.author}` : `${item.director || ""}`}
          {item.year ? ` · ${item.year}` : ""}
        </p>
        <div
          style={{
            display: "flex",
            gap: "5px",
            marginTop: "2px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "#1a0f2e",
              color: "#6050a0",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
              padding: "3px 9px",
              borderRadius: "6px",
            }}
          >
            {item.genre}
          </span>
          {item.language && item.language !== "Unknown" && (
            <span
              style={{
                background: "#1a0f2e",
                color: "#6050a0",
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
                padding: "3px 9px",
                borderRadius: "6px",
              }}
            >
              {item.language}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
