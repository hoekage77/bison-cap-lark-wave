import { create } from "zustand";
import { CHARACTERS, HUSTLES, NPCS, PLACES, SHOP, type Hustle } from "./content";
import { clock, clamp, naira, timeOfDay, tx, uid } from "./format";
import { hitsBlock } from "./iso";
import { held, moveVector, pointerTarget, setPointerTarget } from "./input";
import { mapFor } from "./maps";
import { syncWorld, world } from "./world";
import { sfx } from "./audio";
import { hasSave, loadSave, newGame, writeSave } from "./save";
import type {
  CharacterId,
  Dialogue,
  GameState,
  Hotspot,
  Inventory,
  Line,
  NpcId,
  PhoneApp,
  Place,
  Toast,
} from "./types";

export type Screen = "title" | "setup" | "play";

type Pass = { label: string; left: number };

type Store = GameState & {
  screen: Screen;
  hydrated: boolean;
  hasSave: boolean;
  phoneOpen: boolean;
  phoneApp: PhoneApp;
  dialogue: Dialogue | null;
  radialNpc: NpcId | null;
  toasts: Toast[];
  pass: Pass | null;
  hotspot: Hotspot | null;
  trauma: number;
  toastId: number;
  saveAt: number;
  hydrate: () => void;
  start: (id: CharacterId) => void;
  continueGame: () => void;
  tick: (dt: number) => void;
  doContext: () => void;
  togglePhone: () => void;
  openApp: (a: PhoneApp) => void;
  pickChoice: (effect: string) => void;
  radial: (action: "talk" | "gift" | "joke" | "borrow") => void;
  doHustle: (id: string) => void;
  buy: (id: keyof Inventory) => void;
  setSetting: <K extends keyof GameState["settings"]>(k: K, v: GameState["settings"][K]) => void;
  closeDialogue: () => void;
};

function walkable(p: Place): p is "house" | "yard" | "street" {
  return p === "house" || p === "yard" || p === "street";
}

function npcHere(from: number, to: number, minutes: number) {
  const m = ((minutes % 1440) + 1440) % 1440;
  if (to <= 1440) return m >= from && m < to;
  return m >= from || m < to - 1440;
}

function stamp(s: GameState) {
  return `Day ${s.day}, ${clock(s.minutes)}`;
}

let toastN = 1;

function pushToast(list: Toast[], text: string, tone: Toast["tone"] = "ok"): Toast[] {
  return [...list.slice(-3), { id: toastN++, text, tone }];
}

function complete(goals: GameState["goals"], id: string) {
  return goals.map((g) => (g.id === id ? { ...g, done: true } : g));
}

function pay(
  s: GameState,
  amount: number,
  label: Line,
): Pick<GameState, "money" | "bank"> {
  return {
    money: s.money + amount,
    bank: [
      {
        id: uid("tx"),
        label,
        amount,
        at: stamp(s),
      },
      ...s.bank,
    ].slice(0, 12),
  };
}

function decayNeeds(n: GameState["needs"], gameHours: number) {
  return {
    hunger: clamp(n.hunger - gameHours * 6.5),
    energy: clamp(n.energy - gameHours * 4.2),
    hygiene: clamp(n.hygiene - gameHours * 3.1),
    mood: clamp(n.mood - gameHours * 2.2),
  };
}

function canHustle(s: GameState, h: Hustle) {
  if (h.who !== "all" && !h.who.includes(s.character)) return false;
  const tod = timeOfDay(s.minutes);
  const night = tod === "night" || tod === "dusk";
  if (h.when === "night" && !night) return false;
  if (h.when === "day" && night) return false;
  if (s.needs.energy < h.energy) return false;
  if (s.money < h.cost) return false;
  if (h.place && s.place !== h.place && !(h.place === "street" && s.place === "street")) {
    if (h.place === "lounge" && s.place !== "lounge") return false;
    if (h.place === "market" && s.place !== "market") return false;
  }
  return true;
}

