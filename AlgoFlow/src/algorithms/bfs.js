import { buildAdj, labelOf } from "./graph.js";

export function genBFSFrames(nodes, edges, start) {
  const adj = buildAdj(nodes, edges, false);
  const frames = [];
  const visited = new Set([start]);
  const queue = [start];
  const dist = { [start]: 0 };
  const order = [];

  frames.push({
    desc: `Initialize. Push start node ${labelOf(nodes, start)} into the queue.`,
    queue: [...queue], visited: new Set(visited), current: null, activeEdge: null, order: [...order], dist: { ...dist },
  });

  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    frames.push({
      desc: `Dequeue ${labelOf(nodes, u)}. Visit it and inspect its neighbours.`,
      queue: [...queue], visited: new Set(visited), current: u, activeEdge: null, order: [...order], dist: { ...dist },
    });
    for (const { to, edgeId } of adj[u]) {
      if (!visited.has(to)) {
        visited.add(to);
        dist[to] = dist[u] + 1;
        queue.push(to);
        frames.push({
          desc: `Edge ${labelOf(nodes, u)}→${labelOf(nodes, to)}: ${labelOf(nodes, to)} is unvisited. Mark visited, enqueue it.`,
          queue: [...queue], visited: new Set(visited), current: u, activeEdge: edgeId, order: [...order], dist: { ...dist },
        });
      } else {
        frames.push({
          desc: `Edge ${labelOf(nodes, u)}→${labelOf(nodes, to)}: already visited, skip.`,
          queue: [...queue], visited: new Set(visited), current: u, activeEdge: edgeId, order: [...order], dist: { ...dist },
        });
      }
    }
  }

  frames.push({
    desc: `Queue empty. BFS complete. Visit order: ${order.map((o) => labelOf(nodes, o)).join(" → ")}.`,
    queue: [], visited: new Set(visited), current: null, activeEdge: null, order: [...order], dist: { ...dist }, done: true,
  });
  return frames;
}
