export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 2000,
        background: "#1a0f2e",
        border: "1px solid #a855f7",
        color: "#f5f0ff",
        padding: "14px 22px",
        borderRadius: "14px",
        fontSize: "14px",
        fontFamily: "'DM Mono', monospace",
        boxShadow: "0 8px 32px #a855f740",
        animation: "slideUp 0.3s ease",
        maxWidth: "340px",
      }}
    >
      {message}
    </div>
  );
}
