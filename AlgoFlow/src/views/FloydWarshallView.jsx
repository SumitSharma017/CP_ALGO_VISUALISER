import { useState, useMemo, useEffect } from "react";
import { Shuffle } from "lucide-react";
import { COLORS, layoutStyle, shuffleBtnStyle, matHeadStyle, matCellStyle } from "../theme.js";
import { Panel, SectionLabel, Pill } from "../components/Primitives.jsx";
import { Transport, DescBar } from "../components/Transport.jsx";
import { GraphCanvas } from "../components/GraphCanvas.jsx";
import { usePlayback } from "../hooks/usePlayback.js";
import { genFloydWarshallFrames } from "../algorithms/floydWarshall.js";
import { defaultGraph, genCirclePositions, labelOf } from "../algorithms/graph.js";

export function FloydWarshallView() {
  const [graph, setGraph] = useState(() => defaultGraph(true, true, 560, 380));

  const frames = useMemo(() => {
    if (!graph.nodes.length) return [];
    return genFloydWarshallFrames(graph.nodes, graph.edges);
  }, [graph]);

  const pb = usePlayback(frames);
  useEffect(() => { pb.reset(); }, [graph]); // eslint-disable-line

  const f = pb.frame;
  const n = graph.nodes.length;

  function regen() {
    const pts = genCirclePositions(n, 560, 380);
    const nodes = pts.map((p, i) => ({ id: i, x: p.x, y: p.y, label: String.fromCharCode(65 + i) }));
    const edges = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && Math.random() < 0.35) {
          edges.push({ id: `e${i}-${j}`, u: i, v: j, w: Math.floor(Math.random() * 9) + 1, directed: true });
        }
      }
    }
    setGraph({ nodes, edges });
  }

  return (
    <div style={layoutStyle}>
      <Panel style={{ flex: "1 1 640px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <SectionLabel>Floyd-Warshall — all-pairs shortest paths</SectionLabel>
          <Pill color={COLORS.blue}>k = {f.k >= 0 ? labelOf(graph.nodes, f.k) : "—"}</Pill>
        </div>
        <GraphCanvas nodes={graph.nodes} edges={graph.edges} directed weighted vizState={{ current: f.k }} />
        <div style={{ marginTop: 14 }}>
          <DescBar text={f.desc || "Press play to relax all pairs through every intermediate node."} verdict={f.done ? "done" : "info"} />
        </div>
        <div style={{ marginTop: 14 }}><Transport pb={pb} /></div>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 320px", minWidth: 300 }}>
        <Panel>
          <SectionLabel>Distance matrix</SectionLabel>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontFamily: "'Fira Code', monospace", fontSize: 11.5 }}>
              <thead>
                <tr>
                  <th style={matHeadStyle}></th>
                  {graph.nodes.map((nd) => (
                    <th key={nd.id} style={{ ...matHeadStyle, color: nd.id === f.j ? COLORS.amber : COLORS.ink2 }}>
                      {nd.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(f.dist || []).map((row, i) => (
                  <tr key={i}>
                    <td style={{ ...matHeadStyle, color: i === f.i ? COLORS.amber : COLORS.ink2 }}>
                      {labelOf(graph.nodes, i)}
                    </td>
                    {row.map((val, j) => {
                      const isCell = i === f.i && j === f.j;
                      return (
                        <td key={j} style={{
                          ...matCellStyle,
                          background: isCell
                            ? (f.updated ? `${COLORS.rose}25` : `${COLORS.amber}20`)
                            : i === j ? `${COLORS.accent}10` : "transparent",
                          color: val === Infinity
                            ? COLORS.ink2
                            : isCell ? (f.updated ? COLORS.rose : COLORS.amber) : COLORS.ink0,
                          fontWeight: isCell ? 700 : 400,
                        }}>
                          {val === Infinity ? "∞" : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <SectionLabel>Graph size</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range" min={3} max={7} value={n}
              onChange={(e) => {
                const cnt = Number(e.target.value);
                const pts = genCirclePositions(cnt, 560, 380);
                const nodes = pts.map((p, i) => ({ id: i, x: p.x, y: p.y, label: String.fromCharCode(65 + i) }));
                const edges = graph.edges.filter((e2) => e2.u < cnt && e2.v < cnt);
                setGraph({ nodes, edges });
              }}
              style={{ flex: 1, accentColor: COLORS.accent, cursor: "pointer" }}
            />
            <span style={{ fontFamily: "'Fira Code', monospace", color: COLORS.ink0, fontSize: 13 }}>{n}</span>
          </div>
          <button onClick={regen} style={{ ...shuffleBtnStyle, marginTop: 12 }}>
            <Shuffle size={14} /> Randomize directed edges
          </button>
        </Panel>
      </div>
    </div>
  );
}
