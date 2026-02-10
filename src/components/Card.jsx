import { useState } from "react";
import { getPosterUrl } from "../services/tmdb";

const GENRE_ICONS = {
  Fantasy: "✦", "Sci-Fi": "◈", Thriller: "◉", Romance: "♥",
  Drama: "◆", Horror: "△", Mystery: "◇", Action: "▶", Comedy: "◎",
  Fiction: "◈", default: "◈",
};

const GENRE_COLORS = {
  Fantasy: "#1a472a", "Sci-Fi": "#0d1b2a", Thriller: "#2d1b4e",
  Romance: "#4a1942", Drama: "#2a1a0a", Horror: "#1a0a0a",
  Mystery: "#0a1a2a", Action: "#1a1a0a", Comedy: "#2a2a0a",
  Fiction: "#0d1b2a", default: "#1a1a2e",
};

export default function Card({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const icon = GENRE_ICONS[item.genre] || GENRE_ICONS.default;
  const color = GENRE_COLORS[item.genre] || GENRE_COLORS.default;

  // Get the right image URL
  const imageUrl = item.type === "movie"
    ? (item.posterPath ? getPosterUrl(item.posterPath, "w342") : null)
    : item.coverUrl || null;

  const showImage = imageUrl && !imgError;

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#1a1a2e" : "#12121f",
        border: `1px solid ${hovered ? "#FF6B35" : "#1e1e32"}`,
        borderRadius: "16px", overflow: "hidden",
        cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 60px ${color}80, 0 0 0 1px #FF6B3530` : "0 4px 20px #00000050",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Poster / Cover */}
      <div style={{
        height: "240px", position: "relative", overflow: "hidden",
        background: showImage ? "#000" : `linear-gradient(135deg, ${color} 0%, #0a0a15 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {showImage ? (
          <img
            src={imageUrl}
            alt={item.title}
            onError={() => setImgError(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
          />
        ) : (
          <>
            <div style={{ fontSize: "80px", opacity: 0.12, position: "absolute", transform: "rotate(-15deg) scale(2)", color: "#fff" }}>{icon}</div>
            <div style={{ fontSize: "56px", position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 12px #00000080)" }}>{icon}</div>
          </>
        )}

        {/* Type badge */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          background: item.type === "movie" ? "#FF6B35" : "#4CAF7D",
          color: "#fff", fontSize: "10px", fontFamily: "'DM Mono', monospace",
          padding: "3px 8px", borderRadius: "20px",
          textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700",
          backdropFilter: "blur(4px)",
        }}>{item.type}</div>

        {/* Rating badge */}
        {item.rating && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            background: "#000000aa", backdropFilter: "blur(8px)",
            color: "#FF6B35", fontSize: "11px", fontFamily: "'DM Mono', monospace",
            padding: "3px 8px", borderRadius: "20px",
            display: "flex", alignItems: "center", gap: "3px",
          }}>★ {typeof item.rating === "number" ? item.rating.toFixed(1) : item.rating}</div>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "80px",
          background: "linear-gradient(to top, #12121f, transparent)",
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: "14px", flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
        <h3 style={{
          margin: 0, color: "#f0f0ff", fontSize: "14px",
          fontFamily: "'Playfair Display', serif", fontWeight: "700",
          lineHeight: "1.3",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{item.title}</h3>

        <p style={{ margin: 0, color: "#FF6B35", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>
          {item.type === "book"
            ? `by ${item.author}`
            : `dir. ${item.director || "Unknown"}`}
          {item.year ? ` · ${item.year}` : ""}
        </p>

        <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
          <span style={{ background: "#1e1e32", color: "#5050a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "2px 7px", borderRadius: "4px" }}>
            {item.genre}
          </span>
          {item.language && item.language !== "Unknown" && (
            <span style={{ background: "#1e1e32", color: "#5050a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "2px 7px", borderRadius: "4px" }}>
              {item.language}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
