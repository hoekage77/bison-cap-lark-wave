import type { CharacterId, Goal, Inventory, Line, Message, NpcId } from "./types";

export const CHARACTERS: Record<
  CharacterId,
  {
    name: string;
    role: Line;
    bio: Line;
    money: number;
    skin: string;
    cloth: string;
    accent: string;
    hair: "braids" | "low" | "hij" | "cap";
    portrait: string;
    hustle: string;
  }
> = {
  ada: {
    name: "Ada",
    role: { en: "Caterer", pg: "Caterer" },
    bio: {
      en: "You cook for naming ceremonies and office lunches. People know your jollof.",
      pg: "You dey cook for naming and office lunch. Your jollof get name.",
    },
    money: 86400,
    skin: "#5a3a26",
    cloth: "#2F7F86",
    accent: "#F2B138",
    hair: "braids",
    portrait: "/art/ada.jpg",
    hustle: "catering",
  },
  tunde: {
    name: "Tunde",
    role: { en: "DJ", pg: "DJ" },
    bio: {
      en: "You live by the night. A good set pays rent. A bad one pays wahala.",
      pg: "Night na your office. Better set go pay house. Bad set go bring wahala.",
    },
    money: 54200,
    skin: "#8a5a3a",
    cloth: "#e9e1cf",
    accent: "#C8542B",
    hair: "low",
    portrait: "/art/tunde.jpg",
    hustle: "dj-set",
  },
  zainab: {
    name: "Zainab",
    role: { en: "Tailor", pg: "Tailor" },
    bio: {
      en: "Your machine is paid off. The next native set could cover the generator.",
      pg: "Machine don free. Next native set fit pay generator.",
    },
    money: 71800,
    skin: "#a56d48",
    cloth: "#1B3A6A",
    accent: "#e8efff",
    hair: "hij",
    portrait: "/art/zainab.jpg",
    hustle: "sew-set",
  },
  terkimbi: {
    name: "Terkimbi",
    role: { en: "Just back home", pg: "Just return" },
    bio: {
      en: "You came back to the family compound. Find a hustle before the money finishes.",
      pg: "You don return compound. Find hustle before the money finish.",
    },
    money: 38500,
    skin: "#6b4430",
    cloth: "#4C9A3F",
    accent: "#F2B138",
    hair: "cap",
    portrait: "/art/terkimbi.jpg",
    hustle: "keke",
  },
};

export const NPCS: Record<
  NpcId,
  {
    name: string;
    role: Line;
    skin: string;
    cloth: string;
    accent: string;
    hair: "braids" | "low" | "hij" | "cap" | "gele";
    portrait: string | null;
  }
> = {
  mama: {
    name: "Mama Ngozi",
    role: { en: "Market woman", pg: "Market woman" },
    skin: "#3e2819",
    cloth: "#E0457B",
    accent: "#F2B138",
    hair: "gele",
    portrait: "/art/mama.jpg",
  },
  ada: {
    name: "Ada",
    role: { en: "Caterer", pg: "Caterer" },
    skin: "#5a3a26",
    cloth: "#2F7F86",
    accent: "#F2B138",
    hair: "braids",
    portrait: "/art/ada.jpg",
  },
  tunde: {
    name: "Tunde",
    role: { en: "DJ", pg: "DJ" },
    skin: "#8a5a3a",
    cloth: "#e9e1cf",
    accent: "#C8542B",
    hair: "low",
    portrait: "/art/tunde.jpg",
  },
  zainab: {
    name: "Zainab",
    role: { en: "Tailor", pg: "Tailor" },
    skin: "#a56d48",
    cloth: "#1B3A6A",
    accent: "#e8efff",
    hair: "hij",
    portrait: "/art/zainab.jpg",
  },
  kola: {
    name: "Kola",
    role: { en: "POS & charging", pg: "POS & charging" },
    skin: "#4a3224",
    cloth: "#9FB3C8",
    accent: "#2A2320",
    hair: "low",
    portrait: null,
  },
  amaka: {
    name: "Amaka",
    role: { en: "Neighbour", pg: "Neighbour" },
    skin: "#7a4a32",
    cloth: "#F2B138",
    accent: "#E0457B",
    hair: "braids",
    portrait: null,
  },
};

