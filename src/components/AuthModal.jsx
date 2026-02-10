import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LogoSVG = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35" /><stop offset="100%" stopColor="#F7C59F" />
      </linearGradient>
    </defs>
    <rect x="8" y="20" width="40" height="55" rx="4" fill="url(#alg)" />
    <rect x="12" y="24" width="32" height="47" rx="2" fill="#FFF5ED" fillOpacity="0.9" />
    <rect x="8" y="20" width="6" height="55" rx="2" fill="#E55A2B" />
    <line x1="18" y1="34" x2="40" y2="34" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    <line x1="18" y1="41" x2="40" y2="41" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
    <circle cx="68" cy="42" r="24" fill="#1A1A2E" stroke="#FF6B35" strokeWidth="2" />
    <circle cx="68" cy="42" r="3" fill="#FF6B35" />
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <circle key={i} cx={68 + 16 * Math.cos((deg * Math.PI) / 180)} cy={42 + 16 * Math.sin((deg * Math.PI) / 180)} r="3" fill="#FF6B35" fillOpacity="0.6" />
    ))}
    <polygon points="62,36 62,48 74,42" fill="#FF6B35" />
  </svg>
);

export default function AuthModal({ onClose, showToast }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { showToast("Please fill in all fields"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate auth
    const userData = {
      name: form.name || form.email.split("@")[0],
      email: form.email,
      id: Date.now().toString(),
    };
    mode === "login" ? login(userData) : signup(userData);
    showToast(`Welcome${mode === "signup" ? " to BooknMovie" : " back"}, ${userData.name}! ✨`);
    onClose();
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "#000000b0", zIndex: 1001,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", backdropFilter: "blur(10px)", animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#0f0f1e", border: "1px solid #2a2a4a",
        borderRadius: "24px", width: "100%", maxWidth: "400px",
        padding: "36px 32px",
        boxShadow: "0 40px 100px #FF6B3520",
        animation: "slideUp 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "#ffffff15", border: "none", color: "#fff",
          width: "32px", height: "32px", borderRadius: "50%",
          cursor: "pointer", fontSize: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <LogoSVG size={52} />
        </div>

        <h2 style={{ margin: "0 0 4px", color: "#f0f0ff", fontFamily: "'Playfair Display', serif", textAlign: "center", fontSize: "24px" }}>
          {mode === "login" ? "Welcome Back" : "Join BooknMovie"}
        </h2>
        <p style={{ margin: "0 0 24px", color: "#5050a0", fontFamily: "'DM Mono', monospace", fontSize: "12px", textAlign: "center" }}>
          {mode === "login" ? "Sign in to your account" : "Create your free account"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "signup" && (
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Display name"
              style={{ background: "#12121f", border: "1px solid #2a2a4a", color: "#f0f0ff", padding: "13px 16px", borderRadius: "12px", fontSize: "14px", fontFamily: "'DM Mono', monospace", outline: "none" }}
            />
          )}
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email address"
            style={{ background: "#12121f", border: "1px solid #2a2a4a", color: "#f0f0ff", padding: "13px 16px", borderRadius: "12px", fontSize: "14px", fontFamily: "'DM Mono', monospace", outline: "none" }}
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            placeholder="Password"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{ background: "#12121f", border: "1px solid #2a2a4a", color: "#f0f0ff", padding: "13px 16px", borderRadius: "12px", fontSize: "14px", fontFamily: "'DM Mono', monospace", outline: "none" }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? "#3a3a5a" : "linear-gradient(135deg, #FF6B35, #E55A2B)",
              border: "none", color: "#fff", padding: "14px",
              borderRadius: "12px", cursor: loading ? "wait" : "pointer",
              fontSize: "14px", fontFamily: "'DM Mono', monospace", fontWeight: "700",
              letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.2s",
            }}>
            {loading && <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #ffffff40", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p style={{ margin: "16px 0 0", color: "#5050a0", fontSize: "12px", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
          {mode === "login" ? "No account? " : "Have an account? "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: "#FF6B35", cursor: "pointer", textDecoration: "underline" }}>
            {mode === "login" ? "Sign up free" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}
