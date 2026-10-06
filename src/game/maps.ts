import type { IsoBox, MapDef } from "./types";

const C = {
  zn: "#9FB3C8",
  cn: "#C9C5BD",
  wd: "#9a6a3c",
  gr: "#4C9A3F",
  tl: "#2F7F86",
  wall: "#d8d3c8",
  house: "#b88a5a",
  dark: "#222222",
  bed: "#6b4a2b",
};

function box(
  list: IsoBox[],
  x: number,
  y: number,
  w: number,
  d: number,
  h: number,
  c: string,
  extra: Partial<IsoBox> = {},
) {
  list.push({ x, y, w, d, h, c, z: 0, layer: "mid", ...extra });
}

function posts(list: IsoBox[], x: number, y: number, w: number, d: number, h: number) {
  [
    [x, y],
    [x + w, y],
    [x, y + d],
    [x + w, y + d],
  ].forEach(([px, py]) => box(list, px, py, 0.12, 0.12, h, C.wd));
}

export function makeYard(): MapDef {
  const boxes: IsoBox[] = [];
  box(boxes, -0.14, 0, 0.14, 10, 0.6, C.wall, { layer: "back" });
  box(boxes, 0, -0.14, 10, 0.14, 0.6, C.wall, { layer: "back" });

  box(boxes, 0.5, 0.5, 2.2, 1.8, 1.15, C.house);
  box(boxes, 0.4, 0.4, 2.4, 2.0, 0.12, C.zn, { z: 1.15, kind: "roof" });

  posts(boxes, 4.2, 0.4, 3.5, 1.6, 0.7);
  box(boxes, 4.2, 0.4, 3.5, 1.6, 0.9, C.wd, { z: 0.7 });
  box(boxes, 4.1, 0.3, 3.7, 1.8, 0.12, C.zn, { z: 1.6, kind: "roof" });

  box(boxes, 8.55, 0.45, 0.95, 0.95, 0.55, C.cn);
  box(boxes, 8.62, 0.52, 0.8, 0.8, 0.95, "#2a6fd0", { z: 0.55 });
  box(boxes, 8.55, 0.45, 0.12, 0.12, 0.9, C.dark, { z: 0.55 });
  box(boxes, 9.38, 1.28, 0.12, 0.12, 0.9, C.dark, { z: 0.55 });

  box(boxes, 0.45, 3.1, 2.3, 2.2, 0.28, C.cn);
  box(boxes, 0.35, 3.0, 2.5, 2.4, 0.1, C.zn, { z: 1.05, kind: "roof" });
  posts(boxes, 0.35, 3.0, 2.5, 2.4, 1.05);

  box(boxes, 3.3, 2.7, 3.8, 4.6, 0.22, C.cn);
  box(boxes, 3.55, 2.95, 3.3, 4.1, 0.05, C.tl, { z: 0.22, kind: "water" });

  box(boxes, 7.6, 4.2, 2.0, 2.1, 0.28, C.wd);
  box(boxes, 7.5, 4.1, 2.2, 2.3, 0.1, C.zn, { z: 1.05, kind: "roof" });
  posts(boxes, 7.5, 4.1, 2.2, 2.3, 1.05);

  for (let i = 0; i < 4; i++) {
    box(boxes, 0.7 + i * 0.55, 7.15, 0.42, 2.1, 0.16, i % 2 ? "#3f8a35" : C.gr, { kind: "veg" });
  }

  box(boxes, 0, 10, 4.2, 0.14, 0.28, C.wall, { layer: "front" });
  box(boxes, 5.8, 10, 4.2, 0.14, 0.28, C.wall, { layer: "front" });
  box(boxes, 10, 0, 0.14, 10.14, 0.28, C.wall, { layer: "front" });
  box(boxes, 4.1, 10, 0.22, 0.22, 0.9, C.dark, { layer: "front" });
  box(boxes, 5.7, 10, 0.22, 0.22, 0.9, C.dark, { layer: "front" });

  return {
    id: "yard",
    w: 10,
    h: 10,
    spawn: { x: 5, y: 8.4 },
    ground: "#dcc08f",
    boxes,
    blockers: [
      { x: 0.4, y: 0.4, w: 2.4, d: 2.0 },
      { x: 4.1, y: 0.3, w: 3.7, d: 1.8 },
      { x: 8.5, y: 0.45, w: 1.1, d: 1.1 },
      { x: 0.35, y: 3.0, w: 2.5, d: 2.4 },
      { x: 3.4, y: 2.8, w: 3.5, d: 4.2 },
      { x: 7.5, y: 4.1, w: 2.2, d: 2.3 },
    ],
    hotspots: [
      { id: "house", label: { en: "Go inside", pg: "Enter house" }, x: 1.6, y: 2.6, r: 1.4, verb: "enter-house" },
      { id: "wash", label: { en: "Wash up", pg: "Wash body" }, x: 8.9, y: 1.6, r: 1.3, verb: "wash" },
      { id: "out", label: { en: "Go out", pg: "Comot" }, x: 5, y: 9.5, r: 1.5, verb: "go-street" },
    ],
    npcs: [],
  };
}

