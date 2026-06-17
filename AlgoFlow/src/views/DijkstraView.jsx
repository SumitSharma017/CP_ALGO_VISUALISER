import { useState, useMemo, useEffect } from "react";
import { COLORS, selStyle, layoutStyle, thStyle, tdStyle } from "../theme.js";
import { Panel, SectionLabel, Pill, LegendDot } from "../components/Primitives.jsx";
import { Transport, DescBar } from "../components/Transport.jsx";
import { GraphCanvas } from "../components/GraphCanvas.jsx";
import { GraphEditor } from "../components/GraphEditor.jsx";
import { usePlayback } from "../hooks/usePlayback.js";
import { useGraphState } from "../hooks/useGraphState.js";
import { genDijkstraFrames } from "../algorithms/dijkstra.js";
import { labelOf } from "../algorithms/graph.js";

export function DijkstraView() {
  const { graph, setGraph, nodeCount, setNodeCount, regen } = useGraphState(true, false);
  const [start, setStart] = useState(0);
  const safeStart = Math.min(start, graph.nodes.length - 1);

  const frames = useMemo(() => {
    if (!graph.nodes.length) return [];
    return genDijkstraFrames(graph.nodes, graph.edges, safeStart);
  }, [graph, safeStart]);

  const pb = usePlayback(frames);
  useEffect(() => { pb.reset(); }, [graph, safeStart]); // eslint-disable-line

  const f = pb.frame;

  return (
    <div style={layoutStyle}>
      <Panel style={{ flex: "1 1 640px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionLabel>Dijkstra's Algorithm — visualisation</SectionLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <LegendDot color={COLORS.amber} label="current" />
            <LegendDot color={COLORS.rose} label="relaxed" />
            <LegendDot color={COLORS.accent} label="finalized" />
          </div>
        </div>
        <GraphCanvas nodes={graph.nodes} edges={graph.edges} directed={false} weighted vizState={f} distLabel={f.dist} />
        <div style={{ marginTop: 14 }}>
          <DescBar text={f.desc || "Configure a graph and press play."} verdict={f.done ? "done" : "info"} />
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
            <thead>
              <tr>
                <th style={thStyle}>Node</th>
                <th style={thStyle}>Dist</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {graph.nodes.map((n) => {
                const d = f.dist ? f.dist[n.id] : Infinity;
                const isVisited = f.visited?.has?.(n.id);
                return (
                  <tr key={n.id} style={{ background: n.id === f.current ? `${COLORS.amber}14` : "transparent" }}>
                    <td style={tdStyle}>{n.label}</td>
                    <td style={{ ...tdStyle, color: d === Infinity ? COLORS.ink2 : COLORS.blue }}>
                      {d === Infinity ? "∞" : d}
                    </td>
                    <td style={tdStyle}>
                      <Pill color={isVisited ? COLORS.accent : COLORS.ink2}>{isVisited ? "FINAL" : "OPEN"}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <SectionLabel>Priority queue (unvisited)</SectionLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 30 }}>
            {(f.pq || []).map((id) => (
              <span key={id} style={{
                fontFamily: "'Fira Code', monospace", fontSize: 12, fontWeight: 600,
                padding: "4px 9px", borderRadius: 7,
                background: `${COLORS.violet}18`, border: `1px solid ${COLORS.violet}50`, color: COLORS.violet,
              }}>
                {labelOf(graph.nodes, id)}:{f.dist?.[id] === Infinity ? "∞" : f.dist?.[id]}
              </span>
            ))}
            {(!f.pq || f.pq.length === 0) && <span style={{ color: COLORS.ink2, fontSize: 12.5 }}>empty</span>}
          </div>
        </Panel>

        <Panel>
          <SectionLabel>Graph editor</SectionLabel>
          <GraphEditor
            graph={graph} setGraph={setGraph}
            weighted directed={false}
            nodeCount={nodeCount} setNodeCount={setNodeCount}
            regen={regen}
          />
        </Panel>
      </div>
    </div>
  );
}
