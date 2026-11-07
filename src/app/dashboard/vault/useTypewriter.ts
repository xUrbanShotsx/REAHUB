import { useEffect, useRef, useState } from "react";

/**
 * Reveals `target` a few characters per frame. It speeds up when the model gets ahead of the reader and
 * slows to a steady pen speed when it is keeping pace, so the page always looks like it is being written.
 */
export function useTypewriter(target: string, skip: boolean) {
  const [len, setLen] = useState(0);
  const live = useRef({ target, skip, len: 0 });
  useEffect(() => {
    live.current.target = target;
    live.current.skip = skip;
  }, [target, skip]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const s = live.current;
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      const backlog = s.target.length - s.len;
      if (backlog > 0) {
        const step = s.skip
          ? backlog
          : Math.max(1, Math.round(Math.min(1800, 75 + backlog * 1.3) * dt));
        s.len = Math.min(s.target.length, s.len + step);
        setLen(s.len);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return target.slice(0, len);
}
