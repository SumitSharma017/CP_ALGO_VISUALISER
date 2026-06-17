import { useState, useMemo, useEffect, useCallback } from "react";
import { Shuffle } from "lucide-react";
import { COLORS, selStyle, layoutStyle, thStyle, tdStyle, shuffleBtnStyle } from "../theme.js";
import { Panel, SectionLabel, Pill, LegendDot } from "../components/Primitives.jsx";
import { Transport, DescBar } from "../components/Transport.jsx";
import { GraphCanvas } from "../components/GraphCanvas.jsx";
import { usePlayback } from "../hooks/usePlayback.js";
import { genBellmanFordFrames } from "../algorithms/bellmanFord.js";
import { negativeGraph, labelOf } from "../algorithms/graph.js";

export function BellmanFordView() {
  const [graph, setGraph] = useState(() => negativeGraph());
  const [start, setStart] = useState(0);
  const safeStart = Math.min(start, graph.nodes.length - 1);

  const regen = useCallback(() => { setGraph(negativeGraph()); }, []);

  const frames = useMemo(() => {
    if (!graph.nodes.length) return [];
    return genBellmanFordFrames(graph.nodes, graph.edges, safeStart);
  }, [graph, safeStart]);

  const pb = usePlayback(frames);
  useEffect(() => { pb.reset(); }, [graph, safeStart]); // eslint-disable-line

  const f = pb.frame;

  return (
    <div style={layoutStyle}>
      <Panel style={{ flex: "1 1 640px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <SectionLabel>Bellman-Ford Algorithm — visualisation</SectionLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <LegendDot color={COLORS.amber} label="current" />
            <LegendDot color={COLORS.rose} label="relaxed" />
          </div>
        </div>
        <GraphCanvas nodes={graph.nodes} edges={graph.edges} directed weighted vizState={f} distLabel={f.dist} />
        <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <Pill color={f.negCycle ? COLORS.rose : COLORS.blue}>
            PASS {f.pass ?? 0}/{f.totalPasses ?? 0}
          </Pill>
          {f.negCycle && <Pill color={COLORS.rose}>NEGATIVE CYCLE</Pill>}
        </div>
        <div style={{ marginTop: 14 }}>
          <DescBar
            text={f.desc || "Negative edge weights are allowed here. Press play."}
            verdict={f.negCycle ? "warn" : f.done ? "done" : "info"}
          />
        </div>
        <div style={{ marginTop: 14 }}><Transport pb={pb} /></div>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 300px", minWidth: 280 }}>
        <Panel>
          <SectionLabel>Source node</SectionLabel>
          <select
            value={safeStart}
            onChange={(e) => setStart(Number(e.target.value))}
            style={{ ...selStyle, width: "100%", padding: "8px 10px" }}
          >
            {graph.nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </Panel>

        <Panel>
          <SectionLabel>Distance table</SectionLabel>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Fira Code', monospace", fontSize: 12.5 }}>
            <thead><tr><th style={thStyle}>Node</th><th style={thStyle}>Dist</th></tr></thead>
            <tbody>
              {graph.nodes.map((n) => {
                const d = f.dist ? f.dist[n.id] : Infinity;
                return (
                  <tr key={n.id} style={{ background: n.id === f.current ? `${COLORS.amber}14` : "transparent" }}>
                    <td style={tdStyle}>{n.label}</td>
                    <td style={{ ...tdStyle, color: d === Infinity ? COLORS.ink2 : COLORS.blue }}>
                      {d === Infinity ? "∞" : d}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <SectionLabel>Edge list (directed, neg weights allowed)</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 160, overflowY: "auto" }}>
            {graph.edges.map((e) => (
              <div key={e.id} style={{
                display: "flex", justifyContent: "space-between",
                fontFamily: "'Fira Code', monospace", fontSize: 12,
                padding: "5px 9px", borderRadius: 7,
                background: e.id === f.activeEdge ? `${COLORS.amber}18` : COLORS.bg2,
                border: `1px solid ${e.id === f.activeEdge ? COLORS.amber : COLORS.line2}60`,
                color: e.w < 0 ? COLORS.rose : COLORS.ink0,
              }}>
                <span>{labelOf(graph.nodes, e.u)} → {labelOf(graph.nodes, e.v)}</span>
                <span>{e.w}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionLabel>Graph</SectionLabel>
          <button onClick={regen} style={shuffleBtnStyle}>
            <Shuffle size={14} /> New random graph (with negatives)
          </button>
          <div style={{ fontSize: 11.5, color: COLORS.ink2, marginTop: 10, lineHeight: 1.5 }}>
            Bellman-Ford tolerates negative edge weights and can detect negative-weight cycles, which is why this graph includes a few.
          </div>
        </Panel>
      </div>
    </div>
  );
}
