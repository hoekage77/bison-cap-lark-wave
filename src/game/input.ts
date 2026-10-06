export const held = new Set<string>();
export const stick = { x: 0, y: 0 };
export let pointerTarget: { x: number; y: number } | null = null;

const GAME_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "KeyE",
]);

export function setKeys(codes: string[]) {
  held.clear();
  for (const c of codes) held.add(c);
}

export function setPointerTarget(t: { x: number; y: number } | null) {
  pointerTarget = t;
}

export function setStick(x: number, y: number) {
  stick.x = x;
  stick.y = y;
}

export function moveVector() {
  let dx = 0;
  let dy = 0;
  if (held.has("KeyW") || held.has("ArrowUp")) dy -= 1;
  if (held.has("KeyS") || held.has("ArrowDown")) dy += 1;
  if (held.has("KeyA") || held.has("ArrowLeft")) dx -= 1;
  if (held.has("KeyD") || held.has("ArrowRight")) dx += 1;
  dx += stick.x + stick.y;
  dy += stick.y - stick.x;
  const m = Math.hypot(dx, dy);
  if (m > 1) {
    dx /= m;
    dy /= m;
  }
  return { dx, dy, mag: Math.min(1, m) };
}

export function bindInput(el: HTMLElement) {
  const down = (e: KeyboardEvent) => {
    if (GAME_KEYS.has(e.code)) e.preventDefault();
    held.add(e.code);
  };
  const up = (e: KeyboardEvent) => {
    held.delete(e.code);
  };
  const clear = () => held.clear();
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", clear);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
  });
  return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", clear);
  };
}

export function radialDeadzone(x: number, y: number, dz = 0.18) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const scale = (m - dz) / (1 - dz) / m;
  return { x: x * scale, y: y * scale };
}
