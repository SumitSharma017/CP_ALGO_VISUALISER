import { COLORS } from "../theme.js";

export function IconBtn({ onClick, children, title, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 38, height: 38, borderRadius: 8,
        border: `1px solid ${active ? COLORS.accent : COLORS.line2}`,
        background: active ? "rgba(94,234,212,0.12)" : COLORS.bg2,
        color: disabled ? COLORS.ink2 : active ? COLORS.accent : COLORS.ink0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all .15s ease",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = COLORS.accent; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.borderColor = active ? COLORS.accent : COLORS.line2; }}
    >
      {children}
    </button>
  );
}

export function Pill({ children, color }) {
  return (
    <span style={{
      fontFamily: "'Fira Code', monospace", fontSize: 11, fontWeight: 600,
      padding: "3px 8px", borderRadius: 5, letterSpacing: 0.3,
      background: `${color}1a`, color, border: `1px solid ${color}40`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Fira Code', monospace", fontSize: 11, fontWeight: 600,
      color: COLORS.ink2, textTransform: "uppercase", letterSpacing: 1.2,
      marginBottom: 10,
    }}>{children}</div>
  );
}

export function Panel({ children, style }) {
  return (
    <div style={{
      background: COLORS.bg1, border: `1px solid ${COLORS.line}`, borderRadius: 12,
      padding: 16, ...style,
    }}>{children}</div>
  );
}

export function LegendDot({ color, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 9, height: 9, borderRadius: 5, background: color }} />
      <span style={{ fontSize: 11, color: COLORS.ink1, fontFamily: "'Fira Code', monospace" }}>{label}</span>
    </div>
  );
}
