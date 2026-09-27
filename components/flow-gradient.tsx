"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Warm brand palette (olive-ink ground, olive / brass / sand / cream clouds)
// so the gradient moments rhyme with the rest of the site.
export const CLOUD_STOPS = ["#15180E", "#4F5B2A", "#B8892D", "#D8C9A8"];

type Blob = {
  color: string;
  bx: number;
  by: number;
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
  r: number;
};

const BLOBS: Blob[] = [
  { color: "#4F5B2A", bx: 0.78, by: 0.3, ax: 0.12, ay: 0.16, fx: 0.21, fy: 0.16, px: 0.0, py: 1.4, r: 0.52 },
  { color: "#B8892D", bx: 0.42, by: 0.62, ax: 0.16, ay: 0.12, fx: 0.13, fy: 0.19, px: 2.1, py: 0.4, r: 0.58 },
  { color: "#D8C9A8", bx: 0.85, by: 0.82, ax: 0.1, ay: 0.1, fx: 0.17, fy: 0.12, px: 4.2, py: 2.8, r: 0.5 },
  { color: "#F5EFE3", bx: 0.2, by: 0.25, ax: 0.14, ay: 0.14, fx: 0.11, fy: 0.15, px: 1.2, py: 5.1, r: 0.55 },
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function FlowGradient({
  className,
  speed = 1,
  opacity = 1,
}: {
  className?: string;
  speed?: number;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let t = Math.random() * 100;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Low-res buffer upscaled by CSS = soft clouds for free, cheap to paint.
      canvas.width = Math.max(2, Math.round(rect.width / 3));
      canvas.height = Math.max(2, Math.round(rect.height / 3));
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    const paint = () => {
      const { width: w, height: h } = canvas;
      if (w < 2 || h < 2) return;
      const base = hexToRgb(CLOUD_STOPS[0]);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
      ctx.fillRect(0, 0, w, h);
      const R = Math.min(w, h);
      for (const b of BLOBS) {
        const x = (b.bx + b.ax * Math.sin(t * b.fx + b.px)) * w;
        const y = (b.by + b.ay * Math.cos(t * b.fy + b.py)) * h;
        const r = b.r * R;
        const [cr, cg, cb] = hexToRgb(b.color);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${cr},${cg},${cb},0.85)`);
        g.addColorStop(0.55, `rgba(${cr},${cg},${cb},0.45)`);
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    };

    if (reduced) {
      paint(); // One static frame — no animation.
      return () => ro?.disconnect();
    }

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            running = entry.isIntersecting && !document.hidden;
          })
        : null;
    io?.observe(canvas);
    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!running) return;
      t += ((now - last) / 1000) * 0.35 * speed;
      last = now;
      paint();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [speed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
      style={{ opacity }}
    />
  );
}
