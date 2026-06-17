import { useState } from "react";
import { ChevronRight, Plus, Trash2, Shuffle } from "lucide-react";
import { COLORS, selStyle, addBtnStyle, shuffleBtnStyle } from "../theme.js";
import { SectionLabel } from "./Primitives.jsx";
import { labelOf } from "../algorithms/graph.js";

export function GraphEditor({ graph, setGraph, weighted, directed, nodeCount, setNodeCount, regen }) {
  const [newU, setNewU] = useState(0);
  const [newV, setNewV] = useState(1);
  const [newW, setNewW] = useState(1);

  function addEdge() {
    if (newU === newV) return;
    const exists = graph.edges.some(
      (e) => (e.u === newU && e.v === newV) || (!directed && e.u === newV && e.v === newU)
    );
    if (exists) return;
    const id = `e${Date.now()}`;
    setGraph({ ...graph, edges: [...graph.edges, { id, u: newU, v: newV, w: weighted ? newW : 1, directed }] });
  }

  function removeEdge(id) {
    setGraph({ ...graph, edges: graph.edges.filter((e) => e.id !== id) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <SectionLabel>Nodes</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range" min={3} max={10} value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            style={{ flex: 1, accentColor: COLORS.accent, cursor: "pointer" }}
          />
          <span style={{ fontFamily: "'Fira Code', monospace", color: COLORS.ink0, fontSize: 13, width: 20 }}>{nodeCount}</span>
        </div>
      </div>

      <div>
        <SectionLabel>Add edge</SectionLabel>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <select value={newU} onChange={(e) => setNewU(Number(e.target.value))} style={selStyle}>
            {graph.nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
          <ChevronRight size={14} color={COLORS.ink2} />
          <select value={newV} onChange={(e) => setNewV(Number(e.target.value))} style={selStyle}>
            {graph.nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
          </select>
          {weighted && (
            <input
              type="number" value={newW}
              onChange={(e) => setNewW(Number(e.target.value))}
              style={{ ...selStyle, width: 56 }} placeholder="w"
            />
          )}
          <button onClick={addEdge} style={addBtnStyle}><Plus size={14} /></button>
        </div>
      </div>

      <div>
        <SectionLabel>Edges ({graph.edges.length})</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 150, overflowY: "auto", paddingRight: 4 }}>
          {graph.edges.map((e) => (
            <div key={e.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: COLORS.bg2, border: `1px solid ${COLORS.line2}`, borderRadius: 7,
              padding: "5px 9px", fontFamily: "'Fira Code', monospace", fontSize: 12, color: COLORS.ink0,
            }}>
              <span>
                {labelOf(graph.nodes, e.u)} {directed ? "→" : "—"} {labelOf(graph.nodes, e.v)} {weighted ? `(${e.w})` : ""}
              </span>
              <button
                onClick={() => removeEdge(e.id)}
                style={{ background: "none", border: "none", color: COLORS.ink2, cursor: "pointer", display: "flex" }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={regen} style={shuffleBtnStyle}><Shuffle size={14} /> Randomize graph</button>
    </div>
  );
}
