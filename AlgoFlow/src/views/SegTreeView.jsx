import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, Shuffle } from "lucide-react";
import { COLORS, selStyle, addBtnStyle, shuffleBtnStyle, layoutStyle, toggleBtnStyle } from "../theme.js";
import { Panel, SectionLabel } from "../components/Primitives.jsx";
import { Transport, DescBar } from "../components/Transport.jsx";
import { usePlayback } from "../hooks/usePlayback.js";
import { buildSegTreeFrames } from "../algorithms/segTree.js";

export function SegTreeView() {
  const [arr, setArr] = useState([3, 1, 4, 1, 5, 9, 2, 6]);
  const [opType, setOpType] = useState("update");
  const [opL, setOpL] = useState(2);
  const [opR, setOpR] = useState(5);
  const [opVal, setOpVal] = useState(3);
  const [queries, setQueries] = useState([
    { type: "update", l: 2, r: 5, val: 3 },
    { type: "query", l: 0, r: 7 },
  ]);

  const built = useMemo(() => buildSegTreeFrames(arr, queries), [arr, queries]);
  const pb = usePlayback(built.frames);
  useEffect(() => { pb.reset(); }, [arr, queries]); // eslint-disable-line

  const f = pb.frame;
  const n = arr.length;

  function addQuery() {
    if (opL > opR || opL < 0 || opR >= n) return;
    setQueries((q) => [
      ...q,
      opType === "update"
        ? { type: "update", l: opL, r: opR, val: opVal }
        : { type: "query", l: opL, r: opR },
    ]);
  }

  function clearQueries() { setQueries([]); }

  function randomizeArray() {
    const len = 6 + Math.floor(Math.random() * 4);
    setArr(Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1));
    setQueries([]);
  }

  const treeNodes = useMemo(() => {
    const size = 4 * Math.max(n, 1);
    const positions = [];
    function layout(node, l, r, depth, xMin, xMax) {
      if (node >= size || l > r) return;
      const x = (xMin + xMax) / 2;
      positions.push({ node, l, r, depth, x });
      if (l === r) return;
      const mid = (l + r) >> 1;
      layout(2 * node, l, mid, depth + 1, xMin, x);
      layout(2 * node + 1, mid + 1, r, depth + 1, x, xMax);
    }
    layout(1, 0, n - 1, 0, 20, 620);
    return positions;
  }, [n]);

  const maxDepth = treeNodes.reduce((m, t) => Math.max(m, t.depth), 0);
  const treeHeight = (maxDepth + 1) * 70 + 30;

  return (
    <div style={layoutStyle}>
      <Panel style={{ flex: "1 1 640px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
          <SectionLabel>Segment Tree (range sum, lazy propagation)</SectionLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { color: COLORS.amber, label: "visiting" },
              { color: COLORS.accent, label: "fully covered" },
              { color: COLORS.rose, label: "lazy pending" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 9, height: 9, borderRadius: 5, background: color }} />
                <span style={{ fontSize: 11, color: COLORS.ink1, fontFamily: "'Fira Code', monospace" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 640 ${treeHeight}`} width="100%" height={treeHeight}>
          {treeNodes.map((t) => {
            if (t.l === t.r) return null;
            const left = treeNodes.find((tt) => tt.depth === t.depth + 1 && tt.l === t.l);
            const right = treeNodes.find((tt) => tt.depth === t.depth + 1 && tt.r === t.r);
            return (
              <g key={`edges-${t.node}`}>
                {left && <line x1={t.x} y1={t.depth * 70 + 25} x2={left.x} y2={(t.depth + 1) * 70 + 25} stroke={COLORS.line2} strokeWidth={1.5} />}
                {right && <line x1={t.x} y1={t.depth * 70 + 25} x2={right.x} y2={(t.depth + 1) * 70 + 25} stroke={COLORS.line2} strokeWidth={1.5} />}
              </g>
            );
          })}
          {treeNodes.map((t) => {
            const isActive = f.node === t.node && f.l === t.l && f.r === t.r;
            const val = f.tree ? f.tree[t.node] : null;
            const lz = f.lazy ? f.lazy[t.node] : 0;
            let fill = COLORS.bg3, stroke = COLORS.line2;
            if (isActive) {
              if (f.fullyCovered) { fill = `${COLORS.accent}30`; stroke = COLORS.accent; }
              else if (f.skip) { fill = COLORS.bg2; stroke = COLORS.ink2; }
              else { fill = `${COLORS.amber}30`; stroke = COLORS.amber; }
            }
            const y = t.depth * 70 + 25;
            return (
              <g key={t.node} style={{ transition: "all .2s ease" }}>
                <rect x={t.x - 26} y={y - 18} width={52} height={36} rx={8} fill={fill} stroke={stroke} strokeWidth={isActive ? 2.5 : 1.5} />
                <text x={t.x} y={y - 3} textAnchor="middle" fontSize={13} fontWeight={700}
                  fontFamily="'Fira Code', monospace"
                  fill={isActive ? (f.fullyCovered ? COLORS.accent : COLORS.amber) : COLORS.ink0}>
                  {val ?? "·"}
                </text>
                <text x={t.x} y={y + 12} textAnchor="middle" fontSize={9} fontFamily="'Fira Code', monospace" fill={COLORS.ink2}>
                  [{t.l},{t.r}]
                </text>
                {lz !== 0 && (
                  <g>
                    <circle cx={t.x + 22} cy={y - 16} r={8} fill={COLORS.rose} />
                    <text x={t.x + 22} y={y - 12.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#0b0e14">+{lz}</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        <SectionLabel>Underlying array</SectionLabel>
        <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
          {arr.map((v, i) => {
            const inRange = f.ql !== undefined && i >= f.ql && i <= f.qr;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Fira Code', monospace", fontWeight: 700, fontSize: 13,
                  background: inRange ? `${COLORS.violet}25` : COLORS.bg2,
                  border: `1px solid ${inRange ? COLORS.violet : COLORS.line2}`,
                  color: inRange ? COLORS.violet : COLORS.ink0,
                }}>{v}</div>
                <span style={{ fontSize: 10, color: COLORS.ink2, fontFamily: "'Fira Code', monospace" }}>{i}</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14 }}>
          <DescBar
            text={f.desc || "Queue range update/query operations and press play."}
            verdict={f.done ? "done" : f.skip ? "warn" : "info"}
          />
        </div>
        <div style={{ marginTop: 14 }}><Transport pb={pb} /></div>
      </Panel>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: "1 1 300px", minWidth: 280 }}>
        <Panel>
          <SectionLabel>Array</SectionLabel>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={arr.join(",")}
              onChange={(e) => {
                const parsed = e.target.value.split(",").map((s) => parseInt(s.trim(), 10)).filter((x) => !isNaN(x));
                if (parsed.length) setArr(parsed.slice(0, 12));
              }}
              style={{ ...selStyle, flex: 1, padding: "7px 10px" }}
            />
          </div>
          <button onClick={randomizeArray} style={{ ...shuffleBtnStyle, marginTop: 10 }}>
            <Shuffle size={14} /> Randomize array
          </button>
        </Panel>

        <Panel>
          <SectionLabel>Add operation</SectionLabel>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <button onClick={() => setOpType("update")} style={toggleBtnStyle(opType === "update")}>Range Update</button>
            <button onClick={() => setOpType("query")} style={toggleBtnStyle(opType === "query")}>Range Query</button>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, color: COLORS.ink1 }}>L</span>
            <input type="number" value={opL} min={0} max={n - 1} onChange={(e) => setOpL(Number(e.target.value))} style={{ ...selStyle, width: 50 }} />
            <span style={{ fontSize: 11.5, color: COLORS.ink1 }}>R</span>
            <input type="number" value={opR} min={0} max={n - 1} onChange={(e) => setOpR(Number(e.target.value))} style={{ ...selStyle, width: 50 }} />
            {opType === "update" && (
              <>
                <span style={{ fontSize: 11.5, color: COLORS.ink1 }}>+</span>
                <input type="number" value={opVal} onChange={(e) => setOpVal(Number(e.target.value))} style={{ ...selStyle, width: 50 }} />
              </>
            )}
            <button onClick={addQuery} style={addBtnStyle}><Plus size={14} /></button>
          </div>
        </Panel>

        <Panel>
          <SectionLabel>Operation queue ({queries.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 160, overflowY: "auto" }}>
            {queries.map((q, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontFamily: "'Fira Code', monospace", fontSize: 12, padding: "5px 9px", borderRadius: 7,
                background: COLORS.bg2, border: `1px solid ${COLORS.line2}`, color: COLORS.ink0,
              }}>
                <span>{q.type === "update" ? `UPD [${q.l},${q.r}] +${q.val}` : `QRY [${q.l},${q.r}]`}</span>
                <button
                  onClick={() => setQueries((qs) => qs.filter((_, idx) => idx !== i))}
                  style={{ background: "none", border: "none", color: COLORS.ink2, cursor: "pointer", display: "flex" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {queries.length === 0 && <span style={{ color: COLORS.ink2, fontSize: 12.5 }}>no operations queued</span>}
          </div>
          {queries.length > 0 && (
            <button onClick={clearQueries} style={{ ...shuffleBtnStyle, marginTop: 10 }}>Clear all</button>
          )}
        </Panel>

        {f.final && (
          <Panel>
            <SectionLabel>Query result</SectionLabel>
            <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 24, fontWeight: 700, color: COLORS.accent }}>
              {f.result}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