export function makeHouse(): MapDef {
  const boxes: IsoBox[] = [];
  box(boxes, 0, 0, 8, 0.2, 1.4, C.cn, { layer: "back" });
  box(boxes, 0, 0, 0.2, 8, 1.4, C.cn, { layer: "back" });
  box(boxes, 0.8, 0.7, 2.2, 1.4, 0.45, C.bed);
  box(boxes, 0.7, 0.6, 2.4, 1.6, 0.12, "#5a3a24", { z: 0.45 });
  box(boxes, 5.4, 0.7, 1.6, 1.1, 0.55, "#6a6a6a");
  box(boxes, 5.5, 0.8, 1.4, 0.9, 0.18, "#333", { z: 0.55 });
  box(boxes, 4.8, 3.4, 2.2, 1.5, 0.4, "#c4b7a2");
  box(boxes, 1.2, 4.8, 1.8, 1.2, 0.35, "#3d6b48");
  box(boxes, 0, 8, 3.2, 0.18, 1.1, C.cn, { layer: "front" });
  box(boxes, 4.8, 8, 3.2, 0.18, 1.1, C.cn, { layer: "front" });

  return {
    id: "house",
    w: 8,
    h: 8,
    spawn: { x: 4, y: 6.6 },
    ground: "#e8d7b8",
    boxes,
    blockers: [
      { x: 0.7, y: 0.6, w: 2.4, d: 1.6 },
      { x: 5.4, y: 0.7, w: 1.6, d: 1.1 },
      { x: 4.8, y: 3.4, w: 2.2, d: 1.5 },
      { x: 1.2, y: 4.8, w: 1.8, d: 1.2 },
    ],
    hotspots: [
      { id: "sleep", label: { en: "Sleep", pg: "Sleep" }, x: 1.8, y: 1.5, r: 1.4, verb: "sleep" },
      { id: "cook", label: { en: "Cook / eat", pg: "Cook / chop" }, x: 6.1, y: 1.4, r: 1.3, verb: "eat" },
      { id: "sofa", label: { en: "Sit and rest", pg: "Siddon rest" }, x: 5.8, y: 4.2, r: 1.2, verb: "rest" },
      { id: "door", label: { en: "Go to the yard", pg: "Go yard" }, x: 4, y: 7.5, r: 1.4, verb: "go-yard" },
    ],
    npcs: [],
  };
}

