export type CharacterId = "ada" | "tunde" | "zainab" | "terkimbi";
export type NpcId = "mama" | "ada" | "tunde" | "zainab" | "kola" | "amaka";
export type Place = "house" | "yard" | "street" | "market" | "lounge";
export type TimeOfDay = "dawn" | "day" | "golden" | "dusk" | "night";
export type PhoneApp =
  | "home"
  | "chat"
  | "bank"
  | "people"
  | "map"
  | "jobs"
  | "goals"
  | "shop"
  | "set";

export type Line = { en: string; pg: string };

export type Needs = {
  hunger: number;
  energy: number;
  hygiene: number;
  mood: number;
};

export type Inventory = {
  food: number;
  airtime: number;
  soap: number;
  gift: number;
  stout: number;
  jollof: number;
};

export type Message = {
  id: string;
  from: string;
  body: Line;
  unread: boolean;
  kind: "family" | "scam" | "hustle" | "friend";
  replies?: { id: string; label: Line; effect: string }[];
  resolved?: boolean;
};

export type BankTx = {
  id: string;
  label: Line;
  amount: number;
  at: string;
};

export type Goal = {
  id: string;
  label: Line;
  done: boolean;
};

export type Toast = {
  id: number;
  text: string;
  tone: "ok" | "good" | "bad" | "warn";
};

export type DialogueChoice = {
  id: string;
  label: Line;
  hint?: Line;
  effect: string;
};

export type Dialogue = {
  npc: NpcId | CharacterId;
  speaker: Line;
  body: Line;
  portrait: string;
  scene?: "market" | "lounge" | "street" | "house";
  choices: DialogueChoice[];
};

export type GameFlags = {
  intro: boolean;
  scamArrived: boolean;
  scamResolved: boolean;
  scamFell: boolean;
  firstOut: boolean;
  debtMama: number;
  debtKola: number;
  playedSet: boolean;
  ateToday: boolean;
  washedToday: boolean;
  sleptOnce: boolean;
  metMama: boolean;
  metAmaka: boolean;
  loungeNight: boolean;
};

export type GameState = {
  version: number;
  character: CharacterId;
  money: number;
  displayMoney: number;
  day: number;
  minutes: number;
  needs: Needs;
  pos: { x: number; y: number };
  heading: number;
  speed: number;
  place: Place;
  inventory: Inventory;
  trust: Record<string, number>;
  streetSmarts: number;
  wahala: number;
  messages: Message[];
  bank: BankTx[];
  goals: Goal[];
  flags: GameFlags;
  settings: {
    pidgin: boolean;
    music: boolean;
    sfx: boolean;
    shake: boolean;
    speed: number;
  };
};

export type IsoBox = {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  c: string;
  z?: number;
  layer?: "back" | "mid" | "front";
  kind?: "water" | "veg" | "roof" | "neon";
};

export type Hotspot = {
  id: string;
  label: Line;
  x: number;
  y: number;
  r: number;
  verb: string;
};

export type MapNpc = {
  id: NpcId;
  x: number;
  y: number;
  from: number;
  to: number;
};

export type MapDef = {
  id: Place;
  w: number;
  h: number;
  spawn: { x: number; y: number };
  ground: string;
  boxes: IsoBox[];
  blockers: { x: number; y: number; w: number; d: number }[];
  hotspots: Hotspot[];
  npcs: MapNpc[];
};
