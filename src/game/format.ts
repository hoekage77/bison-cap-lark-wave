import type { Line, TimeOfDay } from "./types";

export function tx(line: Line, pidgin: boolean) {
  return pidgin ? line.pg : line.en;
}

export function naira(n: number, tight = false) {
  const sign = n < 0 ? "−" : "";
  const v = Math.abs(Math.round(n));
  if (tight && v >= 1_000_000) {
    const m = v / 1_000_000;
    return `${sign}₦${m >= 10 ? m.toFixed(0) : m.toFixed(m % 1 === 0 ? 0 : 1)}M`;
  }
  if (tight && v >= 10_000) return `${sign}₦${Math.round(v / 1000)}k`;
  return `${sign}₦${v.toLocaleString("en-NG")}`;
}

export function clock(minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const am = h24 < 12;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const pad = min.toString().padStart(2, "0");
  return `${h}:${pad} ${am ? "AM" : "PM"}`;
}

export function timeOfDay(minutes: number): TimeOfDay {
  const h = (((minutes % 1440) + 1440) % 1440) / 60;
  if (h < 5 || h >= 20) return "night";
  if (h < 7) return "dawn";
  if (h < 16) return "day";
  if (h < 18) return "golden";
  return "dusk";
}

export function weatherIcon(tod: TimeOfDay) {
  if (tod === "night") return "moon";
  if (tod === "dusk") return "sunset";
  return "sun";
}

export function clamp(n: number, a = 0, b = 100) {
  return Math.max(a, Math.min(b, n));
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
