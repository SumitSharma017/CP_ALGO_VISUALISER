import { labelOf } from "./graph.js";

export function genBellmanFordFrames(nodes, edges, start) {
  const INF = Infinity;
  const dist = {};
  nodes.forEach((n) => (dist[n.id] = INF));
  dist[start] = 0;
  const frames = [];
  const n = nodes.length;

  frames.push({
    desc: `Initialize distances: ${labelOf(nodes, start)} = 0, all others = ∞. Will relax all edges over ${n - 1} passes.`,
    dist: { ...dist }, current: null, activeEdge: null, pass: 0, totalPasses: n - 1,
  });

  let anyUpdate = false;
  for (let pass = 1; pass <= n - 1; pass++) {
    anyUpdate = false;
    frames.push({
      desc: `Pass ${pass}/${n - 1}: relax every edge once.`,
      dist: { ...dist }, current: null, activeEdge: null, pass, totalPasses: n - 1,
    });
    for (const e of edges) {
      const { u, v, w, id } = e;
      if (dist[u] !== INF && dist[u] + w < dist[v]) {
        const old = dist[v];
        dist[v] = dist[u] + w;
        anyUpdate = true;
        frames.push({
          desc: `Edge ${labelOf(nodes, u)}→${labelOf(nodes, v)} (w=${w}): ${old === INF ? "∞" : old} → ${dist[v]}. Relaxed.`,
          dist: { ...dist }, current: u, activeEdge: id, pass, totalPasses: n - 1, relaxed: v,
        });
      } else {
        frames.push({
          desc: `Edge ${labelOf(nodes, u)}→${labelOf(nodes, v)} (w=${w}): no improvement.`,
          dist: { ...dist }, current: u, activeEdge: id, pass, totalPasses: n - 1,
        });
      }
    }
    if (!anyUpdate) {
      frames.push({
        desc: `No edge relaxed this pass — distances stable. Stopping early.`,
        dist: { ...dist }, current: null, activeEdge: null, pass, totalPasses: n - 1,
      });
      break;
    }
  }

  let negCycle = false;
  for (const e of edges) {
    if (dist[e.u] !== INF && dist[e.u] + e.w < dist[e.v]) {
      negCycle = true;
      frames.push({
        desc: `Extra check: edge ${labelOf(nodes, e.u)}→${labelOf(nodes, e.v)} can still relax → negative-weight cycle detected!`,
        dist: { ...dist }, current: e.u, activeEdge: e.id, pass: n, totalPasses: n - 1, negCycle: true,
      });
      break;
    }
  }

  frames.push({
    desc: negCycle
      ? `Bellman-Ford finished: a negative cycle exists, distances are not well-defined.`
      : `Bellman-Ford complete. All shortest distances finalized from ${labelOf(nodes, start)}.`,
    dist: { ...dist }, current: null, activeEdge: null, pass: n - 1, totalPasses: n - 1, done: true, negCycle,
  });
  return frames;
}
