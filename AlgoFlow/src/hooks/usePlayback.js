import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export function usePlayback(frames) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const timer = useRef(null);

  const speedMs = useMemo(() => {
    const map = { 1: 1600, 2: 1100, 3: 700, 4: 420, 5: 220 };
    return map[speed] ?? 700;
  }, [speed]);

  useEffect(() => {
    if (playing && idx < frames.length - 1) timer.current = setTimeout(() => setIdx((i) => Math.min(i + 1, frames.length - 1)), speedMs);
    else if (idx >= frames.length - 1) setPlaying(false);
    return () => clearTimeout(timer.current);
  }, [playing, idx, speedMs, frames.length]);

  const reset = useCallback(() => { setIdx(0); setPlaying(false); }, []);
  const stepFwd = useCallback(() => setIdx((i) => Math.min(i + 1, frames.length - 1)), [frames.length]);
  const stepBack = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);
  const toggle = useCallback(() => setIdx((i) => {
    if (i >= frames.length - 1) { setPlaying(false); return 0; }
    setPlaying((p) => !p);
    return i;
  }), [frames.length]);

  return {
    idx, setIdx, playing, setPlaying, speed, setSpeed,
    reset, stepFwd, stepBack, toggle,
    frame: frames[idx] || {},
    total: frames.length,
  };
}
