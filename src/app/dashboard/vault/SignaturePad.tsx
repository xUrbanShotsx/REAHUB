"use client";

import { useEffect, useRef, useState } from "react";

/** Draw a signature with a mouse, finger or pen. Reports a PNG data URL, or null when cleared. */
export function SignaturePad({
  onChange,
}: {
  onChange: (png: string | null) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [inked, setInked] = useState(false);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1a2238";
  }, []);

  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const down = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
    // a tap leaves a dot
    const ctx = canvas.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(last.current.x, last.current.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = "#1a2238";
    ctx.fill();
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    const ctx = canvas.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    setInked(true);
    onChange(canvas.current!.toDataURL("image/png"));
  };

  const clear = () => {
    const c = canvas.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setInked(false);
    onChange(null);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-line bg-white">
        <canvas
          ref={canvas}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-label="Signature. Draw with your mouse, finger or pen."
          className="block h-36 w-full cursor-crosshair touch-none"
        />
        {!inked && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-ink-soft">
            Sign here
          </span>
        )}
        <span className="pointer-events-none absolute inset-x-4 bottom-8 border-b border-dashed border-line" />
      </div>
      <button
        type="button"
        onClick={clear}
        disabled={!inked}
        className="mt-2 text-xs font-semibold text-ink-soft underline hover:text-ink disabled:no-underline disabled:opacity-40"
      >
        Clear signature
      </button>
    </div>
  );
}