export const START_INVENTORY: Inventory = {
  food: 1,
  airtime: 1,
  soap: 1,
  gift: 0,
  stout: 0,
  jollof: 0,
};

export const START_GOALS: Goal[] = [
  { id: "eat", label: { en: "Eat something", pg: "Chop something" }, done: false },
  { id: "out", label: { en: "Go outside", pg: "Comot go outside" }, done: false },
  { id: "talk", label: { en: "Talk to someone", pg: "Yarn with person" }, done: false },
  { id: "scam", label: { en: "Handle a shady alert", pg: "Handle shady alert" }, done: false },
  { id: "hustle", label: { en: "Finish a hustle", pg: "Do one hustle" }, done: false },
  { id: "sleep", label: { en: "Sleep in your own bed", pg: "Sleep for your bed" }, done: false },
];

export const START_MESSAGES: Message[] = [
  {
    id: "fam-1",
    from: "Family group",
    kind: "family",
    unread: true,
    body: {
      en: "You don reach? Eat before you start running around. We dey compound.",
      pg: "You don reach? Chop before you start to dey run up and down. We dey compound.",
    },
    replies: [
      {
        id: "fam-ok",
        label: { en: "I go manage. Love una.", pg: "I go manage. Love una." },
        effect: "family-ok",
      },
    ],
  },
];

export const SHOP: {
  id: keyof Inventory;
  name: Line;
  price: number;
  note: Line;
}[] = [
  {
    id: "food",
    name: { en: "Bread & eggs", pg: "Bread & egg" },
    price: 1200,
    note: { en: "Breakfast that actually fills you.", pg: "Breakfast wey go hold belle." },
  },
  {
    id: "jollof",
    name: { en: "Jollof pack", pg: "Jollof pack" },
    price: 2500,
    note: { en: "Hot, plenty, slightly smoky.", pg: "E hot, e plenty, e get small smoke." },
  },
  {
    id: "airtime",
    name: { en: "Airtime ₦500", pg: "Airtime ₦500" },
    price: 500,
    note: { en: "So the phone does not disgrace you.", pg: "Make phone no disgrace you." },
  },
  {
    id: "soap",
    name: { en: "Scented soap", pg: "Fine soap" },
    price: 800,
    note: { en: "Hygiene is a social skill.", pg: "Clean body na social skill." },
  },
  {
    id: "gift",
    name: { en: "Ankara wrap", pg: "Ankara wrap" },
    price: 6500,
    note: { en: "A gift that says you tried.", pg: "Gift wey show say you try." },
  },
  {
    id: "stout",
    name: { en: "Malt & stout", pg: "Malt & stout" },
    price: 1400,
    note: { en: "For the lounge, or for Amaka.", pg: "For lounge, or for Amaka." },
  },
];

export type Hustle = {
  id: string;
  who: CharacterId[] | "all";
  name: Line;
  blurb: Line;
  pay: number;
  cost: number;
  energy: number;
  minutes: number;
  when: "day" | "night" | "any";
  place?: "lounge" | "market" | "street";
  trust?: { id: string; n: number };
};

