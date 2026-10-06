import { useEffect, useRef } from "react";
import { cameraOf, drawWorld } from "@/game/draw";
import { unproject } from "@/game/iso";
import { setPointerTarget } from "@/game/input";
import { mapFor } from "@/game/maps";
import { useGame } from "@/game/store";

export function WorldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const cam = useRef({ x: 0, y: 0 });
  const place = useGame((s) => s.place);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const camState = cam.current;

    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.floor(r.width * dpr));
      canvas.height = Math.max(1, Math.floor(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const loop = (now: number) => {
      const s = useGame.getState();
      const target = cameraOf(s);
      const k = 1 - Math.exp(-5.5 * 0.016);
      camState.x += (target.x - camState.x) * k;
      camState.y += (target.y - camState.y) * k;
      const shake = s.trauma * s.trauma * (s.settings.shake ? 10 : 0);
      const ox = camState.x + (Math.random() - 0.5) * shake;
      const oy = camState.y + (Math.random() - 0.5) * shake;
      ctx.setTransform(
        Math.min(2, window.devicePixelRatio || 1),
        0,
        0,
        Math.min(2, window.devicePixelRatio || 1),
        0,
        0,
      );
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      drawWorld(ctx, s, { x: ox, y: oy }, now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = useGame.getState();
    if (s.phoneOpen || s.dialogue || s.radialNpc) return;
    if (!walkable(s.place)) return;
    const canvas = ref.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const sx = e.clientX - r.left;
    const sy = e.clientY - r.top;
    const map = mapFor(s.place);
    const ox = r.width / 2 - cam.current.x;
    const oy = r.height * 0.28 - cam.current.y;
    const p = unproject(sx, sy, ox, oy);
    const x = Math.max(0.5, Math.min(map.w - 0.5, p.x));
    const y = Math.max(0.5, Math.min(map.h - 0.5, p.y));
    setPointerTarget({ x, y });
  };

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full touch-none"
      onPointerDown={onPointer}
      aria-label={place}
    />
  );
}

function walkable(p: string): p is "house" | "yard" | "street" {
  return p === "house" || p === "yard" || p === "street";
}
