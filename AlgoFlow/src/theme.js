export const COLORS = {
  bg0: "#000000",
  bg1: "#131518",
  bg2: "#161b26",
  bg3: "#1c2230",
  line: "#232938",
  line2: "#2c3344",
  ink0: "#e8ecf4",
  ink1: "#8b95ab",
  ink2: "#545d72",
  accent: "#5eead4",
  accentDim: "#2dd4bf",
  amber: "#ffb454",
  violet: "#a78bfa",
  rose: "#fb7185",
  blue: "#60a5fa",
};

export const selStyle = {
  background: COLORS.bg2,
  border: `1px solid ${COLORS.line2}`,
  borderRadius: 6,
  color: COLORS.ink0,
  padding: "5px 6px",
  fontSize: 12,
  fontFamily: "'Fira Code', monospace",
};

export const addBtnStyle = {
  background: COLORS.accent,
  border: "none",
  borderRadius: 6,
  color: "#0b0e14",
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

export const shuffleBtnStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
  background: COLORS.bg2,
  border: `1px solid ${COLORS.line2}`,
  borderRadius: 8,
  color: COLORS.ink0,
  padding: "8px 12px",
  fontSize: 12.5,
  cursor: "pointer",
  fontWeight: 600,
};

export const layoutStyle = {
  display: "flex",
  gap: 18,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

export const thStyle = {
  textAlign: "left",
  color: COLORS.ink2,
  fontWeight: 600,
  padding: "4px 6px",
  borderBottom: `1px solid ${COLORS.line2}`,
  fontSize: 11,
};

export const tdStyle = {
  padding: "5px 6px",
  color: COLORS.ink0,
  borderBottom: `1px solid ${COLORS.line}`,
};

export const matHeadStyle = {
  padding: "4px 8px",
  fontWeight: 700,
  borderBottom: `1px solid ${COLORS.line2}`,
  textAlign: "center",
};

export const matCellStyle = {
  padding: "5px 8px",
  textAlign: "center",
  borderRadius: 4,
  transition: "all .2s ease",
};

export function toggleBtnStyle(active) {
  return {
    flex: 1,
    padding: "7px 10px",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${active ? COLORS.accent : COLORS.line2}`,
    background: active ? `${COLORS.accent}18` : COLORS.bg2,
    color: active ? COLORS.accent : COLORS.ink1,
  };
}
