import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LogoSVG = ({ size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="alg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect x="8" y="20" width="40" height="55" rx="4" fill="url(#alg)" />
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

export default function AuthModal({ onClose, showToast, lang, t }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      showToast(t.fillAll);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const userData = {
      name: form.name || form.email.split("@")[0],
      email: form.email,
      id: Date.now().toString(),
    };
    mode === "login" ? login(userData) : signup(userData);
    showToast(
      `${mode === "signup" ? t.welcome : t.welcomeBack}, ${userData.name}! ✨`,
    );
    onClose();
    setLoading(false);
  };

  const inputStyle = {
    background: "#1a0f2e",
    border: "1px solid #3a2a5a",
    color: "#f5f0ff",
    padding: "14px 18px",
    borderRadius: "14px",
    fontSize: "15px",
    fontFamily: "'DM Mono', monospace",
    outline: "none",
    width: "100%",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000c0",
        zIndex: 1001,
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
          maxWidth: "420px",
          padding: "40px 36px",
          boxShadow: "0 40px 100px #a855f730",
          animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            background: "#ffffff15",
            border: "none",
            color: "#fff",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "22px",
          }}
        >
          <LogoSVG size={56} />
        </div>

        <h2
          style={{
            margin: "0 0 6px",
            color: "#f5f0ff",
            fontFamily: "'Cormorant Garamond', serif",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          {mode === "login" ? t.loginTitle : t.joinTitle}
        </h2>
        <p
          style={{
            margin: "0 0 28px",
            color: "#6050a0",
            fontFamily: "'DM Mono', monospace",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          {mode === "login" ? t.loginSub : t.signupSub}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={t.displayName}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder={t.email}
            style={inputStyle}
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            placeholder={t.password}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={inputStyle}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading
                ? "#3a2a5a"
                : "linear-gradient(135deg, #a855f7, #ec4899)",
              border: "none",
              color: "#fff",
              padding: "15px",
              borderRadius: "14px",
              cursor: loading ? "wait" : "pointer",
              fontSize: "15px",
              fontFamily: "'DM Mono', monospace",
              fontWeight: "700",
              letterSpacing: "0.5px",
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s",
            }}
          >
            {loading && (
              <span
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid #ffffff40",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {mode === "login" ? t.signIn : t.createAccount}
          </button>
        </div>

        <p
          style={{
            margin: "18px 0 0",
            color: "#5a4a7a",
            fontSize: "13px",
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {mode === "login" ? t.noAccount : t.hasAccount}{" "}
          <span
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{
              color: "#a855f7",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {mode === "login" ? t.signUp : t.signIn}
          </span>
        </p>
      </div>
    </div>
  );
}
