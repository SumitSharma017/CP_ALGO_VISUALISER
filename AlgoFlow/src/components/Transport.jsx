import { Play, Pause, SkipBack, SkipForward, RotateCcw, Gauge } from "lucide-react";
import { COLORS } from "../theme.js";
import { IconBtn } from "./Primitives.jsx";

export function Transport({ pb }) {
  const { idx, total, playing, setPlaying, stepFwd, stepBack, reset, speed, setSpeed } = pb;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconBtn onClick={reset} title="Restart"><RotateCcw size={16} /></IconBtn>
        <IconBtn onClick={stepBack} disabled={idx === 0} title="Step back"><SkipBack size={16} /></IconBtn>
        <IconBtn
          onClick={() => { if (idx >= total - 1) { pb.setIdx(0); } setPlaying((p) => !p); }}
          title={playing ? "Pause" : "Play"} active={playing}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </IconBtn>
        <IconBtn onClick={stepFwd} disabled={idx >= total - 1} title="Step forward"><SkipForward size={16} /></IconBtn>
        <div style={{
          marginLeft: "auto", fontFamily: "'Fira Code', monospace", fontSize: 12,
          color: COLORS.ink1, background: COLORS.bg2, padding: "6px 10px",
          borderRadius: 7, border: `1px solid ${COLORS.line2}`,
        }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>
      <input
        type="range" min={0} max={Math.max(total - 1, 0)} value={idx}
        onChange={(e) => { pb.setIdx(Number(e.target.value)); pb.setPlaying(false); }}
        style={{ width: "100%", accentColor: COLORS.accent, cursor: "pointer" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Gauge size={14} color={COLORS.ink1} />
        <span style={{ fontSize: 12, color: COLORS.ink1, fontFamily: "'Fira Code', monospace", minWidth: 40 }}>
          {["", "0.5×", "0.8×", "1×", "1.8×", "3×"][speed]}
        </span>
        <input
          type="range" min={1} max={5} value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          style={{ flex: 1, accentColor: COLORS.amber, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export function DescBar({ text, verdict }) {
  const verdictColor = verdict === "done" ? COLORS.accent : verdict === "warn" ? COLORS.rose : COLORS.blue;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      background: COLORS.bg2, border: `1px solid ${COLORS.line2}`, borderRadius: 10,
      padding: "10px 14px", minHeight: 44,
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: 3, background: verdictColor,
        marginTop: 7, flexShrink: 0, boxShadow: `0 0 8px ${verdictColor}`,
      }} />
      <div style={{ fontSize: 13.5, color: COLORS.ink0, lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
        {text}
      </div>
    </div>
  );
}
