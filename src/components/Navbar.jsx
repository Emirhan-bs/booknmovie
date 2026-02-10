import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

const LogoSVG = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="nlg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="100%" stopColor="#F7C59F" />
      </linearGradient>
    </defs>
    <rect x="8" y="20" width="40" height="55" rx="4" fill="url(#nlg)" />
    <rect
      x="12"
      y="24"
      width="32"
      height="47"
      rx="2"
      fill="#FFF5ED"
      fillOpacity="0.9"
    />
    <rect x="8" y="20" width="6" height="55" rx="2" fill="#E55A2B" />
    <line
      x1="18"
      y1="34"
      x2="40"
      y2="34"
      stroke="#FF6B35"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="18"
      y1="41"
      x2="40"
      y2="41"
      stroke="#FF6B35"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="68"
      cy="42"
      r="24"
      fill="#1A1A2E"
      stroke="#FF6B35"
      strokeWidth="2"
    />
    <circle cx="68" cy="42" r="3" fill="#FF6B35" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <circle
        key={i}
        cx={68 + 16 * Math.cos((deg * Math.PI) / 180)}
        cy={42 + 16 * Math.sin((deg * Math.PI) / 180)}
        r="3"
        fill="#FF6B35"
        fillOpacity="0.6"
      />
    ))}
    <polygon points="62,36 62,48 74,42" fill="#FF6B35" />
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
        background: "#08081390",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e1e32",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo */}
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
        <LogoSVG size={34} />
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: "700",
            color: "#f0f0ff",
          }}
        >
          Book<span style={{ color: "#FF6B35" }}>n</span>Movie
        </span>
      </div>

      {/* Tabs + actions */}
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
              background: activeTab === tab.id ? "#FF6B3520" : "transparent",
              border: `1px solid ${activeTab === tab.id ? "#FF6B3540" : "transparent"}`,
              color: activeTab === tab.id ? "#FF6B35" : "#7070a0",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "tr" ? "en" : "tr")}
          style={{
            background: "#1e1e32",
            border: "1px solid #2a2a4a",
            color: "#FF6B35",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "12px",
            fontFamily: "'DM Mono', monospace",
            fontWeight: "700",
            transition: "all 0.2s",
            marginLeft: "4px",
          }}
        >
          {lang === "tr" ? "🇬🇧 EN" : "🇹🇷 TR"}
        </button>

        {/* Auth */}
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
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B35, #E55A2B)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
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
                color: "#5050a0",
                cursor: "pointer",
                fontSize: "12px",
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
              background: "linear-gradient(135deg, #FF6B35, #E55A2B)",
              border: "none",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "13px",
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
