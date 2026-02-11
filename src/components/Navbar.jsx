import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

const LogoSVG = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="nlg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect x="8" y="20" width="40" height="55" rx="4" fill="url(#nlg)" />
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
);

export default function Navbar({
  activeTab,
  setActiveTab,
  onAuthClick,
  lang,
  setLang,
  t,
}) {
  const { user, logout } = useAuth();
  const { favorites, myList } = useFavorites();

  const tabs = [
    { id: "discover", label: t.discover },
    { id: "trending", label: t.trending },
    ...(user
      ? [
          { id: "favorites", label: `♥ ${favorites.length}` },
          { id: "mylist", label: `☰ ${myList.length}` },
        ]
      : []),
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "#0c0a1490",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #2a1a4a",
        padding: "0 28px",
        height: "66px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        onClick={() => setActiveTab("discover")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <LogoSVG size={36} />
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "22px",
            fontWeight: "700",
            color: "#f5f0ff",
          }}
        >
          Book<span style={{ color: "#a855f7" }}>n</span>Movie
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "4px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? "#a855f720" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "#a855f740" : "transparent"}`,
              color: activeTab === tab.id ? "#a855f7" : "#7060a0",
              padding: "7px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}

        <button
          onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          style={{
            background: "#1a0f2e",
            border: "1px solid #3a2a5a",
            color: "#a855f7",
            padding: "7px 14px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "'DM Mono', monospace",
            fontWeight: "600",
            transition: "all 0.2s",
            marginLeft: "4px",
          }}
        >
          {lang === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}
        </button>

        {user ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "8px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "700",
                color: "#fff",
              }}
            >
              {user.name[0].toUpperCase()}
            </div>
            <button
              onClick={logout}
              style={{
                background: "transparent",
                border: "none",
                color: "#5a4a7a",
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {t.signOut}
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthClick}
            style={{
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              border: "none",
              color: "#fff",
              padding: "9px 20px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "'DM Mono', monospace",
              fontWeight: "700",
              marginLeft: "4px",
            }}
          >
            {t.signIn}
          </button>
        )}
      </div>
    </nav>
  );
}