function talkDialogue(s: GameState, npc: NpcId): Dialogue {
  const info = NPCS[npc];
  const portrait = info.portrait ?? CHARACTERS[s.character].portrait;
  const trust = s.trust[npc] ?? 0;
  const speaker = { en: info.name, pg: info.name };

  if (npc === "mama") {
    return {
      npc,
      speaker,
      portrait: portrait ?? "",
      scene: "market",
      body: {
        en: trust < 20
          ? "Oga, na ₦2,400 for this pan of peppers. You look like you wan bargain me to death."
          : "Ah, my customer. Peppers fresh, fish dey. You go buy or you just come gist?",
        pg: trust < 20
          ? "Oga, na ₦2,400 for this pan pepper. You look like say you wan bargain me to death."
          : "Ah, my customer. Pepper fresh, fish dey. You go buy or you just come gist?",
      },
      choices: [
        {
          id: "hold",
          label: { en: "Hold your price", pg: "Hold your price" },
          hint: { en: "trust −2", pg: "trust −2" },
          effect: "mama-hold",
        },
        {
          id: "disc",
          label: { en: "Ask small discount", pg: "Abeg reduce small" },
          hint: { en: "trust +3, −₦300", pg: "trust +3, −₦300" },
          effect: "mama-disc",
        },
        {
          id: "bundle",
          label: { en: "Offer a bundle deal", pg: "Make we do bundle" },
          hint: { en: "trust +5, buy food", pg: "trust +5, buy food" },
          effect: "mama-bundle",
        },
        {
          id: "leave",
          label: { en: "I go come back", pg: "I go come back" },
          effect: "close",
        },
      ],
    };
  }

  if (npc === "tunde") {
    return {
      npc,
      speaker,
      portrait: portrait ?? "",
      scene: "lounge",
      body: {
        en: "You reached. Tonight this place go packed. You dancing, or you working?",
        pg: "You don reach. Tonight this place go packed. You dey dance, or you dey work?",
      },
      choices: [
        {
          id: "dance",
          label: { en: "Dance a little", pg: "Make I dance small" },
          hint: { en: "mood +18, energy −12", pg: "mood +18, energy −12" },
          effect: "tunde-dance",
        },
        {
          id: "work",
          label: { en: "Ask for a slot", pg: "Ask for slot" },
          hint: { en: "night hustle", pg: "night hustle" },
          effect: "tunde-slot",
        },
        { id: "leave", label: { en: "I just come greet", pg: "I just come greet" }, effect: "close" },
      ],
    };
  }

  if (npc === "zainab") {
    return {
      npc,
      speaker,
      portrait: portrait ?? "",
      scene: "street",
      body: {
        en: "This fabric go match you. I fit sew something for weekend — if your measurement no dey lie.",
        pg: "This fabric go match you. I fit sew something for weekend — if your measurement no dey lie.",
      },
      choices: [
        {
          id: "order",
          label: { en: "Commission a set", pg: "Sew one set" },
          hint: { en: "−₦9,000, mood +10", pg: "−₦9,000, mood +10" },
          effect: "zainab-order",
        },
        {
          id: "chat",
          label: { en: "Just gist", pg: "Make we gist" },
          hint: { en: "trust +4", pg: "trust +4" },
          effect: "zainab-chat",
        },
        { id: "leave", label: { en: "Another day", pg: "Another day" }, effect: "close" },
      ],
    };
  }

  if (npc === "ada") {
    return {
      npc,
      speaker,
      portrait: portrait ?? "",
      scene: "street",
      body: {
        en: "I'm doing rice for a naming tomorrow. If you free, come dish. If you hungry, come chop.",
        pg: "I dey do rice for naming tomorrow. If you free, come dish. If belle dey, come chop.",
      },
      choices: [
        {
          id: "help",
          label: { en: "I'll help you dish", pg: "I go help you dish" },
          hint: { en: "time, ₦8,000", pg: "time, ₦8,000" },
          effect: "ada-help",
        },
        {
          id: "eat",
          label: { en: "Abeg, small plate", pg: "Abeg, small plate" },
          hint: { en: "hunger +40, ₦1,500", pg: "hunger +40, ₦1,500" },
          effect: "ada-plate",
        },
        { id: "leave", label: { en: "I go see you", pg: "I go see you" }, effect: "close" },
      ],
    };
  }

  if (npc === "kola") {
    return {
      npc,
      speaker,
      portrait: CHARACTERS[s.character].portrait,
      scene: "street",
      body: {
        en: s.flags.scamArrived && !s.flags.scamResolved
          ? "That alert wey enter your phone — no be bank. Bank no dey text like yahoo boy."
          : "POS dey. Charging dey. Don't send money to any 'credit alert' wey you no see for app.",
        pg: s.flags.scamArrived && !s.flags.scamResolved
          ? "That alert wey enter your phone — no be bank. Bank no dey text like yahoo boy."
          : "POS dey. Charging dey. No send money to any 'credit alert' wey you no see for app.",
      },
      choices: [
        {
          id: "airtime",
          label: { en: "Buy airtime", pg: "Buy airtime" },
          hint: { en: "−₦500", pg: "−₦500" },
          effect: "kola-airtime",
        },
        {
          id: "pos",
          label: { en: "Sit with the POS", pg: "Siddon with POS" },
          effect: "kola-pos",
        },
        { id: "leave", label: { en: "Later", pg: "Later" }, effect: "close" },
      ],
    };
  }

  return {
    npc,
    speaker,
    portrait: CHARACTERS[s.character].portrait,
    scene: "street",
    body: {
      en: trust > 20
        ? "You this person — come, sit. Generator don do its thing, so gist is free."
        : "Neighbour. You just return? This street no dey carry last.",
      pg: trust > 20
        ? "You this person — come siddon. Generator don do its own, so gist na free."
        : "Neighbour. You just return? This street no dey carry last.",
    },
    choices: [
      {
        id: "gist",
        label: { en: "Gist with her", pg: "Gist with her" },
        hint: { en: "trust +5, mood +8", pg: "trust +5, mood +8" },
        effect: "amaka-gist",
      },
      {
        id: "flirt",
        label: { en: "Throw a compliment", pg: "Yarn one sweet thing" },
        hint: { en: "mood +12", pg: "mood +12" },
        effect: "amaka-flirt",
      },
      { id: "leave", label: { en: "I dey come", pg: "I dey come" }, effect: "close" },
    ],
  };
}

