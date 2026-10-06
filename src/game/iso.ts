import type { IsoBox } from "./types";

export const TW = 28;
export const TH = 14;
export const ZH = 26;

export function project(x: number, y: number, z = 0, ox = 0, oy = 0) {
  return [ox + (x - y) * TW, oy + (x + y) * TH - z * ZH] as const;
}

export function unproject(sx: number, sy: number, ox: number, oy: number) {
  const a = (sx - ox) / TW;
  const b = (sy - oy) / TH;
  return { x: (a + b) / 2, y: (b - a) / 2 };
}

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const k = (v: number) => Math.max(0, Math.min(255, v + amt));
  const r = k(n >> 16);
  const g = k((n >> 8) & 255);
  const b = k(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function poly(
  ctx: CanvasRenderingContext2D,
  pts: readonly (readonly [number, number])[],
  fill: string,
) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function drawBox(
  ctx: CanvasRenderingContext2D,
  o: IsoBox,
  ox: number,
  oy: number,
  tShift = 0,
) {
  const z = o.z ?? 0;
  const t = z + o.h;
  const { x, y, w, d, c } = o;
  const P = (px: number, py: number, pz: number) => project(px, py, pz, ox, oy);
  poly(ctx, [P(x, y, t), P(x + w, y, t), P(x + w, y + d, t), P(x, y + d, t)], c);
  poly(
    ctx,
    [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, t), P(x, y + d, t)],
    shade(c, -22),
  );
  poly(
    ctx,
    [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, t), P(x + w, y, t)],
    shade(c, -42),
  );
  if (o.kind === "water") {
    const [cx, cy] = P(x + w * 0.5, y + d * 0.5, t);
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#173f45";
    for (let i = 0; i < 6; i++) {
      const ox2 = Math.sin(tShift / 400 + i * 1.3) * 8;
      ctx.beginPath();
      ctx.ellipse(cx + ox2, cy + i * 6 - 12, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  if (o.kind === "neon") {
    ctx.save();
    ctx.shadowColor = "#E0457B";
    ctx.shadowBlur = 18;
    poly(ctx, [P(x, y, t), P(x + w, y, t), P(x + w, y + d, t), P(x, y + d, t)], "#E0457B");
    ctx.restore();
  }
}

export function sortKey(o: { x: number; y: number; w?: number; d?: number; z?: number }) {
  return o.x + (o.w ?? 0) + o.y + (o.d ?? 0) + (o.z ?? 0) * 0.01;
}

export function hitsBlock(
  x: number,
  y: number,
  blockers: { x: number; y: number; w: number; d: number }[],
  rad = 0.28,
) {
  for (const b of blockers) {
    const nx = Math.max(b.x, Math.min(x, b.x + b.w));
    const ny = Math.max(b.y, Math.min(y, b.y + b.d));
    if (Math.hypot(x - nx, y - ny) < rad) return true;
  }
  return false;
}
