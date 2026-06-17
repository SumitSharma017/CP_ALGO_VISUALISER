import { useState, useMemo } from "react";
import { Network, GitBranch, Workflow, Grid3x3, ListTree } from "lucide-react";
import { COLORS } from "./theme.js";
import { useFonts } from "./hooks/useFonts.js";
import { BFSDFSView } from "./views/BFSDFSView.jsx";
import { DijkstraView } from "./views/DijkstraView.jsx";
import { BellmanFordView } from "./views/BellmanFordView.jsx";
import { FloydWarshallView } from "./views/FloydWarshallView.jsx";
import { SegTreeView } from "./views/SegTreeView.jsx";

const ALGOS = [
  {id: "bfs", label: "BFS", group: "Graph Traversal", icon: Network },
  {id: "dfs", label: "DFS", group: "Graph Traversal", icon: GitBranch },
  {id: "dijkstra", label: "Dijkstra", group: "Shortest Path", icon: Workflow },
  {id: "bellmanford",label: "Bellman-Ford",group: "Shortest Path",icon: Workflow,},
  {id: "floydwarshall",label: "Floyd-Warshall",group: "Shortest Path",icon: Grid3x3,},
  {id: "segtree",label: "Segment Tree",group: "Data Structures",icon: ListTree,},
];

function algoSubtitle(id) {
  switch (id) {
    case "bfs":
      return "Level-order traversal using queue — finds shortest path by edge count on unweighted graphs.";
    case "dfs":
      return "Depth-first traversal using a stack/recursion — explores as far as possible before backtracking.";
    case "dijkstra":
      return "Greedy shortest path using a priority queue — requires non-negative edge weights.";
    case "bellmanford":
      return "Dynamic-programming shortest path that tolerates negative weights and detects negative cycles.";
    case "floydwarshall":
      return "All-pairs shortest path via dynamic programming over intermediate vertices.";
    case "segtree":
      return "Range-sum segment tree with lazy propagation for O(log n) range updates and queries.";
    default:
      return "";
  }
}

export default function App(){
  useFonts();
  const [active, setActive] = useState("bfs");
  const groups = useMemo(() => {
    const g={};
    ALGOS.forEach((a) => {(g[a.group] = g[a.group] || []).push(a); });
    return g;
  }, []);

  return (
    <div style={{
        fontFamily: "'Inter', sans-serif",
        background: COLORS.bg0,
        color: COLORS.ink0,
        minHeight: "100%",
        width: "100%",
      }}
    >
      <div style={{ height:4, width:"100%", background:`linear-gradient(90deg,${COLORS.accent}, ${COLORS.blue}, ${COLORS.violet}`,}}/>
      <div style={{ display:"flex",minHeight:"100%" }}>
        <div
          style={{
            width: 230,
            flexShrink: 0,
            borderRight: `2px solid ${COLORS.accent}`,
            background: COLORS.bg1,
            padding: "20px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 25,
          }}
        >
          <div style={{ padding: "0 5px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 40, color: COLORS.accent,}}> AlgoFlow </span>
            </div>
          </div>

          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.ink2,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  padding: "0 8px",
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                {group}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap: 3 }}>
                {items.map((a) => {
                  const Icon = a.icon;
                  const isActive = active === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setActive(a.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 10px",
                        borderRadius: 8,
                        border: "none",
                        cursor: "pointer",
                        background: isActive ? COLORS.bg3 : "transparent",
                        color: isActive ? COLORS.accent : COLORS.ink1,
                        fontWeight: 500,
                        fontSize: 14,
                        transition: "all .15s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = COLORS.bg2;
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Icon size={15} />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "10px 8px", borderTop: `1px solid ${COLORS.line}`, fontSize: 10.5, color: COLORS.ink2, lineHeight: 1.6,}} > Edit the graph, set the speed, then step or play.</div>
          <div style={{fontSize: 13, color:COLORS.ink2}} > Made by Sumit Sharma.</div>
        </div>
        <div style={{flex:1,padding:22, overflowX:"hidden" }}>
          <div style={{marginBottom: 18}}>
            <div style={{fontSize: 19, fontWeight: 800, letterSpacing: -0.3 }}> {ALGOS.find((a) => a.id === active)?.label} </div>
            <div style={{ fontSize: 12.5, color: COLORS.ink2, marginTop: 2 }}> {algoSubtitle(active)} </div>
          </div>
          {active==="bfs" && <BFSDFSView mode="bfs" />}
          {active==="dfs" && <BFSDFSView mode="dfs" />}
          {active==="dijkstra" && <DijkstraView />}
          {active==="bellmanford" && <BellmanFordView />}
          {active==="floydwarshall" && <FloydWarshallView />}
          {active==="segtree" && <SegTreeView />}
        </div>
      </div>
    </div>
  );
}