export function makeStreet(): MapDef {
  const boxes: IsoBox[] = [];
  box(boxes, -0.2, -0.2, 14.4, 0.2, 0.5, C.wall, { layer: "back" });
  box(boxes, -0.2, -0.2, 0.2, 12.4, 0.5, C.wall, { layer: "back" });

  box(boxes, 0.4, 0.4, 2.6, 2.0, 1.1, "#c4a574");
  box(boxes, 0.3, 0.3, 2.8, 2.2, 0.12, C.zn, { z: 1.1, kind: "roof" });

  box(boxes, 4.2, 0.3, 3.2, 2.2, 1.2, "#8a5a3a");
  box(boxes, 4.1, 0.2, 3.4, 2.4, 0.14, C.zn, { z: 1.2, kind: "roof" });
  box(boxes, 4.3, 0.25, 3.0, 0.12, 0.08, "#E0457B", { z: 1.34, kind: "neon" });

  box(boxes, 9.2, 0.5, 2.4, 1.8, 0.9, C.cn);
  box(boxes, 9.1, 0.4, 2.6, 2.0, 0.1, C.zn, { z: 0.9, kind: "roof" });

  box(boxes, 11.4, 3.6, 1.6, 1.4, 0.7, "#7a8ea3");
  box(boxes, 11.3, 3.5, 1.8, 1.6, 0.08, C.zn, { z: 0.7, kind: "roof" });

  box(boxes, 0.5, 6.5, 2.0, 1.6, 0.85, "#2F7F86");
  box(boxes, 0.4, 6.4, 2.2, 1.8, 0.1, C.zn, { z: 0.85, kind: "roof" });

  box(boxes, 8.8, 7.2, 2.4, 1.7, 0.7, "#d9c4a0");
  box(boxes, 8.7, 7.1, 2.6, 1.9, 0.1, C.zn, { z: 0.7, kind: "roof" });

  box(boxes, 0, 12, 5.4, 0.16, 0.3, C.wall, { layer: "front" });
  box(boxes, 7.4, 12, 6.6, 0.16, 0.3, C.wall, { layer: "front" });
  box(boxes, 14, 0, 0.16, 12.16, 0.3, C.wall, { layer: "front" });
  box(boxes, 5.4, 12, 0.22, 0.22, 0.85, C.dark, { layer: "front" });
  box(boxes, 7.2, 12, 0.22, 0.22, 0.85, C.dark, { layer: "front" });

  return {
    id: "street",
    w: 14,
    h: 12,
    spawn: { x: 6.4, y: 10.6 },
    ground: "#c9b089",
    boxes,
    blockers: [
      { x: 0.3, y: 0.3, w: 2.8, d: 2.2 },
      { x: 4.1, y: 0.2, w: 3.4, d: 2.4 },
      { x: 9.1, y: 0.4, w: 2.6, d: 2.0 },
      { x: 11.3, y: 3.5, w: 1.8, d: 1.6 },
      { x: 0.4, y: 6.4, w: 2.2, d: 1.8 },
      { x: 8.7, y: 7.1, w: 2.6, d: 1.9 },
    ],
    hotspots: [
      { id: "home", label: { en: "Go home", pg: "Go house" }, x: 6.4, y: 11.4, r: 1.5, verb: "go-yard" },
      { id: "market", label: { en: "Mama's stall", pg: "Mama stall" }, x: 1.7, y: 2.8, r: 1.5, verb: "go-market" },
      { id: "lounge", label: { en: "The lounge", pg: "Lounge" }, x: 5.8, y: 2.8, r: 1.5, verb: "go-lounge" },
      { id: "charge", label: { en: "Kola's kiosk", pg: "Kola kiosk" }, x: 10.4, y: 2.6, r: 1.4, verb: "talk-kola" },
      { id: "tailor", label: { en: "Zainab's shop", pg: "Zainab shop" }, x: 1.5, y: 7.6, r: 1.3, verb: "talk-zainab" },
    ],
    npcs: [
      { id: "mama", x: 1.8, y: 2.9, from: 7 * 60, to: 18 * 60 },
      { id: "amaka", x: 9.8, y: 8.4, from: 8 * 60, to: 21 * 60 },
      { id: "kola", x: 10.5, y: 2.7, from: 8 * 60, to: 20 * 60 },
      { id: "tunde", x: 5.9, y: 2.9, from: 18 * 60, to: 27 * 60 },
      { id: "zainab", x: 1.6, y: 7.5, from: 9 * 60, to: 18 * 60 },
      { id: "ada", x: 8.2, y: 5.4, from: 10 * 60, to: 16 * 60 },
    ],
  };
}

const CACHE: Record<string, MapDef> = {};
export function mapFor(place: "house" | "yard" | "street"): MapDef {
  if (!CACHE[place]) {
    CACHE[place] = place === "house" ? makeHouse() : place === "yard" ? makeYard() : makeStreet();
  }
  return CACHE[place];
}
