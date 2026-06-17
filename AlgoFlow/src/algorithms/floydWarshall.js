import { labelOf } from "./graph.js";

function cloneMat(m) {
  return m.map((row) => row.slice());
}

export function genFloydWarshallFrames(nodes, edges) {
  const n = nodes.length;
  const INF = Infinity;
  const dist = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  edges.forEach((e) => {
    if (e.w < dist[e.u][e.v]) dist[e.u][e.v] = e.w;
    if (!e.directed && e.w < dist[e.v][e.u]) dist[e.v][e.u] = e.w;
  });

  const frames = [];
  frames.push({
    desc: `Initialize distance matrix from direct edges (∞ where no edge exists).`,
    dist: cloneMat(dist), k: -1, i: -1, j: -1,
  });

  for (let k = 0; k < n; k++) {
    frames.push({
      desc: `Consider node ${labelOf(nodes, k)} as an intermediate vertex.`,
      dist: cloneMat(dist), k, i: -1, j: -1,
    });
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] === INF || dist[k][j] === INF) continue;
        const through = dist[i][k] + dist[k][j];
        if (through < dist[i][j]) {
          const old = dist[i][j];
          dist[i][j] = through;
          frames.push({
            desc: `dist[${labelOf(nodes, i)}][${labelOf(nodes, j)}] via ${labelOf(nodes, k)}: ${old === INF ? "∞" : old} → ${through}. Update.`,
            dist: cloneMat(dist), k, i, j, updated: true,
          });
        }
      }
    }
  }

  frames.push({
    desc: `Floyd-Warshall complete. Matrix holds shortest distance between every pair.`,
    dist: cloneMat(dist), k: -1, i: -1, j: -1, done: true,
  });
  return frames;
}
