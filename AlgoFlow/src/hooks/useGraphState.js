import { useState, useEffect, useCallback } from "react";
import { genCirclePositions, defaultGraph } from "../algorithms/graph.js";

export function useGraphState(weighted, directed) {
  const [nodeCount, setNodeCount] = useState(7);
  const [graph, setGraph] = useState(() => defaultGraph(weighted, directed));

  const regen = useCallback(() => {
    const pts = genCirclePositions(nodeCount, 640, 420);
    const nodes = pts.map((p, i) => ({ id: i, x: p.x, y: p.y, label: String.fromCharCode(65 + i) }));
    const edges = [];
    const used = new Set();
    const targetEdges = Math.min(nodeCount * 2, (nodeCount * (nodeCount - 1)) / 2);
    let guard = 0;
    while (edges.length < targetEdges && guard < 500) {
      guard++;
      const u = Math.floor(Math.random() * nodeCount);
      let v = Math.floor(Math.random() * nodeCount);
      if (u === v) continue;
      const key = directed ? `${u}-${v}` : `${Math.min(u, v)}-${Math.max(u, v)}`;
      if (used.has(key)) continue;
      used.add(key);
      edges.push({ id: `e${edges.length}-${guard}`, u, v, w: weighted ? Math.floor(Math.random() * 9) + 1 : 1, directed });
    }
    for (let i = 1; i < nodeCount; i++) {
      const key = directed ? `${i - 1}-${i}` : `${Math.min(i - 1, i)}-${Math.max(i - 1, i)}`;
      if (!used.has(key)) {
        used.add(key);
        edges.push({ id: `chain${i}`, u: i - 1, v: i, w: weighted ? Math.floor(Math.random() * 9) + 1 : 1, directed });
      }
    }
    setGraph({ nodes, edges });
  }, [nodeCount, weighted, directed]);

  useEffect(() => { regen(); }, [nodeCount]);

  return { graph, setGraph, nodeCount, setNodeCount, regen };
}