export const HUSTLES: Hustle[] = [
  {
    id: "catering",
    who: ["ada"],
    name: { en: "Naming-ceremony rice", pg: "Rice for naming" },
    blurb: {
      en: "Forty packs. You already know the pot.",
      pg: "Forty packs. You don know the pot.",
    },
    pay: 45000,
    cost: 12000,
    energy: 32,
    minutes: 180,
    when: "day",
  },
  {
    id: "dj-set",
    who: ["tunde"],
    name: { en: "Play a set at the lounge", pg: "Play set for lounge" },
    blurb: {
      en: "Doors at nine. Don't play the same amapiano intro twice.",
      pg: "Door go open nine. No play the same amapiano two times.",
    },
    pay: 22000,
    cost: 0,
    energy: 38,
    minutes: 210,
    when: "night",
    place: "lounge",
  },
  {
    id: "sew-set",
    who: ["zainab"],
    name: { en: "Native set commission", pg: "Native set work" },
    blurb: {
      en: "Uncle wants it before Saturday. The gold thread is extra.",
      pg: "Uncle wan am before Saturday. Gold thread na extra.",
    },
    pay: 38000,
    cost: 9000,
    energy: 28,
    minutes: 200,
    when: "day",
  },
  {
    id: "keke",
    who: "all",
    name: { en: "Keke runs till evening", pg: "Keke work till evening" },
    blurb: {
      en: "Three trips across the junction. Dust in your teeth.",
      pg: "Three trip for junction. Dust go enter mouth.",
    },
    pay: 7400,
    cost: 0,
    energy: 22,
    minutes: 120,
    when: "day",
    place: "street",
  },
  {
    id: "pos",
    who: "all",
    name: { en: "Sit with Kola's POS", pg: "Siddon with Kola POS" },
    blurb: {
      en: "Cash-out commission. Watch for fake alerts.",
      pg: "Cash-out commission. Eye the fake alert.",
    },
    pay: 3200,
    cost: 0,
    energy: 10,
    minutes: 70,
    when: "day",
    place: "street",
    trust: { id: "kola", n: 3 },
  },
  {
    id: "help-mama",
    who: "all",
    name: { en: "Help Mama with crates", pg: "Help Mama carry crate" },
    blurb: {
      en: "Heavy, honest, and she will remember.",
      pg: "E heavy, e straight, and she go remember.",
    },
    pay: 6000,
    cost: 0,
    energy: 18,
    minutes: 90,
    when: "day",
    place: "market",
    trust: { id: "mama", n: 5 },
  },
  {
    id: "generator",
    who: ["terkimbi"],
    name: { en: "Fix Amaka's generator", pg: "Repair Amaka generator" },
    blurb: {
      en: "It coughs, then lives. She pays in cash and gossip.",
      pg: "E go cough, then e go start. She go pay cash and gist.",
    },
    pay: 9500,
    cost: 1500,
    energy: 20,
    minutes: 100,
    when: "any",
    trust: { id: "amaka", n: 6 },
  },
];

export const PLACES: Record<string, { name: Line; art?: string; blurb: Line }> = {
  house: {
    name: { en: "Your room", pg: "Your room" },
    blurb: { en: "Bed, stove, a fan that argues.", pg: "Bed, stove, fan wey dey argue." },
  },
  yard: {
    name: { en: "The compound", pg: "Compound" },
    blurb: {
      en: "Zinc, laterite, the smell of somebody's soup.",
      pg: "Zinc, laterite, somebody soup dey smell.",
    },
  },
  street: {
    name: { en: "The street", pg: "Street" },
    art: "/art/street.jpg",
    blurb: { en: "Everybody is going somewhere.", pg: "Everybody dey go somewhere." },
  },
  market: {
    name: { en: "Mama Ngozi's stall", pg: "Mama Ngozi stall" },
    art: "/art/market.jpg",
    blurb: { en: "Price is a conversation.", pg: "Price na conversation." },
  },
  lounge: {
    name: { en: "The lounge", pg: "Lounge" },
    art: "/art/lounge.jpg",
    blurb: { en: "Neon, generators, somebody's chorus.", pg: "Neon, generator, somebody chorus." },
  },
};

export function portraitFor(id: string) {
  if (id in CHARACTERS) return CHARACTERS[id as CharacterId].portrait;
  const n = NPCS[id as NpcId];
  return n?.portrait ?? null;
}
