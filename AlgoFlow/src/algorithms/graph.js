export function genCirclePositions(n, w, h) {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 56;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
    pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
  }
  return pts;
}

export function defaultGraph(weighted, directed, w = 640, h = 420) {
  const n = 7;
  const pts = genCirclePositions(n, w, h);
  const nodes = pts.map((p, i) => ({ id: i, x: p.x, y: p.y, label: String.fromCharCode(65 + i) }));
  const edgeDefs = [
    [0, 1, 4], [0, 2, 2], [1, 3, 5], [2, 3, 8], [2, 4, 3],
    [3, 5, 6], [4, 5, 1], [4, 6, 7], [5, 6, 2], [1, 2, 3],
  ];
  const edges = edgeDefs.map(([u, v, w_], i) => ({
    id: `e${i}`, u, v, w: weighted ? w_ : 1, directed,
  }));
  return { nodes, edges };
}

export function negativeGraph(w = 640, h = 420) {
  const n = 6;
  const pts = genCirclePositions(n, w, h);
  const nodes = pts.map((p, i) => ({ id: i, x: p.x, y: p.y, label: String.fromCharCode(65 + i) }));
  const edgeDefs = [
    [0, 1, 6], [0, 2, 7], [1, 2, 8], [1, 3, -4], [1, 4, 5],
    [2, 3, -3], [2, 4, 9], [3, 1, 7], [4, 0, 2], [4, 3, 7], [5, 4, -2],
  ];
  const edges = edgeDefs.map(([u, v, w_], i) => ({ id: `e${i}`, u, v, w: w_, directed: true }));
  return { nodes, edges };
}

export function labelOf(nodes, id) {
  const n = nodes.find((nn) => nn.id === id);
  return n ? n.label : "?";
}

export function buildAdj(nodes, edges, directed) {
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach((e) => {
    adj[e.u].push({ to: e.v, w: e.w, edgeId: e.id });
    if (!directed) adj[e.v].push({ to: e.u, w: e.w, edgeId: e.id });
  });
  Object.values(adj).forEach((list) => list.sort((a, b) => a.to - b.to));
  return adj;
}
