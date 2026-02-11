import { useState, useEffect } from "react";
import { getPosterUrl, getMovieDetails } from "../services/tmdb";
import { getBookDetails, getBookCoverByOLID } from "../services/openLibrary";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";

const StarRating = ({ rating, max = 10 }) => {
  const norm = max === 10 ? (rating / 10) * 5 : rating;
  const full = Math.floor(norm);
  const half = norm % 1 >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: "2px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: "16px",
            color:
              s <= full
                ? "#a855f7"
                : s === full + 1 && half
                  ? "#a855f7"
                  : "#2a1a4a",
            opacity: s === full + 1 && half ? 0.5 : 1,
          }}
        >
          ★
        </span>
      ))}
      <span
        style={{
          fontSize: "13px",
          color: "#7060a0",
          marginLeft: "6px",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {typeof rating === "number" ? rating.toFixed(1) : rating}
      </span>
    </span>
  );
};

export default function Modal({
  item,
  onClose,
  onAuthRequired,
  showToast,
  lang,
  t,
}) {
  const { toggleFavorite, toggleList, isFavorite, isInList } = useFavorites();
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([
    {
      user: "kitap_sever",
      text:
        lang === "tr"
          ? "Harika bir yapıt, kesinlikle tavsiye ederim!"
          : "Absolutely fantastic, highly recommended!",
      rating: 5,
    },
    {
      user: "sinefil42",
      text:
        lang === "tr"
          ? "Türünün en iyilerinden biri."
          : "One of the best in its genre.",
      rating: 4,
    },
  ]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        if (item.type === "movie" && item.tmdbId)
          setDetails(await getMovieDetails(item.tmdbId));
        else if (item.type === "book" && item.olid)
          setDetails(await getBookDetails(item.olid));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [item]);

  const handleFavorite = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    toggleFavorite(item);
    showToast(isFavorite(item.id) ? t.removed : t.saved);
  };

  const handleList = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    toggleList(item);
    showToast(isInList(item.id) ? t.removedFromList : t.addedToList);
  };

  const submitReview = () => {
    if (!review.trim()) return;
    if (!user) {
      onAuthRequired();
      return;
    }
    setReviews((prev) => [
      { user: user.name, text: review, rating: 5 },
      ...prev,
    ]);
    setReview("");
    showToast(t.reviewPosted);
  };

  const posterUrl =
    item.type === "movie"
      ? item.posterPath
        ? getPosterUrl(item.posterPath, "w500")
        : null
      : item.coverUrl ||
        (item.coverId ? getBookCoverByOLID(item.coverId, "L") : null);

  const description =
    item.type === "movie"
      ? details?.overview ||
        item.summary ||
        (lang === "tr" ? "Açıklama bulunamadı." : "No description available.")
      : typeof details?.description === "string"
        ? details.description
        : details?.description?.value ||
          item.summary ||
          (lang === "tr"
            ? "Açıklama bulunamadı."
            : "No description available.");

  const cast = item.type === "movie" && details?.credits?.cast?.slice(0, 6);
  const director =
    item.type === "movie"
      ? details?.credits?.crew?.find((c) => c.job === "Director")?.name ||
        item.director
      : null;
  const genreNames =
    item.type === "movie" && details?.genres
      ? details.genres.map((g) => g.name).join(", ")
      : item.genre;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000c0",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#110e1a",
          border: "1px solid #3a2a5a",
          borderRadius: "26px",
          width: "100%",
          maxWidth: "720px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 40px 120px #7c3aed40",
          animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Hero image */}
        <div
          style={{
            height: "280px",
            position: "relative",
            overflow: "hidden",
            background: posterUrl
              ? "#000"
              : "linear-gradient(135deg, #1a0f2e, #0c0a14)",
            borderRadius: "26px 26px 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.55,
              }}
            />
          ) : (
            <div style={{ fontSize: "100px", opacity: 0.08 }}>◈</div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 30%, #110e1a 100%)",
            }}
          />

          {posterUrl && (
            <div
              style={{
                position: "absolute",
                bottom: "-44px",
                left: "32px",
                width: "96px",
                height: "144px",
                borderRadius: "12px",
                overflow: "hidden",
                border: "2px solid #3a2a5a",
                boxShadow: "0 8px 24px #000",
              }}
            >
              <img
                src={posterUrl}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              background: "#000000aa",
              backdropFilter: "blur(4px)",
              border: "1px solid #3a2a5a",
              color: "#f5f0ff",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "17px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: `${posterUrl ? "56px" : "26px"} 32px 32px` }}>
          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                background: item.type === "movie" ? "#a855f7" : "#10b981",
                color: "#fff",
                fontSize: "11px",
                fontFamily: "'DM Mono', monospace",
                padding: "4px 12px",
                borderRadius: "22px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "700",
              }}
            >
              {item.type === "movie"
                ? lang === "tr"
                  ? "Film"
                  : "Movie"
                : lang === "tr"
                  ? "Kitap"
                  : "Book"}
            </span>
            {genreNames && (
              <span
                style={{
                  background: "#1a0f2e",
                  color: "#7060a0",
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                  padding: "4px 12px",
                  borderRadius: "22px",
                }}
              >
                {genreNames}
              </span>
            )}
            {item.language && item.language !== "Unknown" && (
              <span
                style={{
                  background: "#1a0f2e",
                  color: "#7060a0",
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                  padding: "4px 12px",
                  borderRadius: "22px",
                }}
              >
                {item.language}
              </span>
            )}
            {item.year && (
              <span
                style={{
                  background: "#1a0f2e",
                  color: "#7060a0",
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                  padding: "4px 12px",
                  borderRadius: "22px",
                }}
              >
                {item.year}
              </span>
            )}
            {item.pages && (
              <span
                style={{
                  background: "#1a0f2e",
                  color: "#7060a0",
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                  padding: "4px 12px",
                  borderRadius: "22px",
                }}
              >
                {item.pages} {t.pages}
              </span>
            )}
            {details?.runtime && (
              <span
                style={{
                  background: "#1a0f2e",
                  color: "#7060a0",
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                  padding: "4px 12px",
                  borderRadius: "22px",
                }}
              >
                {details.runtime} {t.min}
              </span>
            )}
          </div>

          <h2
            style={{
              margin: "0 0 8px",
              color: "#f5f0ff",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "30px",
              lineHeight: "1.2",
            }}
          >
            {item.title}
          </h2>

          <p
            style={{
              margin: "0 0 12px",
              color: "#a855f7",
              fontFamily: "'DM Mono', monospace",
              fontSize: "14px",
            }}
          >
            {item.type === "book"
              ? `${t.by} ${item.author || "?"}`
              : `${t.director}: ${director || item.director || "?"}`}
          </p>

          {item.rating && (
            <div style={{ marginBottom: "18px" }}>
              <StarRating
                rating={item.rating}
                max={item.type === "movie" ? 10 : 5}
              />
            </div>
          )}

          {/* Cast */}
          {cast?.length > 0 && (
            <div style={{ marginBottom: "18px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#5a4a7a",
                  fontSize: "12px",
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                {t.cast}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {cast.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      background: "#1a0f2e",
                      border: "1px solid #2a1a4a",
                      borderRadius: "10px",
                      padding: "7px 12px",
                    }}
                  >
                    {c.profile_path && (
                      <img
                        src={getPosterUrl(c.profile_path, "w45")}
                        alt={c.name}
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div>
                      <p
                        style={{
                          margin: 0,
                          color: "#d0c0f0",
                          fontSize: "12px",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {c.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "#5a4a7a",
                          fontSize: "11px",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {c.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synopsis */}
          <div style={{ marginBottom: "18px" }}>
            <p
              style={{
                margin: "0 0 8px",
                color: "#5a4a7a",
                fontSize: "12px",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {t.synopsis}
            </p>
            {loading ? (
              <div
                style={{
                  height: "70px",
                  background: "#1a0f2e",
                  borderRadius: "10px",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            ) : (
              <p
                style={{
                  margin: 0,
                  color: "#c0b0e0",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "7px",
                flexWrap: "wrap",
                marginBottom: "22px",
              }}
            >
              {item.tags.slice(0, 6).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "12px",
                    color: "#6a5a8a",
                    border: "1px solid #2a1a4a",
                    borderRadius: "8px",
                    padding: "4px 12px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleFavorite}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "13px 18px",
                background: isFavorite(item.id) ? "#a855f7" : "transparent",
                border: `1px solid ${isFavorite(item.id) ? "#a855f7" : "#3a2a5a"}`,
                color: isFavorite(item.id) ? "#fff" : "#a0a0c0",
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isFavorite(item.id) ? t.favoritedBtn : t.favoriteBtn}
            </button>
            <button
              onClick={handleList}
              style={{
                flex: 1,
                minWidth: "140px",
                padding: "13px 18px",
                background: isInList(item.id) ? "#10b98120" : "transparent",
                border: `1px solid ${isInList(item.id) ? "#10b981" : "#3a2a5a"}`,
                color: isInList(item.id) ? "#10b981" : "#a0a0c0",
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "14px",
                fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isInList(item.id) ? t.listedBtn : t.listBtn}
            </button>
          </div>

          {/* Reviews */}
          <div style={{ borderTop: "1px solid #1e1530", paddingTop: "22px" }}>
            <p
              style={{
                margin: "0 0 14px",
                color: "#5a4a7a",
                fontSize: "12px",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {t.communityReviews}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              {reviews.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "#1a0f2e",
                    border: "1px solid #2a1a4a",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "#a855f7",
                        fontSize: "13px",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      @{r.user}
                    </span>
                    <span style={{ color: "#a855f7", fontSize: "13px" }}>
                      {"★".repeat(r.rating)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#9080b0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={review}
                onChange={(e) => setReview(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitReview()}
                placeholder={user ? t.writeReview : t.signInToReview}
                disabled={!user}
                style={{
                  flex: 1,
                  background: "#1a0f2e",
                  border: "1px solid #2a1a4a",
                  color: "#f5f0ff",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontFamily: "'DM Mono', monospace",
                  outline: "none",
                  opacity: user ? 1 : 0.6,
                }}
              />
              <button
                onClick={submitReview}
                disabled={!user}
                style={{
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  border: "none",
                  color: "#fff",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  cursor: user ? "pointer" : "not-allowed",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "13px",
                  fontWeight: "700",
                  opacity: user ? 1 : 0.5,
                }}
              >
                {t.postReview}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
