import { CHARACTERS, START_GOALS, START_INVENTORY, START_MESSAGES } from "./content";
import type { CharacterId, GameFlags, GameState } from "./types";

export const SAVE_KEY = "makeham-save";
export const SAVE_VERSION = 1;

const FLAGS: GameFlags = {
  intro: false,
  scamArrived: false,
  scamResolved: false,
  scamFell: false,
  firstOut: false,
  debtMama: 0,
  debtKola: 0,
  playedSet: false,
  ateToday: false,
  washedToday: false,
  sleptOnce: false,
  metMama: false,
  metAmaka: false,
  loungeNight: false,
};

export function newGame(character: CharacterId): GameState {
  const ch = CHARACTERS[character];
  return {
    version: SAVE_VERSION,
    character,
    money: ch.money,
    displayMoney: ch.money,
    day: 1,
    minutes: 7 * 60 + 20,
    needs: { hunger: 62, energy: 78, hygiene: 70, mood: 64 },
    pos: { x: 4, y: 6.6 },
    heading: 0,
    speed: 0,
    place: "house",
    inventory: { ...START_INVENTORY },
    trust: { mama: 12, tunde: 10, zainab: 10, ada: 10, kola: 8, amaka: 14 },
    streetSmarts: 4,
    wahala: 0,
    messages: START_MESSAGES.map((m) => ({ ...m })),
    bank: [
      {
        id: "open",
        label: { en: "Opening balance", pg: "Opening balance" },
        amount: ch.money,
        at: "Day 1, 7:20 AM",
      },
    ],
    goals: START_GOALS.map((g) => ({ ...g })),
    flags: { ...FLAGS },
    settings: { pidgin: true, music: true, sfx: true, shake: true, speed: 1 },
  };
}

export function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || parsed.version !== SAVE_VERSION) return null;
    return {
      ...newGame(parsed.character ?? "ada"),
      ...parsed,
      needs: { ...newGame("ada").needs, ...parsed.needs },
      inventory: { ...START_INVENTORY, ...parsed.inventory },
      flags: { ...FLAGS, ...parsed.flags },
      settings: { ...newGame("ada").settings, ...parsed.settings },
    };
  } catch {
    return null;
  }
}

export function writeSave(state: GameState) {
  try {
    const { displayMoney: _d, ...rest } = state;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...rest, version: SAVE_VERSION }));
    localStorage.setItem(SAVE_KEY + ":bak", JSON.stringify({ ...rest, version: SAVE_VERSION }));
  } catch {
    /* private mode */
  }
}

export function hasSave() {
  try {
    return Boolean(localStorage.getItem(SAVE_KEY));
  } catch {
    return false;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* ignore */
  }
}