function spawnPlace(place: Place) {
  if (place === "house") return { x: 4, y: 6.6 };
  if (place === "yard") return { x: 5, y: 8.4 };
  return { x: 6.4, y: 10.6 };
}

export const useGame = create<Store>((set, get) => ({
  ...newGame("ada"),
  screen: "title",
  hydrated: false,
  hasSave: false,
  phoneOpen: false,
  phoneApp: "home",
  dialogue: null,
  radialNpc: null,
  toasts: [],
  pass: null,
  hotspot: null,
  trauma: 0,
  toastId: 0,
  saveAt: 0,

  hydrate: () => {
    const saved = typeof window !== "undefined" ? loadSave() : null;
    set({
      hydrated: true,
      hasSave: hasSave(),
      ...(saved ?? {}),
      screen: "title",
      phoneOpen: false,
      dialogue: null,
      radialNpc: null,
      pass: null,
    });
  },

  start: (id) => {
    const g = newGame(id);
    set({
      ...g,
      screen: "play",
      phoneOpen: false,
      dialogue: null,
      toasts: [
        {
          id: toastN++,
          text: tx(
            {
              en: "Your room. Eat, wash, then go and see people.",
              pg: "Your room. Chop, wash, then comot go see people.",
            },
            g.settings.pidgin,
          ),
          tone: "ok",
        },
      ],
    });
    syncWorld(g.pos, 0, 0, g.minutes);
    writeSave(get());
  },

  continueGame: () => {
    const saved = loadSave();
    if (!saved) return;
    set({ ...saved, screen: "play", phoneOpen: false, dialogue: null, pass: null });
    syncWorld(saved.pos, saved.heading, 0, saved.minutes);
  },

  tick: (dt) => {
    const s = get();
    if (s.screen !== "play") return;
    const paused = Boolean(s.dialogue || s.radialNpc || s.phoneOpen || s.pass);
    const next: Partial<Store> = { trauma: Math.max(0, s.trauma - dt * 1.6) };
    world.minutes = s.minutes;
    world.pos = s.pos;

    if (s.pass) {
      const left = s.pass.left - dt;
      next.pass = left <= 0 ? null : { ...s.pass, left };
    }

    const shown = s.displayMoney + (s.money - s.displayMoney) * (1 - Math.exp(-8 * dt));
    next.displayMoney = Math.abs(shown - s.money) < 1 ? s.money : shown;

    if (!paused && walkable(s.place)) {
      const map = mapFor(s.place);
      const { dx, dy, mag } = moveVector();
      let vx = 0;
      let vy = 0;
      const spd = 2.35;
      if (mag > 0.08) {
        vx = dx * spd;
        vy = dy * spd;
        setPointerTarget(null);
      } else if (pointerTarget) {
        const tx0 = pointerTarget.x - s.pos.x;
        const ty0 = pointerTarget.y - s.pos.y;
        const d = Math.hypot(tx0, ty0);
        if (d < 0.12) setPointerTarget(null);
        else {
          vx = (tx0 / d) * spd;
          vy = (ty0 / d) * spd;
        }
      }
      let x = s.pos.x + vx * dt;
      let y = s.pos.y + vy * dt;
      x = clamp(x, 0.45, map.w - 0.45);
      y = clamp(y, 0.45, map.h - 0.45);
      if (hitsBlock(x, s.pos.y, map.blockers)) x = s.pos.x;
      if (hitsBlock(s.pos.x, y, map.blockers)) y = s.pos.y;
      if (hitsBlock(x, y, map.blockers)) {
        x = s.pos.x;
        y = s.pos.y;
      }
      const speed = Math.hypot(vx, vy);
      const heading = speed > 0.1 ? Math.atan2(vx, -vy) : s.heading;
      syncWorld({ x, y }, heading, speed, s.minutes);
      next.pos = { x, y };
      next.speed = speed;
      next.heading = heading;

      const nearNpc = map.npcs.find((n) => {
        if (n.id === s.character) return false;
        if (!npcHere(n.from, n.to, s.minutes)) return false;
        return Math.hypot(n.x - x, n.y - y) < 1.35;
      });
      const hs =
        map.hotspots.find((h) => Math.hypot(h.x - x, h.y - y) < h.r) ?? null;
      if (nearNpc) {
        const name = NPCS[nearNpc.id].name;
        next.hotspot = {
          id: "npc-" + nearNpc.id,
          label: { en: `Talk to ${name}`, pg: `Yarn with ${name}` },
          x: nearNpc.x,
          y: nearNpc.y,
          r: 1.3,
          verb: "talk-" + nearNpc.id,
        };
      } else next.hotspot = hs;
    }

    if (!paused) {
      const gameMin = dt * 4.8 * s.settings.speed;
      let minutes = s.minutes + gameMin;
      let day = s.day;
      let flags = s.flags;
      let needs = decayNeeds(s.needs, gameMin / 60);
      let messages = s.messages;
      let toasts = s.toasts;
      if (minutes >= 1440) {
        minutes -= 1440;
        day += 1;
        flags = { ...flags, ateToday: false, washedToday: false };
        toasts = pushToast(
          toasts,
          tx({ en: `Day ${day}. Another one.`, pg: `Day ${day}. Another one.` }, s.settings.pidgin),
        );
      }
      if (!flags.scamArrived && day >= 1 && minutes >= 11 * 60 + 10) {
        flags = { ...flags, scamArrived: true };
        messages = [
          {
            id: "scam-1",
            from: "Unknown",
            kind: "scam",
            unread: true,
            body: {
              en: "ALERT: ₦350,000 credited. Send the 40 crates now. Bank app is slow.",
              pg: "ALERT: ₦350,000 don enter. Send the 40 crates now. Bank app dey slow.",
            },
            replies: [
              {
                id: "chk",
                label: { en: "Check my Bank app first", pg: "Check Bank app first" },
                effect: "scam-check",
              },
              {
                id: "send",
                label: { en: "Release the crates", pg: "Release the crates" },
                effect: "scam-send",
              },
            ],
          },
          ...messages,
        ];
        toasts = pushToast(
          toasts,
          tx({ en: "New message", pg: "New message" }, s.settings.pidgin),
          "warn",
        );
        sfx.warn();
        next.trauma = 0.45;
      }
      next.minutes = minutes;
      next.day = day;
      world.minutes = minutes;
      next.flags = flags;
      next.needs = needs;
      next.messages = messages;
      next.toasts = toasts;
    }

    if (held.has("KeyE") && !paused) {
      held.delete("KeyE");
      queueMicrotask(() => get().doContext());
    }

    set(next as Store);

    const now = performance.now();
    if (now - s.saveAt > 4000 && s.screen === "play") {
      writeSave({ ...get() });
      set({ saveAt: now });
    }
  },

  doContext: () => {
    const s = get();
    if (s.dialogue || s.radialNpc) return;
    const verb = s.hotspot?.verb;
    if (!verb) {
      set({
        toasts: pushToast(
          s.toasts,
          tx(
            { en: "Walk somewhere. Talk to people.", pg: "Waka go somewhere. Yarn with people." },
            s.settings.pidgin,
          ),
        ),
      });
      return;
    }
    if (verb.startsWith("talk-")) {
      const id = verb.slice(5) as NpcId;
      set({ radialNpc: id, goals: complete(s.goals, "talk") });
      sfx.tap();
      return;
    }
    if (verb === "enter-house" || verb === "go-house") {
      set({ place: "house", pos: spawnPlace("house"), hotspot: null });
      return;
    }
    if (verb === "go-yard") {
      set({
        place: "yard",
        pos: s.place === "street" ? { x: 5, y: 8.6 } : spawnPlace("yard"),
        hotspot: null,
      });
      return;
    }
    if (verb === "go-street") {
      set({
        place: "street",
        pos: spawnPlace("street"),
        hotspot: null,
        flags: { ...s.flags, firstOut: true },
        goals: complete(s.goals, "out"),
        toasts: s.flags.firstOut
          ? s.toasts
          : pushToast(
              s.toasts,
              tx(
                { en: "The street. People first, then money.", pg: "Street. People first, then money." },
                s.settings.pidgin,
              ),
            ),
      });
      sfx.ok();
      return;
    }
    if (verb === "go-market") {
      set({ place: "market", radialNpc: "mama", flags: { ...s.flags, metMama: true } });
      return;
    }
    if (verb === "go-lounge") {
      const tod = timeOfDay(s.minutes);
      if (tod !== "night" && tod !== "dusk") {
        set({
          toasts: pushToast(
            s.toasts,
            tx(
              { en: "Lounge no open till evening.", pg: "Lounge no open till evening." },
              s.settings.pidgin,
            ),
            "warn",
          ),
        });
        return;
      }
      set({ place: "lounge", radialNpc: "tunde", flags: { ...s.flags, loungeNight: true } });
      return;
    }
    if (verb === "sleep") {
      if (s.minutes < 20 * 60 && s.minutes > 5 * 60) {
        set({
          toasts: pushToast(
            s.toasts,
            tx(
              { en: "Too early to sleep. Go and live a little.", pg: "Too early to sleep. Go live small." },
              s.settings.pidgin,
            ),
          ),
        });
        return;
      }
      const day = s.minutes >= 5 * 60 ? s.day + 1 : s.day;
      set({
        pass: { label: tx({ en: "Night passes.", pg: "Night don pass." }, s.settings.pidgin), left: 1.1 },
        day,
        minutes: 7 * 60 + 10,
        needs: {
          hunger: clamp(s.needs.hunger - 18),
          energy: 96,
          hygiene: clamp(s.needs.hygiene - 8),
          mood: clamp(s.needs.mood + 6),
        },
        flags: { ...s.flags, sleptOnce: true, ateToday: false, washedToday: false },
        goals: complete(s.goals, "sleep"),
        toasts: pushToast(
          s.toasts,
          tx({ en: `Day ${day}. You woke in your own bed.`, pg: `Day ${day}. You wake for your bed.` }, s.settings.pidgin),
          "good",
        ),
      });
      return;
    }
    if (verb === "eat") {
      const useJollof = s.inventory.jollof > 0;
      const useFood = s.inventory.food > 0;
      if (!useJollof && !useFood) {
        if (s.money < 1500) {
          set({
            toasts: pushToast(
              s.toasts,
              tx({ en: "No food, no money. Go to the stall.", pg: "No food, no money. Go stall." }, s.settings.pidgin),
              "bad",
            ),
          });
          return;
        }
        const paid = pay(s, -1500, { en: "Quick pot of rice", pg: "Quick pot of rice" });
        set({
          ...paid,
          minutes: s.minutes + 35,
          needs: { ...s.needs, hunger: clamp(s.needs.hunger + 48), mood: clamp(s.needs.mood + 4) },
          flags: { ...s.flags, ateToday: true },
          goals: complete(s.goals, "eat"),
          pass: { label: tx({ en: "You cook.", pg: "You cook." }, s.settings.pidgin), left: 0.7 },
          toasts: pushToast(s.toasts, tx({ en: "Belle full. −₦1,500", pg: "Belle full. −₦1,500" }, s.settings.pidgin), "good"),
        });
        sfx.coin();
        return;
      }
      const inv = { ...s.inventory };
      if (useJollof) inv.jollof -= 1;
      else inv.food -= 1;
      set({
        inventory: inv,
        minutes: s.minutes + 25,
        needs: { ...s.needs, hunger: clamp(s.needs.hunger + (useJollof ? 58 : 42)), mood: clamp(s.needs.mood + 6) },
        flags: { ...s.flags, ateToday: true },
        goals: complete(s.goals, "eat"),
        toasts: pushToast(s.toasts, tx({ en: "You eat. Soft.", pg: "You chop. Soft." }, s.settings.pidgin), "good"),
      });
      return;
    }
    if (verb === "wash") {
      if (s.inventory.soap <= 0 && s.needs.hygiene > 40) {
        set({
          toasts: pushToast(
            s.toasts,
            tx({ en: "Soap don finish. Buy some from the shop.", pg: "Soap don finish. Buy from shop." }, s.settings.pidgin),
            "warn",
          ),
        });
      }
      const inv = { ...s.inventory, soap: Math.max(0, s.inventory.soap - (s.inventory.soap > 0 ? 1 : 0)) };
      set({
        inventory: inv,
        minutes: s.minutes + 20,
        needs: { ...s.needs, hygiene: 100, mood: clamp(s.needs.mood + 4) },
        flags: { ...s.flags, washedToday: true },
        toasts: pushToast(s.toasts, tx({ en: "Fresh. You can face people.", pg: "You don fresh. You fit face people." }, s.settings.pidgin), "good"),
      });
      return;
    }
    if (verb === "rest") {
      set({
        minutes: s.minutes + 40,
        needs: { ...s.needs, energy: clamp(s.needs.energy + 16), mood: clamp(s.needs.mood + 5) },
        pass: { label: tx({ en: "The fan argues. You rest.", pg: "Fan dey argue. You rest." }, s.settings.pidgin), left: 0.8 },
      });
    }
  },

  togglePhone: () => {
    const s = get();
    set({
      phoneOpen: !s.phoneOpen,
      phoneApp: "home",
      messages: s.phoneOpen ? s.messages : s.messages,
    });
    sfx.tap();
  },

  openApp: (a) => set({ phoneApp: a }),

  closeDialogue: () => {
    const s = get();
    const back =
      s.place === "market" || s.place === "lounge"
        ? { place: "street" as const, pos: s.place === "market" ? { x: 1.8, y: 3.2 } : { x: 5.9, y: 3.2 } }
        : {};
    set({ dialogue: null, radialNpc: null, ...back });
  },

  radial: (action) => {
    const s = get();
    const npc = s.radialNpc;
    if (!npc) return;
    if (action === "talk") {
      set({ dialogue: talkDialogue(s, npc), radialNpc: null });
      return;
    }
    if (action === "joke") {
      set({
        radialNpc: null,
        trust: { ...s.trust, [npc]: (s.trust[npc] ?? 0) + 4 },
        needs: { ...s.needs, mood: clamp(s.needs.mood + 10) },
        toasts: pushToast(
          s.toasts,
          tx({ en: `${NPCS[npc].name} laughs. Trust +4`, pg: `${NPCS[npc].name} laugh. Trust +4` }, s.settings.pidgin),
          "good",
        ),
        goals: complete(s.goals, "talk"),
      });
      sfx.ok();
      if (s.place === "market" || s.place === "lounge") set({ place: "street" });
      return;
    }
    if (action === "gift") {
      const kind = s.inventory.gift > 0 ? "gift" : s.inventory.stout > 0 ? "stout" : s.inventory.jollof > 0 ? "jollof" : null;
      if (!kind) {
        set({
          toasts: pushToast(
            s.toasts,
            tx({ en: "You have nothing to give. Shop first.", pg: "You no get anything to give. Go shop." }, s.settings.pidgin),
            "warn",
          ),
        });
        return;
      }
      const inv = { ...s.inventory, [kind]: s.inventory[kind] - 1 };
      set({
        inventory: inv,
        radialNpc: null,
        trust: { ...s.trust, [npc]: (s.trust[npc] ?? 0) + 8 },
        needs: { ...s.needs, mood: clamp(s.needs.mood + 8) },
        toasts: pushToast(
          s.toasts,
          tx({ en: `${NPCS[npc].name} collects it. Trust +8`, pg: `${NPCS[npc].name} collect am. Trust +8` }, s.settings.pidgin),
          "good",
        ),
        goals: complete(s.goals, "talk"),
      });
      sfx.coin();
      if (s.place === "market" || s.place === "lounge") set({ place: "street" });
      return;
    }
    const amount = npc === "mama" ? 8000 : 5000;
    if ((s.trust[npc] ?? 0) < 15) {
      set({
        toasts: pushToast(
          s.toasts,
          tx({ en: "They don't know you like that.", pg: "Dem no know you like that." }, s.settings.pidgin),
          "warn",
        ),
      });
      return;
    }
    const paid = pay(s, amount, { en: `Borrowed from ${NPCS[npc].name}`, pg: `Borrow from ${NPCS[npc].name}` });
    set({
      ...paid,
      radialNpc: null,
      flags: {
        ...s.flags,
        ...(npc === "mama" ? { debtMama: s.flags.debtMama + amount } : { debtKola: s.flags.debtKola + amount }),
      },
      trust: { ...s.trust, [npc]: (s.trust[npc] ?? 0) - 3 },
      toasts: pushToast(
        s.toasts,
        tx({ en: `₦${amount.toLocaleString("en-NG")} in your hand. Don't forget.`, pg: `₦${amount.toLocaleString("en-NG")} for your hand. No forget.` }, s.settings.pidgin),
        "warn",
      ),
    });
    sfx.coin();
    if (s.place === "market" || s.place === "lounge") set({ place: "street" });
  },

  pickChoice: (effect) => {
    const s = get();
    const closeScene =
      s.place === "market" || s.place === "lounge"
        ? { place: "street" as const, pos: s.place === "market" ? { x: 1.8, y: 3.2 } : { x: 5.9, y: 3.2 } }
        : {};

    const done = (patch: Partial<Store>) =>
      set({ dialogue: null, radialNpc: null, ...closeScene, ...patch, goals: complete(patch.goals ?? s.goals, "talk") });

    if (effect === "close") {
      set({ dialogue: null, radialNpc: null, ...closeScene });
      return;
    }
    if (effect === "family-ok") {
      set({
        messages: s.messages.map((m) => (m.id === "fam-1" ? { ...m, unread: false, resolved: true, replies: undefined } : m)),
        needs: { ...s.needs, mood: clamp(s.needs.mood + 6) },
        phoneApp: "chat",
      });
      return;
    }
    if (effect === "scam-check") {
      set({
        messages: s.messages.map((m) =>
          m.id === "scam-1" ? { ...m, unread: false, resolved: true, replies: undefined } : m,
        ),
        flags: { ...s.flags, scamResolved: true },
        streetSmarts: s.streetSmarts + 2,
        goals: complete(s.goals, "scam"),
        toasts: pushToast(
          s.toasts,
          tx({ en: "No credit. Scam blocked. Street smarts +2", pg: "No credit. Scam block. Street smarts +2" }, s.settings.pidgin),
          "good",
        ),
        phoneApp: "chat",
      });
      sfx.ok();
      return;
    }
    if (effect === "scam-send") {
      const loss = Math.min(s.money, 28000);
      const paid = pay(s, -loss, { en: "Goods released to a ghost", pg: "Goods wey ghost collect" });
      set({
        ...paid,
        messages: s.messages.map((m) =>
          m.id === "scam-1" ? { ...m, unread: false, resolved: true, replies: undefined } : m,
        ),
        flags: { ...s.flags, scamResolved: true, scamFell: true },
        wahala: s.wahala + 2,
        needs: { ...s.needs, mood: clamp(s.needs.mood - 22) },
        goals: complete(s.goals, "scam"),
        toasts: pushToast(
          s.toasts,
          tx(
            { en: `No money came. −${naira(loss)} stock. Wahala +1`, pg: `Money no enter. −${naira(loss)} stock. Wahala +1` },
            s.settings.pidgin,
          ),
          "bad",
        ),
        trauma: 0.7,
        phoneApp: "chat",
      });
      sfx.warn();
      return;
    }
    if (effect === "mama-hold") {
      done({
        trust: { ...s.trust, mama: (s.trust.mama ?? 0) - 2 },
        toasts: pushToast(s.toasts, tx({ en: "She sucks her teeth. Trust −2", pg: "She suck teeth. Trust −2" }, s.settings.pidgin), "warn"),
      });
      return;
    }
    if (effect === "mama-disc") {
      const paid = pay(s, -2100, { en: "Peppers, small discount", pg: "Pepper, small discount" });
      done({
        ...paid,
        inventory: { ...s.inventory, food: s.inventory.food + 1 },
        trust: { ...s.trust, mama: (s.trust.mama ?? 0) + 3 },
        toasts: pushToast(s.toasts, tx({ en: "You got the pan. Trust +3", pg: "You get the pan. Trust +3" }, s.settings.pidgin), "good"),
      });
      sfx.coin();
      return;
    }
    if (effect === "mama-bundle") {
      const paid = pay(s, -3800, { en: "Bundle: peppers, fish, tomatoes", pg: "Bundle: pepper, fish, tomato" });
      done({
        ...paid,
        inventory: { ...s.inventory, food: s.inventory.food + 2 },
        trust: { ...s.trust, mama: (s.trust.mama ?? 0) + 5 },
        toasts: pushToast(s.toasts, tx({ en: "Bundle deal. She will remember.", pg: "Bundle deal. She go remember." }, s.settings.pidgin), "good"),
      });
      sfx.coin();
      return;
    }
    if (effect === "tunde-dance") {
      const paid = pay(s, -1800, { en: "Lounge drinks", pg: "Lounge drink" });
      done({
        ...paid,
        minutes: s.minutes + 50,
        needs: { ...s.needs, mood: clamp(s.needs.mood + 18), energy: clamp(s.needs.energy - 12) },
        trust: { ...s.trust, tunde: (s.trust.tunde ?? 0) + 4 },
        toasts: pushToast(s.toasts, tx({ en: "Sweat, neon, a chorus you know.", pg: "Sweat, neon, chorus wey you know." }, s.settings.pidgin), "good"),
      });
      return;
    }
    if (effect === "tunde-slot") {
      done({
        toasts: pushToast(
          s.toasts,
          tx(
            { en: "He nods. Open Jobs on your phone if you ready.", pg: "He nod. Open Jobs for phone if you ready." },
            s.settings.pidgin,
          ),
        ),
        trust: { ...s.trust, tunde: (s.trust.tunde ?? 0) + 3 },
        phoneOpen: s.character === "tunde",
        phoneApp: s.character === "tunde" ? "jobs" : "home",
      });
      return;
    }
    if (effect === "zainab-order") {
      if (s.money < 9000) {
        set({ toasts: pushToast(s.toasts, tx({ en: "That money no dey yet.", pg: "That money no dey yet." }, s.settings.pidgin), "bad") });
        return;
      }
      const paid = pay(s, -9000, { en: "Native set deposit", pg: "Native set deposit" });
      done({
        ...paid,
        needs: { ...s.needs, mood: clamp(s.needs.mood + 10), hygiene: clamp(s.needs.hygiene + 4) },
        trust: { ...s.trust, zainab: (s.trust.zainab ?? 0) + 6 },
        toasts: pushToast(s.toasts, tx({ en: "She takes your size. Saturday go show.", pg: "She take your size. Saturday go show." }, s.settings.pidgin), "good"),
      });
      sfx.coin();
      return;
    }
    if (effect === "zainab-chat") {
      done({
        minutes: s.minutes + 25,
        trust: { ...s.trust, zainab: (s.trust.zainab ?? 0) + 4 },
        needs: { ...s.needs, mood: clamp(s.needs.mood + 7) },
      });
      return;
    }
    if (effect === "ada-help") {
      const paid = pay(s, 8000, { en: "Helped Ada dish rice", pg: "Help Ada dish rice" });
      done({
        ...paid,
        minutes: s.minutes + 90,
        needs: { ...s.needs, energy: clamp(s.needs.energy - 14), hunger: clamp(s.needs.hunger + 10), mood: clamp(s.needs.mood + 6) },
        trust: { ...s.trust, ada: (s.trust.ada ?? 0) + 6 },
        goals: complete(s.goals, "hustle"),
        pass: { label: tx({ en: "You dish until the ice packs sweat.", pg: "You dey dish until ice pack sweat." }, s.settings.pidgin), left: 0.9 },
      });
      sfx.coin();
      return;
    }
    if (effect === "ada-plate") {
      const paid = pay(s, -1500, { en: "Plate from Ada", pg: "Plate from Ada" });
      done({
        ...paid,
        needs: { ...s.needs, hunger: clamp(s.needs.hunger + 40), mood: clamp(s.needs.mood + 6) },
        flags: { ...s.flags, ateToday: true },
        goals: complete(s.goals, "eat"),
      });
      return;
    }
    if (effect === "kola-airtime") {
      if (s.money < 500) return;
      const paid = pay(s, -500, { en: "Airtime", pg: "Airtime" });
      done({ ...paid, inventory: { ...s.inventory, airtime: s.inventory.airtime + 1 } });
      sfx.pos();
      return;
    }
    if (effect === "kola-pos") {
      get().doHustle("pos");
      set({ dialogue: null, radialNpc: null, ...closeScene });
      return;
    }
    if (effect === "amaka-gist") {
      done({
        minutes: s.minutes + 20,
        trust: { ...s.trust, amaka: (s.trust.amaka ?? 0) + 5 },
        needs: { ...s.needs, mood: clamp(s.needs.mood + 8) },
        flags: { ...s.flags, metAmaka: true },
      });
      return;
    }
    if (effect === "amaka-flirt") {
      done({
        trust: { ...s.trust, amaka: (s.trust.amaka ?? 0) + 6 },
        needs: { ...s.needs, mood: clamp(s.needs.mood + 12) },
        flags: { ...s.flags, metAmaka: true },
        toasts: pushToast(
          s.toasts,
          tx({ en: "She smiles sideways. Don't overdo it.", pg: "She smile sideways. No overdo am." }, s.settings.pidgin),
          "good",
        ),
      });
    }
  },

  doHustle: (id) => {
    const s = get();
    const h = HUSTLES.find((x) => x.id === id);
    if (!h) return;
    if (!canHustle(s, h) && !(h.id === "pos" && s.place === "street")) {
      const tod = timeOfDay(s.minutes);
      const night = tod === "night" || tod === "dusk";
      let reason = tx({ en: "Not now.", pg: "No be now." }, s.settings.pidgin);
      if (h.when === "night" && !night) reason = tx({ en: "That one is a night thing.", pg: "That one na night work." }, s.settings.pidgin);
      if (h.when === "day" && night) reason = tx({ en: "Sun don go. Tomorrow.", pg: "Sun don go. Tomorrow." }, s.settings.pidgin);
      if (s.needs.energy < h.energy) reason = tx({ en: "Your body is not agreeing.", pg: "Your body no gree." }, s.settings.pidgin);
      if (s.money < h.cost) reason = tx({ en: "You need materials money first.", pg: "You need materials money first." }, s.settings.pidgin);
      if (h.place === "lounge" && s.place !== "lounge") reason = tx({ en: "Go to the lounge first.", pg: "Go lounge first." }, s.settings.pidgin);
      if (h.place === "market" && s.place !== "market" && s.place !== "street")
        reason = tx({ en: "Pass by the stall.", pg: "Pass by the stall." }, s.settings.pidgin);
      set({ toasts: pushToast(s.toasts, reason, "warn"), phoneOpen: false });
      return;
    }
    const tips = h.id === "dj-set" ? 2000 + Math.floor(Math.random() * 7000) : 0;
    const net = h.pay + tips - h.cost;
    const paid = pay(s, net, h.name);
    const trust = h.trust ? { ...s.trust, [h.trust.id]: (s.trust[h.trust.id] ?? 0) + h.trust.n } : s.trust;
    set({
      ...paid,
      trust,
      minutes: s.minutes + h.minutes,
      needs: {
        ...s.needs,
        energy: clamp(s.needs.energy - h.energy),
        hunger: clamp(s.needs.hunger - 10),
        mood: clamp(s.needs.mood + (h.id === "dj-set" ? 12 : 4)),
      },
      goals: complete(s.goals, "hustle"),
      phoneOpen: false,
      pass: { label: tx({ en: "Time passes.", pg: "Time dey go." }, s.settings.pidgin), left: 1 },
      toasts: pushToast(
        s.toasts,
        `${tx(h.name, s.settings.pidgin)}  +${naira(net)}${tips ? ` (tips ${naira(tips)})` : ""}`,
        "good",
      ),
      flags: h.id === "dj-set" ? { ...s.flags, playedSet: true } : s.flags,
      trauma: 0.25,
    });
    sfx.coin();
  },

  buy: (id) => {
    const s = get();
    const item = SHOP.find((x) => x.id === id);
    if (!item) return;
    if (s.money < item.price) {
      set({ toasts: pushToast(s.toasts, tx({ en: "Balance no reach.", pg: "Balance no reach." }, s.settings.pidgin), "bad") });
      return;
    }
    const paid = pay(s, -item.price, item.name);
    set({
      ...paid,
      inventory: { ...s.inventory, [id]: s.inventory[id] + 1 },
      toasts: pushToast(s.toasts, `${tx(item.name, s.settings.pidgin)}  −${naira(item.price)}`, "ok"),
    });
    sfx.pos();
  },

  setSetting: (k, v) => {
    const s = get();
    set({ settings: { ...s.settings, [k]: v } });
  },
}));

export { canHustle };
