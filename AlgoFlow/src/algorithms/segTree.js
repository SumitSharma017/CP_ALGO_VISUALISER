export function buildSegTreeFrames(arr, queries) {
  const n = arr.length;
  const size = 4 * Math.max(n, 1);
  const tree = Array(size).fill(null);
  const lazy = Array(size).fill(0);
  const frames = [];

  function build(node, l, r) {
    if (l === r) {
      tree[node] = arr[l];
      frames.push({ type: "build", desc: `Leaf node for index ${l}: value = ${arr[l]}.`, tree: tree.slice(), node, l, r, lazy: lazy.slice() });
      return;
    }
    const mid = (l + r) >> 1;
    frames.push({ type: "build", desc: `Split range [${l},${r}] at mid=${mid}. Build left then right child.`, tree: tree.slice(), node, l, r, lazy: lazy.slice() });
    build(2 * node, l, mid);
    build(2 * node + 1, mid + 1, r);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
    frames.push({ type: "build", desc: `Combine children for range [${l},${r}]: sum = ${tree[node]}.`, tree: tree.slice(), node, l, r, lazy: lazy.slice() });
  }

  build(1, 0, n - 1);

  function pushDown(node, l, r) {
    if (lazy[node] !== 0) {
      const mid = (l + r) >> 1;
      const cl = 2 * node, cr = 2 * node + 1;
      if (tree[cl] !== null) {
        tree[cl] += lazy[node] * (mid - l + 1);
        lazy[cl] += lazy[node];
      }
      if (tree[cr] !== null) {
        tree[cr] += lazy[node] * (r - mid);
        lazy[cr] += lazy[node];
      }
      lazy[node] = 0;
    }
  }

  function applyRangeAdd(node, l, r, ql, qr, val) {
    if (qr < l || r < ql) {
      frames.push({ type: "update", desc: `Range [${l},${r}] outside update range [${ql},${qr}]. Skip.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, skip: true });
      return;
    }
    if (ql <= l && r <= qr) {
      tree[node] += val * (r - l + 1);
      lazy[node] += val;
      frames.push({ type: "update", desc: `Range [${l},${r}] fully inside [${ql},${qr}]. Add ${val}×len directly, mark lazy += ${val}.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, fullyCovered: true });
      return;
    }
    frames.push({ type: "update", desc: `Range [${l},${r}] partially overlaps [${ql},${qr}]. Push down lazy, then recurse.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, partial: true });
    pushDown(node, l, r);
    frames.push({ type: "update", desc: `Pushed down lazy value from node [${l},${r}] to its children.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, pushed: true });
    const mid = (l + r) >> 1;
    applyRangeAdd(2 * node, l, mid, ql, qr, val);
    applyRangeAdd(2 * node + 1, mid + 1, r, ql, qr, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
    frames.push({ type: "update", desc: `Recombine node [${l},${r}] after children updated.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, recombine: true });
  }

  function query(node, l, r, ql, qr) {
    if (qr < l || r < ql) {
      frames.push({ type: "query", desc: `Range [${l},${r}] outside query [${ql},${qr}]. Contributes 0.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, skip: true });
      return 0;
    }
    if (ql <= l && r <= qr) {
      frames.push({ type: "query", desc: `Range [${l},${r}] fully inside [${ql},${qr}]. Take node sum = ${tree[node]}.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, fullyCovered: true });
      return tree[node];
    }
    frames.push({ type: "query", desc: `Range [${l},${r}] partially overlaps [${ql},${qr}]. Push down, recurse into children.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, partial: true });
    pushDown(node, l, r);
    const mid = (l + r) >> 1;
    const left = query(2 * node, l, mid, ql, qr);
    const right = query(2 * node + 1, mid + 1, r, ql, qr);
    frames.push({ type: "query", desc: `Combine results from [${l},${mid}] and [${mid + 1},${r}]: ${left} + ${right} = ${left + right}.`, tree: tree.slice(), lazy: lazy.slice(), node, l, r, ql, qr, combine: true, result: left + right });
    return left + right;
  }

  for (const q of queries) {
    if (q.type === "update") {
      frames.push({ type: "marker", desc: `— Range update: add ${q.val} to indices [${q.l},${q.r}] —`, tree: tree.slice(), lazy: lazy.slice() });
      applyRangeAdd(1, 0, n - 1, q.l, q.r, q.val);
    } else {
      frames.push({ type: "marker", desc: `— Range query: sum of indices [${q.l},${q.r}] —`, tree: tree.slice(), lazy: lazy.slice() });
      const res = query(1, 0, n - 1, q.l, q.r);
      frames.push({ type: "query", desc: `Query result for [${q.l},${q.r}] = ${res}.`, tree: tree.slice(), lazy: lazy.slice(), final: true, result: res });
    }
  }

  frames.push({ type: "done", desc: `All operations complete.`, tree: tree.slice(), lazy: lazy.slice(), done: true });
  return { frames, n };
}
