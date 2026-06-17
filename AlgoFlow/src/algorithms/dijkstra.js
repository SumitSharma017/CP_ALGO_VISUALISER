import { buildAdj, labelOf } from "./graph.js";

export function genDijkstraFrames(nodes, edges, start) {
  const adj = buildAdj(nodes, edges, false);
  const INF = Infinity;
  const dist = {};
  nodes.forEach((n) => (dist[n.id] = INF));
  dist[start] = 0;
  const visited = new Set();
  const frames = [];
  let pq = nodes.map((n) => n.id);

  frames.push({
    desc: `Initialize distances: ${labelOf(nodes, start)} = 0, all others = ∞.`,
    dist: { ...dist }, visited: new Set(), current: null, activeEdge: null, pq: [...pq],
  });

  while (pq.length) {
    pq.sort((a, b) => dist[a] - dist[b]);
    const u = pq.shift();
    if (dist[u] === INF) break;
    if (visited.has(u)) continue;
    visited.add(u);
    frames.push({
      desc: `Pick unvisited node with smallest tentative distance: ${labelOf(nodes, u)} (dist=${dist[u]}).`,
      dist: { ...dist }, visited: new Set(visited), current: u, activeEdge: null, pq: [...pq],
    });
    for (const { to, w, edgeId } of adj[u]) {
      if (visited.has(to)) continue;
      const newDist = dist[u] + w;
      if (newDist < dist[to]) {
        const old = dist[to];
        dist[to] = newDist;
        frames.push({
          desc: `Relax edge ${labelOf(nodes, u)}→${labelOf(nodes, to)} (w=${w}): ${old === INF ? "∞" : old} → ${newDist}. Update.`,
          dist: { ...dist }, visited: new Set(visited), current: u, activeEdge: edgeId, pq: [...pq], relaxed: to,
        });
      } else {
        frames.push({
          desc: `Check edge ${labelOf(nodes, u)}→${labelOf(nodes, to)} (w=${w}): ${dist[u] + w} ≥ ${dist[to]}, no update.`,
          dist: { ...dist }, visited: new Set(visited), current: u, activeEdge: edgeId, pq: [...pq],
        });
      }
    }
  }

  frames.push({
    desc: `All reachable nodes finalized. Shortest distances computed from ${labelOf(nodes, start)}.`,
    dist: { ...dist }, visited: new Set(visited), current: null, activeEdge: null, pq: [], done: true,
  });
  return frames;
}
