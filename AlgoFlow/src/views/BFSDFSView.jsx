import { useState, useMemo, useEffect } from "react";
import { COLORS, selStyle, layoutStyle } from "../theme.js";
import { Panel, SectionLabel, LegendDot } from "../components/Primitives.jsx";
import { Transport, DescBar } from "../components/Transport.jsx";
import { GraphCanvas } from "../components/GraphCanvas.jsx";
import { GraphEditor } from "../components/GraphEditor.jsx";
import { usePlayback } from "../hooks/usePlayback.js";
import { useGraphState } from "../hooks/useGraphState.js";
import { genBFSFrames } from "../algorithms/bfs.js";
import { genDFSFrames } from "../algorithms/dfs.js";
import { labelOf } from "../algorithms/graph.js";

export function BFSDFSView({ mode }) {
  const { graph, setGraph, nodeCount, setNodeCount, regen } = useGraphState(false, false);
  const [start, setStart] = useState(0);
  const safeStart = Math.min(start, graph.nodes.length - 1);

  const frames = useMemo(() => {
    if (!graph.nodes.length) return [];
    return mode === "bfs"
      ? genBFSFrames(graph.nodes, graph.edges, safeStart)
      : genDFSFrames(graph.nodes, graph.edges, safeStart);
  }, [graph, safeStart, mode]);

  const pb = usePlayback(frames);
  useEffect(() => { pb.reset(); }, [graph, safeStart, mode]); // eslint-disable-line

  const f = pb.frame;
  const structureLabel = mode === "bfs" ? "Queue" : "Stack";
  const structureItems = mode === "bfs" ? (f.queue || []) : (f.stack || []);

  return (
    <div style={layoutStyle}>
      <Panel style={{ flex: "1 1 640px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <SectionLabel>{mode === "bfs" ? "Breadth-First Search" : "Depth-First Search"} — visualisation</SectionLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <LegendDot color={COLORS.amber} label="current" />
            <LegendDot color={COLORS.accent} label="visited" />
            <LegendDot color={COLORS.bg3} label="unvisited" />
          </div>
        </div>
        <GraphCanvas nodes={graph.nodes} edges={graph.edges} directed={false} weighted={false} vizState={f} />
        <div style={{ marginTop: 14 }}>
          <DescBar text={f.desc || "Configure a graph and press play."} verdict={f.done ? "done" : "info"} />
        </div>
        <div style={{ marginTop: 14 }}>
          <Transport pb={pb} />
        </div>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 300px", minWidth: 280 }}>
        <Panel>
          <SectionLabel>Start node</SectionLabel>
          <select
            value={safeStart}
            onChange={(e) => setStart(Number(e.target.value))}
            style={{ ...selStyle, width: "100%", padding: "8px 10px" }}
          >
            {graph.nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
        </Panel>

        <Panel>
          <SectionLabel>{structureLabel} state</SectionLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 36 }}>
            {structureItems.length === 0 && <span style={{ color: COLORS.ink2, fontSize: 12.5 }}>empty</span>}
            {structureItems.map((id, i) => (
              <span key={i} style={{
                fontFamily: "'Fira Code', monospace", fontSize: 13, fontWeight: 700,
                width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 7,
                background: i === 0 && mode === "bfs" ? `${COLORS.blue}25` : `${COLORS.violet}20`,
                border: `1px solid ${i === 0 && mode === "bfs" ? COLORS.blue : COLORS.violet}60`,
                color: i === 0 && mode === "bfs" ? COLORS.blue : COLORS.violet,
              }}>
                {labelOf(graph.nodes, id)}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: COLORS.ink2, marginTop: 6 }}>
            {mode === "bfs" ? "front → back, dequeued from left" : "bottom → top, popped from right"}
          </div>
        </Panel>

        <Panel>
          <SectionLabel>Visit order</SectionLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 30, fontFamily: "'Fira Code', monospace", fontSize: 12.5, color: COLORS.accent }}>
            {(f.order || []).map((id, i) => (
              <span key={i}>{labelOf(graph.nodes, id)}{i < (f.order.length - 1) ? " →" : ""}</span>
            ))}
            {(!f.order || f.order.length === 0) && <span style={{ color: COLORS.ink2 }}>—</span>}
          </div>
        </Panel>

        <Panel>
          <SectionLabel>Graph editor</SectionLabel>
          <GraphEditor
            graph={graph} setGraph={setGraph}
            weighted={false} directed={false}
            nodeCount={nodeCount} setNodeCount={setNodeCount}
            regen={regen}
          />
        </Panel>
      </div>
    </div>
  );
}
