import { COLORS } from "../theme.js";

export function GraphCanvas({ nodes, edges, directed, weighted, vizState, width = 640, height = 420, distLabel }) {
  const { visited = new Set(), current, activeEdge, relaxed } = vizState || {};

  function edgeColor(e) {
    return e.id === activeEdge ? COLORS.amber : COLORS.line2;
  }
  function edgeWidth(e) {
    return e.id === activeEdge ? 3.5 : 1.8;
  }
  function nodeColor(n) {
    if (n.id === current) return COLORS.amber;
    if (n.id === relaxed) return COLORS.rose;
    if (visited.has?.(n.id)) return COLORS.accent;
    return COLORS.bg3;
  }
  function nodeTextColor(n) {
    if (n.id === current || visited.has?.(n.id) || n.id === relaxed) return "#0b0e14";
    return COLORS.ink1;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: "block" }}>
      <defs>
        <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0 L9,3.5 L0,7 Z" fill={COLORS.line2} />
        </marker>
        <marker id="arrowActive" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
          <path d="M0,0 L9,3.5 L0,7 Z" fill={COLORS.amber} />
        </marker>
      </defs>
      {edges.map((e) => {
        const u = nodes.find((n) => n.id === e.u);
        const v = nodes.find((n) => n.id === e.v);
        if (!u || !v) return null;
        const dx = v.x - u.x, dy = v.y - u.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / len, uy = dy / len;
        const R = 22;
        const x1 = u.x + ux * R, y1 = u.y + uy * R;
        const x2 = v.x - ux * R, y2 = v.y - uy * R;
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const isActive = e.id === activeEdge;
        return (
          <g key={e.id}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={edgeColor(e)} strokeWidth={edgeWidth(e)}
              markerEnd={directed ? (isActive ? "url(#arrowActive)" : "url(#arrow)") : undefined}
              style={{ transition: "stroke .25s ease" }}
            />
            {weighted && (
              <g>
                <rect x={mx - 12} y={my - 10} width={24} height={16} rx={4} fill={COLORS.bg0} opacity={0.92} />
                <text x={mx} y={my + 2} textAnchor="middle" fontSize={11} fontFamily="'Fira Code', monospace"
                  fill={isActive ? COLORS.amber : e.w < 0 ? COLORS.rose : COLORS.ink1} fontWeight={600}>
                  {e.w}
                </text>
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n) => (
        <g key={n.id} style={{ transition: "all .2s ease" }}>
          <circle
            cx={n.x} cy={n.y} r={22}
            fill={nodeColor(n)}
            stroke={n.id === current ? COLORS.amber : COLORS.line2}
            strokeWidth={n.id === current ? 3 : 1.5}
            style={{ transition: "fill .25s ease, stroke .25s ease" }}
          />
          {n.id === current && (
            <circle cx={n.x} cy={n.y} r={28} fill="none" stroke={COLORS.amber} strokeWidth={1.2} opacity={0.5} />
          )}
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={14} fontWeight={700}
            fontFamily="'Fira Code', monospace" fill={nodeTextColor(n)}>
            {n.label}
          </text>
          {distLabel && distLabel[n.id] !== undefined && (
            <text x={n.x} y={n.y - 32} textAnchor="middle" fontSize={12}
              fontFamily="'Fira Code', monospace" fontWeight={600}
              fill={distLabel[n.id] === Infinity ? COLORS.ink2 : COLORS.blue}>
              {distLabel[n.id] === Infinity ? "∞" : distLabel[n.id]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
