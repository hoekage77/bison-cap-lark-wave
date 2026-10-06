import { CHARACTERS, NPCS } from "./content";
import { timeOfDay } from "./format";
import { drawBox, project, sortKey } from "./iso";
import { mapFor } from "./maps";
import { world } from "./world";
import type { CharacterId, GameState, IsoBox, NpcId, Place } from "./types";

function npcHere(from: number, to: number, minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  if (to <= 1440) return m >= from && m < to;
  return m >= from || m < to - 1440;
}

function sky(minutes: number) {
  const tod = timeOfDay(minutes);
  if (tod === "night") return ["#1B1F3A", "#2a2450"];
  if (tod === "dusk") return ["#c45c4a", "#5a3a6a"];
  if (tod === "golden") return ["#f3c77a", "#e8a05a"];
  if (tod === "dawn") return ["#f0c9b0", "#cfe6ee"];
  return ["#cfe6ee", "#9cc774"];
}

function hair(
  ctx: CanvasRenderingContext2D,
  kind: string,
  accent: string,
  dark: string,
) {
  ctx.fillStyle = dark;
  if (kind === "gele") {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(0, -26, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "hij") {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(0, -18, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "cap") {
    ctx.fillStyle = accent;
    ctx.fillRect(-7, -24, 14, 4);
    ctx.beginPath();
    ctx.arc(0, -22, 7, Math.PI, 0);
    ctx.fill();
  } else if (kind === "braids") {
    ctx.beginPath();
    ctx.arc(0, -20, 7, Math.PI, 0);
    ctx.fill();
    for (const x of [-5, -2, 2, 5]) {
      ctx.fillRect(x - 0.8, -20, 1.6, 10);
    }
  } else {
    ctx.beginPath();
    ctx.arc(0, -20, 7, Math.PI, 0.2);
    ctx.fill();
  }
}

export function drawPerson(
  ctx: CanvasRenderingContext2D,
  opt: {
    x: number;
    y: number;
    ox: number;
    oy: number;
    skin: string;
    cloth: string;
    accent: string;
    hair: string;
    walk: number;
    heading: number;
    name?: string;
  },
) {
  const [sx, sy] = project(opt.x, opt.y, 0, opt.ox, opt.oy);
  ctx.save();
  ctx.translate(sx, sy);
  ctx.fillStyle = "#0003";
  ctx.beginPath();
  ctx.ellipse(0, 2, 9, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  const bob = Math.sin(opt.walk * 10) * 1.2;
  ctx.translate(0, -2 + bob);
  ctx.fillStyle = opt.cloth;
  const lean = Math.sin(opt.heading) * 1.5;
  ctx.beginPath();
  ctx.roundRect(-6 + lean * 0.2, -16, 12, 16, 3);
  ctx.fill();
  ctx.fillStyle = opt.accent;
  ctx.fillRect(-2, -16, 4, 16);
  ctx.fillStyle = opt.skin;
  ctx.beginPath();
  ctx.arc(0, -21, 6.2, 0, Math.PI * 2);
  ctx.fill();
  hair(ctx, opt.hair, opt.accent, "#16100c");
  ctx.fillStyle = "#2A2320";
  ctx.beginPath();
  ctx.arc(-2.2, -21, 1.1, 0, Math.PI * 2);
  ctx.arc(2.2, -21, 1.1, 0, Math.PI * 2);
  ctx.fill();
  if (opt.name) {
    ctx.font = "700 11px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFF6E5";
    ctx.strokeStyle = "#2A2320";
    ctx.lineWidth = 3;
    ctx.strokeText(opt.name, 0, -36);
    ctx.fillText(opt.name, 0, -36);
  }
  ctx.restore();
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string,
  ox: number,
  oy: number,
  place: Place,
) {
  const P = (x: number, y: number) => project(x, y, 0, ox, oy);
  const [x0, y0] = P(0, 0);
  const [x1, y1] = P(w, 0);
  const [x2, y2] = P(w, h);
  const [x3, y3] = P(0, h);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  if (place === "street") {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(...P(5.2, 0));
    ctx.lineTo(...P(8.2, 0));
    ctx.lineTo(...P(8.2, h));
    ctx.lineTo(...P(5.2, h));
    ctx.closePath();
    ctx.fillStyle = "#6b6a68";
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#C8542B";
  for (let i = 0; i < w * h * 1.4; i++) {
    const gx = (i * 1.7) % w;
    const gy = (i * 2.3) % h;
    const [px, py] = P(gx, gy);
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.restore();
}

export function drawWorld(
  ctx: CanvasRenderingContext2D,
  s: GameState,
  cam: { x: number; y: number },
  now: number,
) {
  const w = ctx.canvas.clientWidth || 800;
  const h = ctx.canvas.clientHeight || 450;
  const place = (s.place === "market" || s.place === "lounge" ? "street" : s.place) as "house" | "yard" | "street";
  const map = mapFor(place);
  const [sk0, sk1] = sky(world.minutes);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, sk0);
  g.addColorStop(1, sk1);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const ox = w / 2 - cam.x;
  const oy = h * 0.28 - cam.y;

  drawGround(ctx, map.w, map.h, map.ground, ox, oy, place);

  type Item =
    | { k: number; kind: "box"; box: IsoBox }
    | { k: number; kind: "actor"; who: "player" | NpcId; x: number; y: number };

  const items: Item[] = map.boxes.map((b) => ({
    k: sortKey({ x: b.x, y: b.y, w: b.w, d: b.d, z: b.z }),
    kind: "box",
    box: b,
  }));
  items.push({ k: sortKey({ x: world.pos.x, y: world.pos.y }), kind: "actor", who: "player", x: world.pos.x, y: world.pos.y });
  for (const n of map.npcs) {
    if (n.id === s.character) continue;
    if (!npcHere(n.from, n.to, world.minutes)) continue;
    items.push({ k: sortKey({ x: n.x, y: n.y }), kind: "actor", who: n.id, x: n.x, y: n.y });
  }
  items.sort((a, b) => a.k - b.k);

  const ch = CHARACTERS[s.character as CharacterId];
  for (const it of items) {
    if (it.kind === "box") drawBox(ctx, it.box, ox, oy, now);
    else if (it.who === "player") {
      drawPerson(ctx, {
        x: it.x,
        y: it.y,
        ox,
        oy,
        skin: ch.skin,
        cloth: ch.cloth,
        accent: ch.accent,
        hair: ch.hair,
        walk: world.speed > 0.2 ? now / 180 : 0,
        heading: world.heading,
      });
    } else {
      const n = NPCS[it.who];
      drawPerson(ctx, {
        x: it.x,
        y: it.y,
        ox,
        oy,
        skin: n.skin,
        cloth: n.cloth,
        accent: n.accent,
        hair: n.hair,
        walk: now / 900,
        heading: 0,
        name: n.name.split(" ")[0],
      });
    }
  }

  const tod = timeOfDay(world.minutes);
  if (tod === "night" || tod === "dusk") {
    ctx.fillStyle = tod === "night" ? "rgba(12,14,32,0.46)" : "rgba(40,20,50,0.22)";
    ctx.fillRect(0, 0, w, h);
  }
}

export function cameraOf(_s?: GameState) {
  const [cx, cy] = project(world.pos.x, world.pos.y, 0, 0, 0);
  return { x: cx, y: cy };
}

