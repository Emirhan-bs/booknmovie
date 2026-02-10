import { useState, useEffect } from "react";
import { getPosterUrl, getMovieDetails } from "../services/tmdb";
import { getBookDetails, getBookCoverByOLID } from "../services/openLibrary";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const StarRating = ({ rating, max = 10 }) => {
  // Normalize to 5 stars
  const normalized = max === 10 ? (rating / 10) * 5 : rating;
  const full = Math.floor(normalized);
  const half = normalized % 1 >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{
          fontSize: "14px",
          color: s <= full ? "#FF6B35" : s === full + 1 && half ? "#FF6B35" : "#3a3a4a",
          opacity: s === full + 1 && half ? 0.55 : 1,
        }}>★</span>
      ))}
      <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "4px", fontFamily: "'DM Mono', monospace" }}>
        {typeof rating === "number" ? rating.toFixed(1) : rating}
      </span>
    </span>
  );
};

export default function Modal({ item, onClose, onAuthRequired, showToast }) {
  const { toggleFavorite, toggleList, isFavorite, isInList } = useFavorites();
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([
    { user: "alex_r", text: "An absolute masterpiece — highly recommend!", rating: 5 },
    { user: "cinephile99", text: "One of the best in its genre.", rating: 4 },
  ]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        if (item.type === "movie" && item.tmdbId) {
          const data = await getMovieDetails(item.tmdbId);
          setDetails(data);
        } else if (item.type === "book" && item.olid) {
          const data = await getBookDetails(item.olid);
          setDetails(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [item]);

  const handleFavorite = () => {
    if (!user) { onAuthRequired(); return; }
    toggleFavorite(item);
    showToast(isFavorite(item.id) ? "Removed from favorites" : "Added to favorites ♥");
  };

  const handleList = () => {
    if (!user) { onAuthRequired(); return; }
    toggleList(item);
    showToast(isInList(item.id) ? "Removed from list" : "Added to your list ✓");
  };

  const submitReview = () => {
    if (!review.trim()) return;
    if (!user) { onAuthRequired(); return; }
    setReviews((prev) => [{ user: user.name, text: review, rating: 5 }, ...prev]);
    setReview("");
    showToast("Review posted! ✓");
  };

  // Resolve images
  const posterUrl = item.type === "movie"
    ? (item.posterPath ? getPosterUrl(item.posterPath, "w500") : null)
    : item.coverUrl || (item.coverId ? getBookCoverByOLID(item.coverId, "L") : null);

  // Resolve description
  const description = item.type === "movie"
    ? (details?.overview || item.summary || "No description available.")
    : (typeof details?.description === "string"
        ? details.description
        : details?.description?.value || item.summary || "No description available.");

  const cast = item.type === "movie" && details?.credits?.cast?.slice(0, 6);
  const director = item.type === "movie"
    ? (details?.credits?.crew?.find((c) => c.job === "Director")?.name || item.director)
    : null;

  const genreNames = item.type === "movie" && details?.genres
    ? details.genres.map((g) => g.name).join(", ")
    : item.genre;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "#000000b0", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", backdropFilter: "blur(10px)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#0f0f1e", border: "1px solid #2a2a4a",
        borderRadius: "24px", width: "100%", maxWidth: "700px",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 40px 120px #00000080",
        animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Hero */}
        <div style={{
          height: "260px", position: "relative", overflow: "hidden",
          background: posterUrl ? "#000" : `linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)`,
          borderRadius: "24px 24px 0 0",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {posterUrl ? (
            <img src={posterUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
          ) : (
            <div style={{ fontSize: "96px", opacity: 0.1 }}>◈</div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0f0f1e 100%)" }} />

          {/* Small poster overlay */}
          {posterUrl && (
            <div style={{
              position: "absolute", bottom: "-40px", left: "28px",
              width: "90px", height: "135px", borderRadius: "10px",
              overflow: "hidden", border: "2px solid #2a2a4a",
              boxShadow: "0 8px 24px #000",
            }}>
              <img src={posterUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          <button onClick={onClose} style={{
            position: "absolute", top: "16px", right: "16px",
            background: "#000000aa", backdropFilter: "blur(4px)",
            border: "1px solid #3a3a5a", color: "#fff",
            width: "36px", height: "36px", borderRadius: "50%",
            cursor: "pointer", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: `${posterUrl ? "52px" : "24px"} 28px 28px` }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
            <span style={{ background: item.type === "movie" ? "#FF6B35" : "#4CAF7D", color: "#fff", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>{item.type}</span>
            {genreNames && <span style={{ background: "#1e1e32", color: "#7070a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: "20px" }}>{genreNames}</span>}
            {item.language && item.language !== "Unknown" && <span style={{ background: "#1e1e32", color: "#7070a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: "20px" }}>{item.language}</span>}
            {item.year && <span style={{ background: "#1e1e32", color: "#7070a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: "20px" }}>{item.year}</span>}
            {item.pages && <span style={{ background: "#1e1e32", color: "#7070a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: "20px" }}>{item.pages} pages</span>}
            {details?.runtime && <span style={{ background: "#1e1e32", color: "#7070a0", fontSize: "10px", fontFamily: "'DM Mono', monospace", padding: "3px 10px", borderRadius: "20px" }}>{details.runtime} min</span>}
          </div>

          <h2 style={{ margin: "0 0 6px", color: "#f0f0ff", fontFamily: "'Playfair Display', serif", fontSize: "26px", lineHeight: "1.2" }}>{item.title}</h2>

          <p style={{ margin: "0 0 10px", color: "#FF6B35", fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>
            {item.type === "book" ? `by ${item.author || "Unknown"}` : `Directed by ${director || item.director || "Unknown"}`}
          </p>

          {item.rating && (
            <div style={{ marginBottom: "16px" }}>
              <StarRating rating={item.rating} max={item.type === "movie" ? 10 : 5} />
            </div>
          )}

          {/* Cast */}
          {cast?.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 6px", color: "#5050a0", fontSize: "11px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Top Cast</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {cast.map((c) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#12121f", border: "1px solid #1e1e32", borderRadius: "8px", padding: "6px 10px" }}>
                    {c.profile_path && (
                      <img src={getPosterUrl(c.profile_path, "w45")} alt={c.name} style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} />
                    )}
                    <div>
                      <p style={{ margin: 0, color: "#d0d0f0", fontSize: "11px", fontFamily: "'DM Mono', monospace" }}>{c.name}</p>
                      <p style={{ margin: 0, color: "#5050a0", fontSize: "10px", fontFamily: "'DM Mono', monospace" }}>{c.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis */}
          <div style={{ marginBottom: "16px" }}>
            <p style={{ margin: "0 0 6px", color: "#5050a0", fontSize: "11px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Synopsis</p>
            {loading ? (
              <div style={{ height: "60px", background: "#1e1e32", borderRadius: "8px", animation: "pulse 1.5s infinite" }} />
            ) : (
              <p style={{ margin: 0, color: "#c0c0e0", fontSize: "14px", lineHeight: "1.7" }}>{description}</p>
            )}
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
              {item.tags.slice(0, 6).map((tag) => (
                <span key={tag} style={{ fontSize: "11px", color: "#6060a0", border: "1px solid #2a2a4a", borderRadius: "6px", padding: "3px 10px", fontFamily: "'DM Mono', monospace" }}>#{tag}</span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button onClick={handleFavorite} style={{
              flex: 1, minWidth: "130px", padding: "12px 16px",
              background: isFavorite(item.id) ? "#FF6B35" : "transparent",
              border: `1px solid ${isFavorite(item.id) ? "#FF6B35" : "#3a3a5a"}`,
              color: isFavorite(item.id) ? "#fff" : "#a0a0c0",
              borderRadius: "12px", cursor: "pointer", fontSize: "13px",
              fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}>
              {isFavorite(item.id) ? "♥ Saved" : "♡ Favorite"}
            </button>
            <button onClick={handleList} style={{
              flex: 1, minWidth: "130px", padding: "12px 16px",
              background: isInList(item.id) ? "#4CAF7D20" : "transparent",
              border: `1px solid ${isInList(item.id) ? "#4CAF7D" : "#3a3a5a"}`,
              color: isInList(item.id) ? "#4CAF7D" : "#a0a0c0",
              borderRadius: "12px", cursor: "pointer", fontSize: "13px",
              fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}>
              {isInList(item.id) ? "✓ In List" : "+ My List"}
            </button>
          </div>

          {/* Reviews */}
          <div style={{ borderTop: "1px solid #1e1e32", paddingTop: "20px" }}>
            <p style={{ margin: "0 0 12px", color: "#5050a0", fontSize: "11px", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>Community Reviews</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ background: "#12121f", border: "1px solid #1e1e32", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#FF6B35", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>@{r.user}</span>
                    <span style={{ color: "#FF6B35", fontSize: "12px" }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <p style={{ margin: 0, color: "#9090b0", fontSize: "13px", lineHeight: "1.5" }}>{r.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={review}
                onChange={(e) => setReview(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitReview()}
                placeholder={user ? "Write a review..." : "Sign in to review..."}
                disabled={!user}
                style={{
                  flex: 1, background: "#12121f", border: "1px solid #2a2a4a",
                  color: "#f0f0ff", padding: "10px 14px", borderRadius: "10px",
                  fontSize: "13px", fontFamily: "'DM Mono', monospace", outline: "none",
                  opacity: user ? 1 : 0.6,
                }}
              />
              <button onClick={submitReview} disabled={!user} style={{
                background: "#FF6B35", border: "none", color: "#fff",
                padding: "10px 16px", borderRadius: "10px", cursor: user ? "pointer" : "not-allowed",
                fontFamily: "'DM Mono', monospace", fontSize: "12px",
                opacity: user ? 1 : 0.5,
              }}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
