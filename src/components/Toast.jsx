export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: "28px", right: "28px", zIndex: 2000,
      background: "#1a1a2e", border: "1px solid #FF6B35",
      color: "#f0f0ff", padding: "12px 20px",
      borderRadius: "12px", fontSize: "13px",
      fontFamily: "'DM Mono', monospace",
      boxShadow: "0 8px 32px #FF6B3530",
      animation: "slideUp 0.3s ease",
      maxWidth: "320px",
    }}>{message}</div>
  );
}
