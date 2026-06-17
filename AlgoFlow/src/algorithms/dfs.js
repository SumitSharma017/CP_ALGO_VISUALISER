import { buildAdj, labelOf } from "./graph.js";

export function genDFSFrames(nodes, edges, start) {
  const adj = buildAdj(nodes, edges, false);
  const frames = [];
  const visited = new Set();
  const stack = [start];
  const order = [];
  const callStack = [];

  frames.push({
    desc: `Initialize. Push start node ${labelOf(nodes, start)} onto the stack.`,
    stack: [...stack], visited: new Set(visited), current: null, activeEdge: null, order: [...order],
  });

  function dfs(u, viaEdge) {
    visited.add(u);
    order.push(u);
    callStack.push(u);
    frames.push({
      desc: `Visit ${labelOf(nodes, u)}. Push onto call stack.`,
      stack: [...callStack], visited: new Set(visited), current: u, activeEdge: viaEdge, order: [...order],
    });
    for (const { to, edgeId } of adj[u]) {
      if (!visited.has(to)) {
        frames.push({
          desc: `From ${labelOf(nodes, u)}, explore unvisited neighbour ${labelOf(nodes, to)}.`,
          stack: [...callStack], visited: new Set(visited), current: u, activeEdge: edgeId, order: [...order],
        });
        dfs(to, edgeId);
      } else {
        frames.push({
          desc: `From ${labelOf(nodes, u)}, neighbour ${labelOf(nodes, to)} already visited, skip.`,
          stack: [...callStack], visited: new Set(visited), current: u, activeEdge: edgeId, order: [...order],
        });
      }
    }
    callStack.pop();
    frames.push({
      desc: `All neighbours of ${labelOf(nodes, u)} explored. Pop from call stack (backtrack).`,
      stack: [...callStack], visited: new Set(visited), current: callStack[callStack.length - 1] ?? null, activeEdge: null, order: [...order],
    });
  }

  dfs(start, null);
  frames.push({
    desc: `DFS complete. Visit order: ${order.map((o) => labelOf(nodes, o)).join(" → ")}.`,
    stack: [], visited: new Set(visited), current: null, activeEdge: null, order: [...order], done: true,
  });
  return frames;
}
