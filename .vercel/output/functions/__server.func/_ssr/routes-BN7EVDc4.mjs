import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Droplets, a as Sun, c as ShoppingBag, d as Moon, f as MessageCircle, g as Gift, h as HandCoins, l as Settings, m as Landmark, n as Utensils, o as StickyNote, p as MapPinned, r as Users, s as Smile, t as Zap, u as Phone, v as ChevronLeft, y as Briefcase } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BN7EVDc4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
var musicGain = null;
var sfxGain = null;
var musicTimer = null;
var unlocked = false;
function ac() {
	if (!ctx) {
		ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
		master = ctx.createGain();
		musicGain = ctx.createGain();
		sfxGain = ctx.createGain();
		musicGain.gain.value = .12;
		sfxGain.gain.value = .28;
		musicGain.connect(master);
		sfxGain.connect(master);
		master.connect(ctx.destination);
	}
	return ctx;
}
function unlockAudio() {
	const c = ac();
	if (c.state === "suspended") c.resume();
	unlocked = true;
}
function setBuses(music, sfx, muted = false) {
	if (!master || !musicGain || !sfxGain || !ctx) return;
	const t = ctx.currentTime;
	master.gain.setTargetAtTime(muted ? 0 : 1, t, .04);
	musicGain.gain.setTargetAtTime(music ? .12 : 0, t, .05);
	sfxGain.gain.setTargetAtTime(sfx ? .28 : 0, t, .05);
}
function beep(freq, dur, type, gain = .12, bus = "sfx") {
	if (!unlocked) return;
	const c = ac();
	if (!sfxGain || !musicGain) return;
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = type;
	o.frequency.value = freq;
	g.gain.setValueAtTime(gain, c.currentTime);
	g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + dur);
	o.connect(g);
	g.connect(bus === "music" ? musicGain : sfxGain);
	o.start();
	o.stop(c.currentTime + dur + .02);
}
var sfx = {
	tap: () => beep(520, .05, "triangle", .07),
	coin: () => {
		beep(880, .08, "square", .08);
		setTimeout(() => beep(1320, .1, "square", .06), 70);
	},
	pos: () => beep(1400, .04, "square", .06),
	warn: () => {
		beep(140, .22, "sawtooth", .07);
		beep(110, .3, "sine", .08);
	},
	ok: () => beep(660, .1, "triangle", .08),
	night: () => beep(220, .4, "sine", .04)
};
function startMusic(night) {
	stopMusic();
	if (!unlocked) return;
	const notes = night ? [
		196,
		233,
		262,
		311
	] : [
		262,
		311,
		349,
		392,
		466
	];
	let i = 0;
	const pulse = () => {
		const n = notes[i % notes.length] ?? 262;
		beep(n, night ? .55 : .28, "triangle", .045, "music");
		if (i % 4 === 0) beep(n / 2, .5, "sine", .03, "music");
		i++;
		musicTimer = window.setTimeout(pulse, night ? 620 : 420);
	};
	pulse();
}
function stopMusic() {
	if (musicTimer != null) {
		clearTimeout(musicTimer);
		musicTimer = null;
	}
}
function resumeAudio() {
	if (ctx && ctx.state === "suspended") ctx.resume();
}
var held = /* @__PURE__ */ new Set();
var stick = {
	x: 0,
	y: 0
};
var pointerTarget = null;
var GAME_KEYS = /* @__PURE__ */ new Set([
	"KeyW",
	"KeyA",
	"KeyS",
	"KeyD",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Space",
	"KeyE"
]);
function setKeys(codes) {
	held.clear();
	for (const c of codes) held.add(c);
}
function setPointerTarget(t) {
	pointerTarget = t;
}
function setStick(x, y) {
	stick.x = x;
	stick.y = y;
}
function moveVector() {
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
	return {
		dx,
		dy,
		mag: Math.min(1, m)
	};
}
function bindInput(el) {
	const down = (e) => {
		if (GAME_KEYS.has(e.code)) e.preventDefault();
		held.add(e.code);
	};
	const up = (e) => {
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
function radialDeadzone(x, y, dz = .18) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const scale = (m - dz) / (1 - dz) / m;
	return {
		x: x * scale,
		y: y * scale
	};
}
var CHARACTERS = {
	ada: {
		name: "Ada",
		role: {
			en: "Caterer",
			pg: "Caterer"
		},
		bio: {
			en: "You cook for naming ceremonies and office lunches. People know your jollof.",
			pg: "You dey cook for naming and office lunch. Your jollof get name."
		},
		money: 86400,
		skin: "#5a3a26",
		cloth: "#2F7F86",
		accent: "#F2B138",
		hair: "braids",
		portrait: "/art/ada.jpg",
		hustle: "catering"
	},
	tunde: {
		name: "Tunde",
		role: {
			en: "DJ",
			pg: "DJ"
		},
		bio: {
			en: "You live by the night. A good set pays rent. A bad one pays wahala.",
			pg: "Night na your office. Better set go pay house. Bad set go bring wahala."
		},
		money: 54200,
		skin: "#8a5a3a",
		cloth: "#e9e1cf",
		accent: "#C8542B",
		hair: "low",
		portrait: "/art/tunde.jpg",
		hustle: "dj-set"
	},
	zainab: {
		name: "Zainab",
		role: {
			en: "Tailor",
			pg: "Tailor"
		},
		bio: {
			en: "Your machine is paid off. The next native set could cover the generator.",
			pg: "Machine don free. Next native set fit pay generator."
		},
		money: 71800,
		skin: "#a56d48",
		cloth: "#1B3A6A",
		accent: "#e8efff",
		hair: "hij",
		portrait: "/art/zainab.jpg",
		hustle: "sew-set"
	},
	terkimbi: {
		name: "Terkimbi",
		role: {
			en: "Just back home",
			pg: "Just return"
		},
		bio: {
			en: "You came back to the family compound. Find a hustle before the money finishes.",
			pg: "You don return compound. Find hustle before the money finish."
		},
		money: 38500,
		skin: "#6b4430",
		cloth: "#4C9A3F",
		accent: "#F2B138",
		hair: "cap",
		portrait: "/art/terkimbi.jpg",
		hustle: "keke"
	}
};
var NPCS = {
	mama: {
		name: "Mama Ngozi",
		role: {
			en: "Market woman",
			pg: "Market woman"
		},
		skin: "#3e2819",
		cloth: "#E0457B",
		accent: "#F2B138",
		hair: "gele",
		portrait: "/art/mama.jpg"
	},
	ada: {
		name: "Ada",
		role: {
			en: "Caterer",
			pg: "Caterer"
		},
		skin: "#5a3a26",
		cloth: "#2F7F86",
		accent: "#F2B138",
		hair: "braids",
		portrait: "/art/ada.jpg"
	},
	tunde: {
		name: "Tunde",
		role: {
			en: "DJ",
			pg: "DJ"
		},
		skin: "#8a5a3a",
		cloth: "#e9e1cf",
		accent: "#C8542B",
		hair: "low",
		portrait: "/art/tunde.jpg"
	},
	zainab: {
		name: "Zainab",
		role: {
			en: "Tailor",
			pg: "Tailor"
		},
		skin: "#a56d48",
		cloth: "#1B3A6A",
		accent: "#e8efff",
		hair: "hij",
		portrait: "/art/zainab.jpg"
	},
	kola: {
		name: "Kola",
		role: {
			en: "POS & charging",
			pg: "POS & charging"
		},
		skin: "#4a3224",
		cloth: "#9FB3C8",
		accent: "#2A2320",
		hair: "low",
		portrait: null
	},
	amaka: {
		name: "Amaka",
		role: {
			en: "Neighbour",
			pg: "Neighbour"
		},
		skin: "#7a4a32",
		cloth: "#F2B138",
		accent: "#E0457B",
		hair: "braids",
		portrait: null
	}
};
var START_INVENTORY = {
	food: 1,
	airtime: 1,
	soap: 1,
	gift: 0,
	stout: 0,
	jollof: 0
};
var START_GOALS = [
	{
		id: "eat",
		label: {
			en: "Eat something",
			pg: "Chop something"
		},
		done: false
	},
	{
		id: "out",
		label: {
			en: "Go outside",
			pg: "Comot go outside"
		},
		done: false
	},
	{
		id: "talk",
		label: {
			en: "Talk to someone",
			pg: "Yarn with person"
		},
		done: false
	},
	{
		id: "scam",
		label: {
			en: "Handle a shady alert",
			pg: "Handle shady alert"
		},
		done: false
	},
	{
		id: "hustle",
		label: {
			en: "Finish a hustle",
			pg: "Do one hustle"
		},
		done: false
	},
	{
		id: "sleep",
		label: {
			en: "Sleep in your own bed",
			pg: "Sleep for your bed"
		},
		done: false
	}
];
var START_MESSAGES = [{
	id: "fam-1",
	from: "Family group",
	kind: "family",
	unread: true,
	body: {
		en: "You don reach? Eat before you start running around. We dey compound.",
		pg: "You don reach? Chop before you start to dey run up and down. We dey compound."
	},
	replies: [{
		id: "fam-ok",
		label: {
			en: "I go manage. Love una.",
			pg: "I go manage. Love una."
		},
		effect: "family-ok"
	}]
}];
var SHOP = [
	{
		id: "food",
		name: {
			en: "Bread & eggs",
			pg: "Bread & egg"
		},
		price: 1200,
		note: {
			en: "Breakfast that actually fills you.",
			pg: "Breakfast wey go hold belle."
		}
	},
	{
		id: "jollof",
		name: {
			en: "Jollof pack",
			pg: "Jollof pack"
		},
		price: 2500,
		note: {
			en: "Hot, plenty, slightly smoky.",
			pg: "E hot, e plenty, e get small smoke."
		}
	},
	{
		id: "airtime",
		name: {
			en: "Airtime ₦500",
			pg: "Airtime ₦500"
		},
		price: 500,
		note: {
			en: "So the phone does not disgrace you.",
			pg: "Make phone no disgrace you."
		}
	},
	{
		id: "soap",
		name: {
			en: "Scented soap",
			pg: "Fine soap"
		},
		price: 800,
		note: {
			en: "Hygiene is a social skill.",
			pg: "Clean body na social skill."
		}
	},
	{
		id: "gift",
		name: {
			en: "Ankara wrap",
			pg: "Ankara wrap"
		},
		price: 6500,
		note: {
			en: "A gift that says you tried.",
			pg: "Gift wey show say you try."
		}
	},
	{
		id: "stout",
		name: {
			en: "Malt & stout",
			pg: "Malt & stout"
		},
		price: 1400,
		note: {
			en: "For the lounge, or for Amaka.",
			pg: "For lounge, or for Amaka."
		}
	}
];
var HUSTLES = [
	{
		id: "catering",
		who: ["ada"],
		name: {
			en: "Naming-ceremony rice",
			pg: "Rice for naming"
		},
		blurb: {
			en: "Forty packs. You already know the pot.",
			pg: "Forty packs. You don know the pot."
		},
		pay: 45e3,
		cost: 12e3,
		energy: 32,
		minutes: 180,
		when: "day"
	},
	{
		id: "dj-set",
		who: ["tunde"],
		name: {
			en: "Play a set at the lounge",
			pg: "Play set for lounge"
		},
		blurb: {
			en: "Doors at nine. Don't play the same amapiano intro twice.",
			pg: "Door go open nine. No play the same amapiano two times."
		},
		pay: 22e3,
		cost: 0,
		energy: 38,
		minutes: 210,
		when: "night",
		place: "lounge"
	},
	{
		id: "sew-set",
		who: ["zainab"],
		name: {
			en: "Native set commission",
			pg: "Native set work"
		},
		blurb: {
			en: "Uncle wants it before Saturday. The gold thread is extra.",
			pg: "Uncle wan am before Saturday. Gold thread na extra."
		},
		pay: 38e3,
		cost: 9e3,
		energy: 28,
		minutes: 200,
		when: "day"
	},
	{
		id: "keke",
		who: "all",
		name: {
			en: "Keke runs till evening",
			pg: "Keke work till evening"
		},
		blurb: {
			en: "Three trips across the junction. Dust in your teeth.",
			pg: "Three trip for junction. Dust go enter mouth."
		},
		pay: 7400,
		cost: 0,
		energy: 22,
		minutes: 120,
		when: "day",
		place: "street"
	},
	{
		id: "pos",
		who: "all",
		name: {
			en: "Sit with Kola's POS",
			pg: "Siddon with Kola POS"
		},
		blurb: {
			en: "Cash-out commission. Watch for fake alerts.",
			pg: "Cash-out commission. Eye the fake alert."
		},
		pay: 3200,
		cost: 0,
		energy: 10,
		minutes: 70,
		when: "day",
		place: "street",
		trust: {
			id: "kola",
			n: 3
		}
	},
	{
		id: "help-mama",
		who: "all",
		name: {
			en: "Help Mama with crates",
			pg: "Help Mama carry crate"
		},
		blurb: {
			en: "Heavy, honest, and she will remember.",
			pg: "E heavy, e straight, and she go remember."
		},
		pay: 6e3,
		cost: 0,
		energy: 18,
		minutes: 90,
		when: "day",
		place: "market",
		trust: {
			id: "mama",
			n: 5
		}
	},
	{
		id: "generator",
		who: ["terkimbi"],
		name: {
			en: "Fix Amaka's generator",
			pg: "Repair Amaka generator"
		},
		blurb: {
			en: "It coughs, then lives. She pays in cash and gossip.",
			pg: "E go cough, then e go start. She go pay cash and gist."
		},
		pay: 9500,
		cost: 1500,
		energy: 20,
		minutes: 100,
		when: "any",
		trust: {
			id: "amaka",
			n: 6
		}
	}
];
var PLACES = {
	house: {
		name: {
			en: "Your room",
			pg: "Your room"
		},
		blurb: {
			en: "Bed, stove, a fan that argues.",
			pg: "Bed, stove, fan wey dey argue."
		}
	},
	yard: {
		name: {
			en: "The compound",
			pg: "Compound"
		},
		blurb: {
			en: "Zinc, laterite, the smell of somebody's soup.",
			pg: "Zinc, laterite, somebody soup dey smell."
		}
	},
	street: {
		name: {
			en: "The street",
			pg: "Street"
		},
		art: "/art/street.jpg",
		blurb: {
			en: "Everybody is going somewhere.",
			pg: "Everybody dey go somewhere."
		}
	},
	market: {
		name: {
			en: "Mama Ngozi's stall",
			pg: "Mama Ngozi stall"
		},
		art: "/art/market.jpg",
		blurb: {
			en: "Price is a conversation.",
			pg: "Price na conversation."
		}
	},
	lounge: {
		name: {
			en: "The lounge",
			pg: "Lounge"
		},
		art: "/art/lounge.jpg",
		blurb: {
			en: "Neon, generators, somebody's chorus.",
			pg: "Neon, generator, somebody chorus."
		}
	}
};
var SAVE_KEY = "makeham-save";
var FLAGS = {
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
	loungeNight: false
};
function newGame(character) {
	const ch = CHARACTERS[character];
	return {
		version: 1,
		character,
		money: ch.money,
		displayMoney: ch.money,
		day: 1,
		minutes: 440,
		needs: {
			hunger: 62,
			energy: 78,
			hygiene: 70,
			mood: 64
		},
		pos: {
			x: 4,
			y: 6.6
		},
		heading: 0,
		speed: 0,
		place: "house",
		inventory: { ...START_INVENTORY },
		trust: {
			mama: 12,
			tunde: 10,
			zainab: 10,
			ada: 10,
			kola: 8,
			amaka: 14
		},
		streetSmarts: 4,
		wahala: 0,
		messages: START_MESSAGES.map((m) => ({ ...m })),
		bank: [{
			id: "open",
			label: {
				en: "Opening balance",
				pg: "Opening balance"
			},
			amount: ch.money,
			at: "Day 1, 7:20 AM"
		}],
		goals: START_GOALS.map((g) => ({ ...g })),
		flags: { ...FLAGS },
		settings: {
			pidgin: true,
			music: true,
			sfx: true,
			shake: true,
			speed: 1
		}
	};
}
function loadSave() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || parsed.version !== 1) return null;
		return {
			...newGame(parsed.character ?? "ada"),
			...parsed,
			needs: {
				...newGame("ada").needs,
				...parsed.needs
			},
			inventory: {
				...START_INVENTORY,
				...parsed.inventory
			},
			flags: {
				...FLAGS,
				...parsed.flags
			},
			settings: {
				...newGame("ada").settings,
				...parsed.settings
			}
		};
	} catch {
		return null;
	}
}
function writeSave(state) {
	try {
		const { displayMoney: _d, ...rest } = state;
		localStorage.setItem(SAVE_KEY, JSON.stringify({
			...rest,
			version: 1
		}));
		localStorage.setItem(SAVE_KEY + ":bak", JSON.stringify({
			...rest,
			version: 1
		}));
	} catch {}
}
function hasSave() {
	try {
		return Boolean(localStorage.getItem(SAVE_KEY));
	} catch {
		return false;
	}
}
function tx(line, pidgin) {
	return pidgin ? line.pg : line.en;
}
function naira(n, tight = false) {
	const sign = n < 0 ? "−" : "";
	const v = Math.abs(Math.round(n));
	if (tight && v >= 1e6) {
		const m = v / 1e6;
		return `${sign}₦${m >= 10 ? m.toFixed(0) : m.toFixed(m % 1 === 0 ? 0 : 1)}M`;
	}
	if (tight && v >= 1e4) return `${sign}₦${Math.round(v / 1e3)}k`;
	return `${sign}₦${v.toLocaleString("en-NG")}`;
}
function clock(minutes) {
	const m = (minutes % 1440 + 1440) % 1440;
	const h24 = Math.floor(m / 60);
	const min = m % 60;
	const am = h24 < 12;
	return `${h24 % 12 === 0 ? 12 : h24 % 12}:${min.toString().padStart(2, "0")} ${am ? "AM" : "PM"}`;
}
function timeOfDay(minutes) {
	const h = (minutes % 1440 + 1440) % 1440 / 60;
	if (h < 5 || h >= 20) return "night";
	if (h < 7) return "dawn";
	if (h < 16) return "day";
	if (h < 18) return "golden";
	return "dusk";
}
function weatherIcon(tod) {
	if (tod === "night") return "moon";
	if (tod === "dusk") return "sunset";
	return "sun";
}
function clamp(n, a = 0, b = 100) {
	return Math.max(a, Math.min(b, n));
}
function uid(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
function project(x, y, z = 0, ox = 0, oy = 0) {
	return [ox + (x - y) * 28, oy + (x + y) * 14 - z * 26];
}
function unproject(sx, sy, ox, oy) {
	const a = (sx - ox) / 28;
	const b = (sy - oy) / 14;
	return {
		x: (a + b) / 2,
		y: (b - a) / 2
	};
}
function shade(hex, amt) {
	const n = parseInt(hex.slice(1), 16);
	const k = (v) => Math.max(0, Math.min(255, v + amt));
	const r = k(n >> 16);
	const g = k(n >> 8 & 255);
	const b = k(n & 255);
	return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}
function poly(ctx, pts, fill) {
	ctx.beginPath();
	ctx.moveTo(pts[0][0], pts[0][1]);
	for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
	ctx.closePath();
	ctx.fillStyle = fill;
	ctx.fill();
}
function drawBox(ctx, o, ox, oy, tShift = 0) {
	const z = o.z ?? 0;
	const t = z + o.h;
	const { x, y, w, d, c } = o;
	const P = (px, py, pz) => project(px, py, pz, ox, oy);
	poly(ctx, [
		P(x, y, t),
		P(x + w, y, t),
		P(x + w, y + d, t),
		P(x, y + d, t)
	], c);
	poly(ctx, [
		P(x, y + d, z),
		P(x + w, y + d, z),
		P(x + w, y + d, t),
		P(x, y + d, t)
	], shade(c, -22));
	poly(ctx, [
		P(x + w, y, z),
		P(x + w, y + d, z),
		P(x + w, y + d, t),
		P(x + w, y, t)
	], shade(c, -42));
	if (o.kind === "water") {
		const [cx, cy] = P(x + w * .5, y + d * .5, t);
		ctx.save();
		ctx.globalAlpha = .35;
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
		poly(ctx, [
			P(x, y, t),
			P(x + w, y, t),
			P(x + w, y + d, t),
			P(x, y + d, t)
		], "#E0457B");
		ctx.restore();
	}
}
function sortKey(o) {
	return o.x + (o.w ?? 0) + o.y + (o.d ?? 0) + (o.z ?? 0) * .01;
}
function hitsBlock(x, y, blockers, rad = .28) {
	for (const b of blockers) {
		const nx = Math.max(b.x, Math.min(x, b.x + b.w));
		const ny = Math.max(b.y, Math.min(y, b.y + b.d));
		if (Math.hypot(x - nx, y - ny) < rad) return true;
	}
	return false;
}
var C = {
	zn: "#9FB3C8",
	cn: "#C9C5BD",
	wd: "#9a6a3c",
	gr: "#4C9A3F",
	tl: "#2F7F86",
	wall: "#d8d3c8",
	house: "#b88a5a",
	dark: "#222222",
	bed: "#6b4a2b"
};
function box(list, x, y, w, d, h, c, extra = {}) {
	list.push({
		x,
		y,
		w,
		d,
		h,
		c,
		z: 0,
		layer: "mid",
		...extra
	});
}
function posts(list, x, y, w, d, h) {
	[
		[x, y],
		[x + w, y],
		[x, y + d],
		[x + w, y + d]
	].forEach(([px, py]) => box(list, px, py, .12, .12, h, C.wd));
}
function makeYard() {
	const boxes = [];
	box(boxes, -.14, 0, .14, 10, .6, C.wall, { layer: "back" });
	box(boxes, 0, -.14, 10, .14, .6, C.wall, { layer: "back" });
	box(boxes, .5, .5, 2.2, 1.8, 1.15, C.house);
	box(boxes, .4, .4, 2.4, 2, .12, C.zn, {
		z: 1.15,
		kind: "roof"
	});
	posts(boxes, 4.2, .4, 3.5, 1.6, .7);
	box(boxes, 4.2, .4, 3.5, 1.6, .9, C.wd, { z: .7 });
	box(boxes, 4.1, .3, 3.7, 1.8, .12, C.zn, {
		z: 1.6,
		kind: "roof"
	});
	box(boxes, 8.55, .45, .95, .95, .55, C.cn);
	box(boxes, 8.62, .52, .8, .8, .95, "#2a6fd0", { z: .55 });
	box(boxes, 8.55, .45, .12, .12, .9, C.dark, { z: .55 });
	box(boxes, 9.38, 1.28, .12, .12, .9, C.dark, { z: .55 });
	box(boxes, .45, 3.1, 2.3, 2.2, .28, C.cn);
	box(boxes, .35, 3, 2.5, 2.4, .1, C.zn, {
		z: 1.05,
		kind: "roof"
	});
	posts(boxes, .35, 3, 2.5, 2.4, 1.05);
	box(boxes, 3.3, 2.7, 3.8, 4.6, .22, C.cn);
	box(boxes, 3.55, 2.95, 3.3, 4.1, .05, C.tl, {
		z: .22,
		kind: "water"
	});
	box(boxes, 7.6, 4.2, 2, 2.1, .28, C.wd);
	box(boxes, 7.5, 4.1, 2.2, 2.3, .1, C.zn, {
		z: 1.05,
		kind: "roof"
	});
	posts(boxes, 7.5, 4.1, 2.2, 2.3, 1.05);
	for (let i = 0; i < 4; i++) box(boxes, .7 + i * .55, 7.15, .42, 2.1, .16, i % 2 ? "#3f8a35" : C.gr, { kind: "veg" });
	box(boxes, 0, 10, 4.2, .14, .28, C.wall, { layer: "front" });
	box(boxes, 5.8, 10, 4.2, .14, .28, C.wall, { layer: "front" });
	box(boxes, 10, 0, .14, 10.14, .28, C.wall, { layer: "front" });
	box(boxes, 4.1, 10, .22, .22, .9, C.dark, { layer: "front" });
	box(boxes, 5.7, 10, .22, .22, .9, C.dark, { layer: "front" });
	return {
		id: "yard",
		w: 10,
		h: 10,
		spawn: {
			x: 5,
			y: 8.4
		},
		ground: "#dcc08f",
		boxes,
		blockers: [
			{
				x: .4,
				y: .4,
				w: 2.4,
				d: 2
			},
			{
				x: 4.1,
				y: .3,
				w: 3.7,
				d: 1.8
			},
			{
				x: 8.5,
				y: .45,
				w: 1.1,
				d: 1.1
			},
			{
				x: .35,
				y: 3,
				w: 2.5,
				d: 2.4
			},
			{
				x: 3.4,
				y: 2.8,
				w: 3.5,
				d: 4.2
			},
			{
				x: 7.5,
				y: 4.1,
				w: 2.2,
				d: 2.3
			}
		],
		hotspots: [
			{
				id: "house",
				label: {
					en: "Go inside",
					pg: "Enter house"
				},
				x: 1.6,
				y: 2.6,
				r: 1.4,
				verb: "enter-house"
			},
			{
				id: "wash",
				label: {
					en: "Wash up",
					pg: "Wash body"
				},
				x: 8.9,
				y: 1.6,
				r: 1.3,
				verb: "wash"
			},
			{
				id: "out",
				label: {
					en: "Go out",
					pg: "Comot"
				},
				x: 5,
				y: 9.5,
				r: 1.5,
				verb: "go-street"
			}
		],
		npcs: []
	};
}
function makeHouse() {
	const boxes = [];
	box(boxes, 0, 0, 8, .2, 1.4, C.cn, { layer: "back" });
	box(boxes, 0, 0, .2, 8, 1.4, C.cn, { layer: "back" });
	box(boxes, .8, .7, 2.2, 1.4, .45, C.bed);
	box(boxes, .7, .6, 2.4, 1.6, .12, "#5a3a24", { z: .45 });
	box(boxes, 5.4, .7, 1.6, 1.1, .55, "#6a6a6a");
	box(boxes, 5.5, .8, 1.4, .9, .18, "#333", { z: .55 });
	box(boxes, 4.8, 3.4, 2.2, 1.5, .4, "#c4b7a2");
	box(boxes, 1.2, 4.8, 1.8, 1.2, .35, "#3d6b48");
	box(boxes, 0, 8, 3.2, .18, 1.1, C.cn, { layer: "front" });
	box(boxes, 4.8, 8, 3.2, .18, 1.1, C.cn, { layer: "front" });
	return {
		id: "house",
		w: 8,
		h: 8,
		spawn: {
			x: 4,
			y: 6.6
		},
		ground: "#e8d7b8",
		boxes,
		blockers: [
			{
				x: .7,
				y: .6,
				w: 2.4,
				d: 1.6
			},
			{
				x: 5.4,
				y: .7,
				w: 1.6,
				d: 1.1
			},
			{
				x: 4.8,
				y: 3.4,
				w: 2.2,
				d: 1.5
			},
			{
				x: 1.2,
				y: 4.8,
				w: 1.8,
				d: 1.2
			}
		],
		hotspots: [
			{
				id: "sleep",
				label: {
					en: "Sleep",
					pg: "Sleep"
				},
				x: 1.8,
				y: 1.5,
				r: 1.4,
				verb: "sleep"
			},
			{
				id: "cook",
				label: {
					en: "Cook / eat",
					pg: "Cook / chop"
				},
				x: 6.1,
				y: 1.4,
				r: 1.3,
				verb: "eat"
			},
			{
				id: "sofa",
				label: {
					en: "Sit and rest",
					pg: "Siddon rest"
				},
				x: 5.8,
				y: 4.2,
				r: 1.2,
				verb: "rest"
			},
			{
				id: "door",
				label: {
					en: "Go to the yard",
					pg: "Go yard"
				},
				x: 4,
				y: 7.5,
				r: 1.4,
				verb: "go-yard"
			}
		],
		npcs: []
	};
}
function makeStreet() {
	const boxes = [];
	box(boxes, -.2, -.2, 14.4, .2, .5, C.wall, { layer: "back" });
	box(boxes, -.2, -.2, .2, 12.4, .5, C.wall, { layer: "back" });
	box(boxes, .4, .4, 2.6, 2, 1.1, "#c4a574");
	box(boxes, .3, .3, 2.8, 2.2, .12, C.zn, {
		z: 1.1,
		kind: "roof"
	});
	box(boxes, 4.2, .3, 3.2, 2.2, 1.2, "#8a5a3a");
	box(boxes, 4.1, .2, 3.4, 2.4, .14, C.zn, {
		z: 1.2,
		kind: "roof"
	});
	box(boxes, 4.3, .25, 3, .12, .08, "#E0457B", {
		z: 1.34,
		kind: "neon"
	});
	box(boxes, 9.2, .5, 2.4, 1.8, .9, C.cn);
	box(boxes, 9.1, .4, 2.6, 2, .1, C.zn, {
		z: .9,
		kind: "roof"
	});
	box(boxes, 11.4, 3.6, 1.6, 1.4, .7, "#7a8ea3");
	box(boxes, 11.3, 3.5, 1.8, 1.6, .08, C.zn, {
		z: .7,
		kind: "roof"
	});
	box(boxes, .5, 6.5, 2, 1.6, .85, "#2F7F86");
	box(boxes, .4, 6.4, 2.2, 1.8, .1, C.zn, {
		z: .85,
		kind: "roof"
	});
	box(boxes, 8.8, 7.2, 2.4, 1.7, .7, "#d9c4a0");
	box(boxes, 8.7, 7.1, 2.6, 1.9, .1, C.zn, {
		z: .7,
		kind: "roof"
	});
	box(boxes, 0, 12, 5.4, .16, .3, C.wall, { layer: "front" });
	box(boxes, 7.4, 12, 6.6, .16, .3, C.wall, { layer: "front" });
	box(boxes, 14, 0, .16, 12.16, .3, C.wall, { layer: "front" });
	box(boxes, 5.4, 12, .22, .22, .85, C.dark, { layer: "front" });
	box(boxes, 7.2, 12, .22, .22, .85, C.dark, { layer: "front" });
	return {
		id: "street",
		w: 14,
		h: 12,
		spawn: {
			x: 6.4,
			y: 10.6
		},
		ground: "#c9b089",
		boxes,
		blockers: [
			{
				x: .3,
				y: .3,
				w: 2.8,
				d: 2.2
			},
			{
				x: 4.1,
				y: .2,
				w: 3.4,
				d: 2.4
			},
			{
				x: 9.1,
				y: .4,
				w: 2.6,
				d: 2
			},
			{
				x: 11.3,
				y: 3.5,
				w: 1.8,
				d: 1.6
			},
			{
				x: .4,
				y: 6.4,
				w: 2.2,
				d: 1.8
			},
			{
				x: 8.7,
				y: 7.1,
				w: 2.6,
				d: 1.9
			}
		],
		hotspots: [
			{
				id: "home",
				label: {
					en: "Go home",
					pg: "Go house"
				},
				x: 6.4,
				y: 11.4,
				r: 1.5,
				verb: "go-yard"
			},
			{
				id: "market",
				label: {
					en: "Mama's stall",
					pg: "Mama stall"
				},
				x: 1.7,
				y: 2.8,
				r: 1.5,
				verb: "go-market"
			},
			{
				id: "lounge",
				label: {
					en: "The lounge",
					pg: "Lounge"
				},
				x: 5.8,
				y: 2.8,
				r: 1.5,
				verb: "go-lounge"
			},
			{
				id: "charge",
				label: {
					en: "Kola's kiosk",
					pg: "Kola kiosk"
				},
				x: 10.4,
				y: 2.6,
				r: 1.4,
				verb: "talk-kola"
			},
			{
				id: "tailor",
				label: {
					en: "Zainab's shop",
					pg: "Zainab shop"
				},
				x: 1.5,
				y: 7.6,
				r: 1.3,
				verb: "talk-zainab"
			}
		],
		npcs: [
			{
				id: "mama",
				x: 1.8,
				y: 2.9,
				from: 420,
				to: 1080
			},
			{
				id: "amaka",
				x: 9.8,
				y: 8.4,
				from: 480,
				to: 1260
			},
			{
				id: "kola",
				x: 10.5,
				y: 2.7,
				from: 480,
				to: 1200
			},
			{
				id: "tunde",
				x: 5.9,
				y: 2.9,
				from: 1080,
				to: 1620
			},
			{
				id: "zainab",
				x: 1.6,
				y: 7.5,
				from: 540,
				to: 1080
			},
			{
				id: "ada",
				x: 8.2,
				y: 5.4,
				from: 600,
				to: 960
			}
		]
	};
}
var CACHE = {};
function mapFor(place) {
	if (!CACHE[place]) CACHE[place] = place === "house" ? makeHouse() : place === "yard" ? makeYard() : makeStreet();
	return CACHE[place];
}
var world = {
	pos: {
		x: 4,
		y: 6.6
	},
	heading: 0,
	speed: 0,
	minutes: 440
};
function syncWorld(pos, heading, speed, minutes) {
	world.pos = pos;
	world.heading = heading;
	world.speed = speed;
	if (minutes != null) world.minutes = minutes;
}
function walkable$1(p) {
	return p === "house" || p === "yard" || p === "street";
}
function npcHere$1(from, to, minutes) {
	const m = (minutes % 1440 + 1440) % 1440;
	if (to <= 1440) return m >= from && m < to;
	return m >= from || m < to - 1440;
}
function stamp(s) {
	return `Day ${s.day}, ${clock(s.minutes)}`;
}
var toastN = 1;
function pushToast(list, text, tone = "ok") {
	return [...list.slice(-3), {
		id: toastN++,
		text,
		tone
	}];
}
function complete(goals, id) {
	return goals.map((g) => g.id === id ? {
		...g,
		done: true
	} : g);
}
function pay(s, amount, label) {
	return {
		money: s.money + amount,
		bank: [{
			id: uid("tx"),
			label,
			amount,
			at: stamp(s)
		}, ...s.bank].slice(0, 12)
	};
}
function decayNeeds(n, gameHours) {
	return {
		hunger: clamp(n.hunger - gameHours * 6.5),
		energy: clamp(n.energy - gameHours * 4.2),
		hygiene: clamp(n.hygiene - gameHours * 3.1),
		mood: clamp(n.mood - gameHours * 2.2)
	};
}
function canHustle(s, h) {
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
function talkDialogue(s, npc) {
	const info = NPCS[npc];
	const portrait = info.portrait ?? CHARACTERS[s.character].portrait;
	const trust = s.trust[npc] ?? 0;
	const speaker = {
		en: info.name,
		pg: info.name
	};
	if (npc === "mama") return {
		npc,
		speaker,
		portrait: portrait ?? "",
		scene: "market",
		body: {
			en: trust < 20 ? "Oga, na ₦2,400 for this pan of peppers. You look like you wan bargain me to death." : "Ah, my customer. Peppers fresh, fish dey. You go buy or you just come gist?",
			pg: trust < 20 ? "Oga, na ₦2,400 for this pan pepper. You look like say you wan bargain me to death." : "Ah, my customer. Pepper fresh, fish dey. You go buy or you just come gist?"
		},
		choices: [
			{
				id: "hold",
				label: {
					en: "Hold your price",
					pg: "Hold your price"
				},
				hint: {
					en: "trust −2",
					pg: "trust −2"
				},
				effect: "mama-hold"
			},
			{
				id: "disc",
				label: {
					en: "Ask small discount",
					pg: "Abeg reduce small"
				},
				hint: {
					en: "trust +3, −₦300",
					pg: "trust +3, −₦300"
				},
				effect: "mama-disc"
			},
			{
				id: "bundle",
				label: {
					en: "Offer a bundle deal",
					pg: "Make we do bundle"
				},
				hint: {
					en: "trust +5, buy food",
					pg: "trust +5, buy food"
				},
				effect: "mama-bundle"
			},
			{
				id: "leave",
				label: {
					en: "I go come back",
					pg: "I go come back"
				},
				effect: "close"
			}
		]
	};
	if (npc === "tunde") return {
		npc,
		speaker,
		portrait: portrait ?? "",
		scene: "lounge",
		body: {
			en: "You reached. Tonight this place go packed. You dancing, or you working?",
			pg: "You don reach. Tonight this place go packed. You dey dance, or you dey work?"
		},
		choices: [
			{
				id: "dance",
				label: {
					en: "Dance a little",
					pg: "Make I dance small"
				},
				hint: {
					en: "mood +18, energy −12",
					pg: "mood +18, energy −12"
				},
				effect: "tunde-dance"
			},
			{
				id: "work",
				label: {
					en: "Ask for a slot",
					pg: "Ask for slot"
				},
				hint: {
					en: "night hustle",
					pg: "night hustle"
				},
				effect: "tunde-slot"
			},
			{
				id: "leave",
				label: {
					en: "I just come greet",
					pg: "I just come greet"
				},
				effect: "close"
			}
		]
	};
	if (npc === "zainab") return {
		npc,
		speaker,
		portrait: portrait ?? "",
		scene: "street",
		body: {
			en: "This fabric go match you. I fit sew something for weekend — if your measurement no dey lie.",
			pg: "This fabric go match you. I fit sew something for weekend — if your measurement no dey lie."
		},
		choices: [
			{
				id: "order",
				label: {
					en: "Commission a set",
					pg: "Sew one set"
				},
				hint: {
					en: "−₦9,000, mood +10",
					pg: "−₦9,000, mood +10"
				},
				effect: "zainab-order"
			},
			{
				id: "chat",
				label: {
					en: "Just gist",
					pg: "Make we gist"
				},
				hint: {
					en: "trust +4",
					pg: "trust +4"
				},
				effect: "zainab-chat"
			},
			{
				id: "leave",
				label: {
					en: "Another day",
					pg: "Another day"
				},
				effect: "close"
			}
		]
	};
	if (npc === "ada") return {
		npc,
		speaker,
		portrait: portrait ?? "",
		scene: "street",
		body: {
			en: "I'm doing rice for a naming tomorrow. If you free, come dish. If you hungry, come chop.",
			pg: "I dey do rice for naming tomorrow. If you free, come dish. If belle dey, come chop."
		},
		choices: [
			{
				id: "help",
				label: {
					en: "I'll help you dish",
					pg: "I go help you dish"
				},
				hint: {
					en: "time, ₦8,000",
					pg: "time, ₦8,000"
				},
				effect: "ada-help"
			},
			{
				id: "eat",
				label: {
					en: "Abeg, small plate",
					pg: "Abeg, small plate"
				},
				hint: {
					en: "hunger +40, ₦1,500",
					pg: "hunger +40, ₦1,500"
				},
				effect: "ada-plate"
			},
			{
				id: "leave",
				label: {
					en: "I go see you",
					pg: "I go see you"
				},
				effect: "close"
			}
		]
	};
	if (npc === "kola") return {
		npc,
		speaker,
		portrait: CHARACTERS[s.character].portrait,
		scene: "street",
		body: {
			en: s.flags.scamArrived && !s.flags.scamResolved ? "That alert wey enter your phone — no be bank. Bank no dey text like yahoo boy." : "POS dey. Charging dey. Don't send money to any 'credit alert' wey you no see for app.",
			pg: s.flags.scamArrived && !s.flags.scamResolved ? "That alert wey enter your phone — no be bank. Bank no dey text like yahoo boy." : "POS dey. Charging dey. No send money to any 'credit alert' wey you no see for app."
		},
		choices: [
			{
				id: "airtime",
				label: {
					en: "Buy airtime",
					pg: "Buy airtime"
				},
				hint: {
					en: "−₦500",
					pg: "−₦500"
				},
				effect: "kola-airtime"
			},
			{
				id: "pos",
				label: {
					en: "Sit with the POS",
					pg: "Siddon with POS"
				},
				effect: "kola-pos"
			},
			{
				id: "leave",
				label: {
					en: "Later",
					pg: "Later"
				},
				effect: "close"
			}
		]
	};
	return {
		npc,
		speaker,
		portrait: CHARACTERS[s.character].portrait,
		scene: "street",
		body: {
			en: trust > 20 ? "You this person — come, sit. Generator don do its thing, so gist is free." : "Neighbour. You just return? This street no dey carry last.",
			pg: trust > 20 ? "You this person — come siddon. Generator don do its own, so gist na free." : "Neighbour. You just return? This street no dey carry last."
		},
		choices: [
			{
				id: "gist",
				label: {
					en: "Gist with her",
					pg: "Gist with her"
				},
				hint: {
					en: "trust +5, mood +8",
					pg: "trust +5, mood +8"
				},
				effect: "amaka-gist"
			},
			{
				id: "flirt",
				label: {
					en: "Throw a compliment",
					pg: "Yarn one sweet thing"
				},
				hint: {
					en: "mood +12",
					pg: "mood +12"
				},
				effect: "amaka-flirt"
			},
			{
				id: "leave",
				label: {
					en: "I dey come",
					pg: "I dey come"
				},
				effect: "close"
			}
		]
	};
}
function spawnPlace(place) {
	if (place === "house") return {
		x: 4,
		y: 6.6
	};
	if (place === "yard") return {
		x: 5,
		y: 8.4
	};
	return {
		x: 6.4,
		y: 10.6
	};
}
var useGame = create((set, get) => ({
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
			...saved ?? {},
			screen: "title",
			phoneOpen: false,
			dialogue: null,
			radialNpc: null,
			pass: null
		});
	},
	start: (id) => {
		const g = newGame(id);
		set({
			...g,
			screen: "play",
			phoneOpen: false,
			dialogue: null,
			toasts: [{
				id: toastN++,
				text: tx({
					en: "Your room. Eat, wash, then go and see people.",
					pg: "Your room. Chop, wash, then comot go see people."
				}, g.settings.pidgin),
				tone: "ok"
			}]
		});
		syncWorld(g.pos, 0, 0, g.minutes);
		writeSave(get());
	},
	continueGame: () => {
		const saved = loadSave();
		if (!saved) return;
		set({
			...saved,
			screen: "play",
			phoneOpen: false,
			dialogue: null,
			pass: null
		});
		syncWorld(saved.pos, saved.heading, 0, saved.minutes);
	},
	tick: (dt) => {
		const s = get();
		if (s.screen !== "play") return;
		const paused = Boolean(s.dialogue || s.radialNpc || s.phoneOpen || s.pass);
		const next = { trauma: Math.max(0, s.trauma - dt * 1.6) };
		world.minutes = s.minutes;
		world.pos = s.pos;
		if (s.pass) {
			const left = s.pass.left - dt;
			next.pass = left <= 0 ? null : {
				...s.pass,
				left
			};
		}
		const shown = s.displayMoney + (s.money - s.displayMoney) * (1 - Math.exp(-8 * dt));
		next.displayMoney = Math.abs(shown - s.money) < 1 ? s.money : shown;
		if (!paused && walkable$1(s.place)) {
			const map = mapFor(s.place);
			const { dx, dy, mag } = moveVector();
			let vx = 0;
			let vy = 0;
			const spd = 2.35;
			if (mag > .08) {
				vx = dx * spd;
				vy = dy * spd;
				setPointerTarget(null);
			} else if (pointerTarget) {
				const tx0 = pointerTarget.x - s.pos.x;
				const ty0 = pointerTarget.y - s.pos.y;
				const d = Math.hypot(tx0, ty0);
				if (d < .12) setPointerTarget(null);
				else {
					vx = tx0 / d * spd;
					vy = ty0 / d * spd;
				}
			}
			let x = s.pos.x + vx * dt;
			let y = s.pos.y + vy * dt;
			x = clamp(x, .45, map.w - .45);
			y = clamp(y, .45, map.h - .45);
			if (hitsBlock(x, s.pos.y, map.blockers)) x = s.pos.x;
			if (hitsBlock(s.pos.x, y, map.blockers)) y = s.pos.y;
			if (hitsBlock(x, y, map.blockers)) {
				x = s.pos.x;
				y = s.pos.y;
			}
			const speed = Math.hypot(vx, vy);
			const heading = speed > .1 ? Math.atan2(vx, -vy) : s.heading;
			syncWorld({
				x,
				y
			}, heading, speed, s.minutes);
			next.pos = {
				x,
				y
			};
			next.speed = speed;
			next.heading = heading;
			const nearNpc = map.npcs.find((n) => {
				if (n.id === s.character) return false;
				if (!npcHere$1(n.from, n.to, s.minutes)) return false;
				return Math.hypot(n.x - x, n.y - y) < 1.35;
			});
			const hs = map.hotspots.find((h) => Math.hypot(h.x - x, h.y - y) < h.r) ?? null;
			if (nearNpc) {
				const name = NPCS[nearNpc.id].name;
				next.hotspot = {
					id: "npc-" + nearNpc.id,
					label: {
						en: `Talk to ${name}`,
						pg: `Yarn with ${name}`
					},
					x: nearNpc.x,
					y: nearNpc.y,
					r: 1.3,
					verb: "talk-" + nearNpc.id
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
				flags = {
					...flags,
					ateToday: false,
					washedToday: false
				};
				toasts = pushToast(toasts, tx({
					en: `Day ${day}. Another one.`,
					pg: `Day ${day}. Another one.`
				}, s.settings.pidgin));
			}
			if (!flags.scamArrived && day >= 1 && minutes >= 670) {
				flags = {
					...flags,
					scamArrived: true
				};
				messages = [{
					id: "scam-1",
					from: "Unknown",
					kind: "scam",
					unread: true,
					body: {
						en: "ALERT: ₦350,000 credited. Send the 40 crates now. Bank app is slow.",
						pg: "ALERT: ₦350,000 don enter. Send the 40 crates now. Bank app dey slow."
					},
					replies: [{
						id: "chk",
						label: {
							en: "Check my Bank app first",
							pg: "Check Bank app first"
						},
						effect: "scam-check"
					}, {
						id: "send",
						label: {
							en: "Release the crates",
							pg: "Release the crates"
						},
						effect: "scam-send"
					}]
				}, ...messages];
				toasts = pushToast(toasts, tx({
					en: "New message",
					pg: "New message"
				}, s.settings.pidgin), "warn");
				sfx.warn();
				next.trauma = .45;
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
		set(next);
		const now = performance.now();
		if (now - s.saveAt > 4e3 && s.screen === "play") {
			writeSave({ ...get() });
			set({ saveAt: now });
		}
	},
	doContext: () => {
		const s = get();
		if (s.dialogue || s.radialNpc) return;
		const verb = s.hotspot?.verb;
		if (!verb) {
			set({ toasts: pushToast(s.toasts, tx({
				en: "Walk somewhere. Talk to people.",
				pg: "Waka go somewhere. Yarn with people."
			}, s.settings.pidgin)) });
			return;
		}
		if (verb.startsWith("talk-")) {
			set({
				radialNpc: verb.slice(5),
				goals: complete(s.goals, "talk")
			});
			sfx.tap();
			return;
		}
		if (verb === "enter-house" || verb === "go-house") {
			set({
				place: "house",
				pos: spawnPlace("house"),
				hotspot: null
			});
			return;
		}
		if (verb === "go-yard") {
			set({
				place: "yard",
				pos: s.place === "street" ? {
					x: 5,
					y: 8.6
				} : spawnPlace("yard"),
				hotspot: null
			});
			return;
		}
		if (verb === "go-street") {
			set({
				place: "street",
				pos: spawnPlace("street"),
				hotspot: null,
				flags: {
					...s.flags,
					firstOut: true
				},
				goals: complete(s.goals, "out"),
				toasts: s.flags.firstOut ? s.toasts : pushToast(s.toasts, tx({
					en: "The street. People first, then money.",
					pg: "Street. People first, then money."
				}, s.settings.pidgin))
			});
			sfx.ok();
			return;
		}
		if (verb === "go-market") {
			set({
				place: "market",
				radialNpc: "mama",
				flags: {
					...s.flags,
					metMama: true
				}
			});
			return;
		}
		if (verb === "go-lounge") {
			const tod = timeOfDay(s.minutes);
			if (tod !== "night" && tod !== "dusk") {
				set({ toasts: pushToast(s.toasts, tx({
					en: "Lounge no open till evening.",
					pg: "Lounge no open till evening."
				}, s.settings.pidgin), "warn") });
				return;
			}
			set({
				place: "lounge",
				radialNpc: "tunde",
				flags: {
					...s.flags,
					loungeNight: true
				}
			});
			return;
		}
		if (verb === "sleep") {
			if (s.minutes < 1200 && s.minutes > 300) {
				set({ toasts: pushToast(s.toasts, tx({
					en: "Too early to sleep. Go and live a little.",
					pg: "Too early to sleep. Go live small."
				}, s.settings.pidgin)) });
				return;
			}
			const day = s.minutes >= 300 ? s.day + 1 : s.day;
			set({
				pass: {
					label: tx({
						en: "Night passes.",
						pg: "Night don pass."
					}, s.settings.pidgin),
					left: 1.1
				},
				day,
				minutes: 430,
				needs: {
					hunger: clamp(s.needs.hunger - 18),
					energy: 96,
					hygiene: clamp(s.needs.hygiene - 8),
					mood: clamp(s.needs.mood + 6)
				},
				flags: {
					...s.flags,
					sleptOnce: true,
					ateToday: false,
					washedToday: false
				},
				goals: complete(s.goals, "sleep"),
				toasts: pushToast(s.toasts, tx({
					en: `Day ${day}. You woke in your own bed.`,
					pg: `Day ${day}. You wake for your bed.`
				}, s.settings.pidgin), "good")
			});
			return;
		}
		if (verb === "eat") {
			const useJollof = s.inventory.jollof > 0;
			const useFood = s.inventory.food > 0;
			if (!useJollof && !useFood) {
				if (s.money < 1500) {
					set({ toasts: pushToast(s.toasts, tx({
						en: "No food, no money. Go to the stall.",
						pg: "No food, no money. Go stall."
					}, s.settings.pidgin), "bad") });
					return;
				}
				set({
					...pay(s, -1500, {
						en: "Quick pot of rice",
						pg: "Quick pot of rice"
					}),
					minutes: s.minutes + 35,
					needs: {
						...s.needs,
						hunger: clamp(s.needs.hunger + 48),
						mood: clamp(s.needs.mood + 4)
					},
					flags: {
						...s.flags,
						ateToday: true
					},
					goals: complete(s.goals, "eat"),
					pass: {
						label: tx({
							en: "You cook.",
							pg: "You cook."
						}, s.settings.pidgin),
						left: .7
					},
					toasts: pushToast(s.toasts, tx({
						en: "Belle full. −₦1,500",
						pg: "Belle full. −₦1,500"
					}, s.settings.pidgin), "good")
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
				needs: {
					...s.needs,
					hunger: clamp(s.needs.hunger + (useJollof ? 58 : 42)),
					mood: clamp(s.needs.mood + 6)
				},
				flags: {
					...s.flags,
					ateToday: true
				},
				goals: complete(s.goals, "eat"),
				toasts: pushToast(s.toasts, tx({
					en: "You eat. Soft.",
					pg: "You chop. Soft."
				}, s.settings.pidgin), "good")
			});
			return;
		}
		if (verb === "wash") {
			if (s.inventory.soap <= 0 && s.needs.hygiene > 40) set({ toasts: pushToast(s.toasts, tx({
				en: "Soap don finish. Buy some from the shop.",
				pg: "Soap don finish. Buy from shop."
			}, s.settings.pidgin), "warn") });
			set({
				inventory: {
					...s.inventory,
					soap: Math.max(0, s.inventory.soap - (s.inventory.soap > 0 ? 1 : 0))
				},
				minutes: s.minutes + 20,
				needs: {
					...s.needs,
					hygiene: 100,
					mood: clamp(s.needs.mood + 4)
				},
				flags: {
					...s.flags,
					washedToday: true
				},
				toasts: pushToast(s.toasts, tx({
					en: "Fresh. You can face people.",
					pg: "You don fresh. You fit face people."
				}, s.settings.pidgin), "good")
			});
			return;
		}
		if (verb === "rest") set({
			minutes: s.minutes + 40,
			needs: {
				...s.needs,
				energy: clamp(s.needs.energy + 16),
				mood: clamp(s.needs.mood + 5)
			},
			pass: {
				label: tx({
					en: "The fan argues. You rest.",
					pg: "Fan dey argue. You rest."
				}, s.settings.pidgin),
				left: .8
			}
		});
	},
	togglePhone: () => {
		const s = get();
		set({
			phoneOpen: !s.phoneOpen,
			phoneApp: "home",
			messages: s.phoneOpen ? s.messages : s.messages
		});
		sfx.tap();
	},
	openApp: (a) => set({ phoneApp: a }),
	closeDialogue: () => {
		const s = get();
		set({
			dialogue: null,
			radialNpc: null,
			...s.place === "market" || s.place === "lounge" ? {
				place: "street",
				pos: s.place === "market" ? {
					x: 1.8,
					y: 3.2
				} : {
					x: 5.9,
					y: 3.2
				}
			} : {}
		});
	},
	radial: (action) => {
		const s = get();
		const npc = s.radialNpc;
		if (!npc) return;
		if (action === "talk") {
			set({
				dialogue: talkDialogue(s, npc),
				radialNpc: null
			});
			return;
		}
		if (action === "joke") {
			set({
				radialNpc: null,
				trust: {
					...s.trust,
					[npc]: (s.trust[npc] ?? 0) + 4
				},
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 10)
				},
				toasts: pushToast(s.toasts, tx({
					en: `${NPCS[npc].name} laughs. Trust +4`,
					pg: `${NPCS[npc].name} laugh. Trust +4`
				}, s.settings.pidgin), "good"),
				goals: complete(s.goals, "talk")
			});
			sfx.ok();
			if (s.place === "market" || s.place === "lounge") set({ place: "street" });
			return;
		}
		if (action === "gift") {
			const kind = s.inventory.gift > 0 ? "gift" : s.inventory.stout > 0 ? "stout" : s.inventory.jollof > 0 ? "jollof" : null;
			if (!kind) {
				set({ toasts: pushToast(s.toasts, tx({
					en: "You have nothing to give. Shop first.",
					pg: "You no get anything to give. Go shop."
				}, s.settings.pidgin), "warn") });
				return;
			}
			set({
				inventory: {
					...s.inventory,
					[kind]: s.inventory[kind] - 1
				},
				radialNpc: null,
				trust: {
					...s.trust,
					[npc]: (s.trust[npc] ?? 0) + 8
				},
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 8)
				},
				toasts: pushToast(s.toasts, tx({
					en: `${NPCS[npc].name} collects it. Trust +8`,
					pg: `${NPCS[npc].name} collect am. Trust +8`
				}, s.settings.pidgin), "good"),
				goals: complete(s.goals, "talk")
			});
			sfx.coin();
			if (s.place === "market" || s.place === "lounge") set({ place: "street" });
			return;
		}
		const amount = npc === "mama" ? 8e3 : 5e3;
		if ((s.trust[npc] ?? 0) < 15) {
			set({ toasts: pushToast(s.toasts, tx({
				en: "They don't know you like that.",
				pg: "Dem no know you like that."
			}, s.settings.pidgin), "warn") });
			return;
		}
		set({
			...pay(s, amount, {
				en: `Borrowed from ${NPCS[npc].name}`,
				pg: `Borrow from ${NPCS[npc].name}`
			}),
			radialNpc: null,
			flags: {
				...s.flags,
				...npc === "mama" ? { debtMama: s.flags.debtMama + amount } : { debtKola: s.flags.debtKola + amount }
			},
			trust: {
				...s.trust,
				[npc]: (s.trust[npc] ?? 0) - 3
			},
			toasts: pushToast(s.toasts, tx({
				en: `₦${amount.toLocaleString("en-NG")} in your hand. Don't forget.`,
				pg: `₦${amount.toLocaleString("en-NG")} for your hand. No forget.`
			}, s.settings.pidgin), "warn")
		});
		sfx.coin();
		if (s.place === "market" || s.place === "lounge") set({ place: "street" });
	},
	pickChoice: (effect) => {
		const s = get();
		const closeScene = s.place === "market" || s.place === "lounge" ? {
			place: "street",
			pos: s.place === "market" ? {
				x: 1.8,
				y: 3.2
			} : {
				x: 5.9,
				y: 3.2
			}
		} : {};
		const done = (patch) => set({
			dialogue: null,
			radialNpc: null,
			...closeScene,
			...patch,
			goals: complete(patch.goals ?? s.goals, "talk")
		});
		if (effect === "close") {
			set({
				dialogue: null,
				radialNpc: null,
				...closeScene
			});
			return;
		}
		if (effect === "family-ok") {
			set({
				messages: s.messages.map((m) => m.id === "fam-1" ? {
					...m,
					unread: false,
					resolved: true,
					replies: void 0
				} : m),
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 6)
				},
				phoneApp: "chat"
			});
			return;
		}
		if (effect === "scam-check") {
			set({
				messages: s.messages.map((m) => m.id === "scam-1" ? {
					...m,
					unread: false,
					resolved: true,
					replies: void 0
				} : m),
				flags: {
					...s.flags,
					scamResolved: true
				},
				streetSmarts: s.streetSmarts + 2,
				goals: complete(s.goals, "scam"),
				toasts: pushToast(s.toasts, tx({
					en: "No credit. Scam blocked. Street smarts +2",
					pg: "No credit. Scam block. Street smarts +2"
				}, s.settings.pidgin), "good"),
				phoneApp: "chat"
			});
			sfx.ok();
			return;
		}
		if (effect === "scam-send") {
			const loss = Math.min(s.money, 28e3);
			set({
				...pay(s, -loss, {
					en: "Goods released to a ghost",
					pg: "Goods wey ghost collect"
				}),
				messages: s.messages.map((m) => m.id === "scam-1" ? {
					...m,
					unread: false,
					resolved: true,
					replies: void 0
				} : m),
				flags: {
					...s.flags,
					scamResolved: true,
					scamFell: true
				},
				wahala: s.wahala + 2,
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood - 22)
				},
				goals: complete(s.goals, "scam"),
				toasts: pushToast(s.toasts, tx({
					en: `No money came. −${naira(loss)} stock. Wahala +1`,
					pg: `Money no enter. −${naira(loss)} stock. Wahala +1`
				}, s.settings.pidgin), "bad"),
				trauma: .7,
				phoneApp: "chat"
			});
			sfx.warn();
			return;
		}
		if (effect === "mama-hold") {
			done({
				trust: {
					...s.trust,
					mama: (s.trust.mama ?? 0) - 2
				},
				toasts: pushToast(s.toasts, tx({
					en: "She sucks her teeth. Trust −2",
					pg: "She suck teeth. Trust −2"
				}, s.settings.pidgin), "warn")
			});
			return;
		}
		if (effect === "mama-disc") {
			done({
				...pay(s, -2100, {
					en: "Peppers, small discount",
					pg: "Pepper, small discount"
				}),
				inventory: {
					...s.inventory,
					food: s.inventory.food + 1
				},
				trust: {
					...s.trust,
					mama: (s.trust.mama ?? 0) + 3
				},
				toasts: pushToast(s.toasts, tx({
					en: "You got the pan. Trust +3",
					pg: "You get the pan. Trust +3"
				}, s.settings.pidgin), "good")
			});
			sfx.coin();
			return;
		}
		if (effect === "mama-bundle") {
			done({
				...pay(s, -3800, {
					en: "Bundle: peppers, fish, tomatoes",
					pg: "Bundle: pepper, fish, tomato"
				}),
				inventory: {
					...s.inventory,
					food: s.inventory.food + 2
				},
				trust: {
					...s.trust,
					mama: (s.trust.mama ?? 0) + 5
				},
				toasts: pushToast(s.toasts, tx({
					en: "Bundle deal. She will remember.",
					pg: "Bundle deal. She go remember."
				}, s.settings.pidgin), "good")
			});
			sfx.coin();
			return;
		}
		if (effect === "tunde-dance") {
			done({
				...pay(s, -1800, {
					en: "Lounge drinks",
					pg: "Lounge drink"
				}),
				minutes: s.minutes + 50,
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 18),
					energy: clamp(s.needs.energy - 12)
				},
				trust: {
					...s.trust,
					tunde: (s.trust.tunde ?? 0) + 4
				},
				toasts: pushToast(s.toasts, tx({
					en: "Sweat, neon, a chorus you know.",
					pg: "Sweat, neon, chorus wey you know."
				}, s.settings.pidgin), "good")
			});
			return;
		}
		if (effect === "tunde-slot") {
			done({
				toasts: pushToast(s.toasts, tx({
					en: "He nods. Open Jobs on your phone if you ready.",
					pg: "He nod. Open Jobs for phone if you ready."
				}, s.settings.pidgin)),
				trust: {
					...s.trust,
					tunde: (s.trust.tunde ?? 0) + 3
				},
				phoneOpen: s.character === "tunde",
				phoneApp: s.character === "tunde" ? "jobs" : "home"
			});
			return;
		}
		if (effect === "zainab-order") {
			if (s.money < 9e3) {
				set({ toasts: pushToast(s.toasts, tx({
					en: "That money no dey yet.",
					pg: "That money no dey yet."
				}, s.settings.pidgin), "bad") });
				return;
			}
			done({
				...pay(s, -9e3, {
					en: "Native set deposit",
					pg: "Native set deposit"
				}),
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 10),
					hygiene: clamp(s.needs.hygiene + 4)
				},
				trust: {
					...s.trust,
					zainab: (s.trust.zainab ?? 0) + 6
				},
				toasts: pushToast(s.toasts, tx({
					en: "She takes your size. Saturday go show.",
					pg: "She take your size. Saturday go show."
				}, s.settings.pidgin), "good")
			});
			sfx.coin();
			return;
		}
		if (effect === "zainab-chat") {
			done({
				minutes: s.minutes + 25,
				trust: {
					...s.trust,
					zainab: (s.trust.zainab ?? 0) + 4
				},
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 7)
				}
			});
			return;
		}
		if (effect === "ada-help") {
			done({
				...pay(s, 8e3, {
					en: "Helped Ada dish rice",
					pg: "Help Ada dish rice"
				}),
				minutes: s.minutes + 90,
				needs: {
					...s.needs,
					energy: clamp(s.needs.energy - 14),
					hunger: clamp(s.needs.hunger + 10),
					mood: clamp(s.needs.mood + 6)
				},
				trust: {
					...s.trust,
					ada: (s.trust.ada ?? 0) + 6
				},
				goals: complete(s.goals, "hustle"),
				pass: {
					label: tx({
						en: "You dish until the ice packs sweat.",
						pg: "You dey dish until ice pack sweat."
					}, s.settings.pidgin),
					left: .9
				}
			});
			sfx.coin();
			return;
		}
		if (effect === "ada-plate") {
			done({
				...pay(s, -1500, {
					en: "Plate from Ada",
					pg: "Plate from Ada"
				}),
				needs: {
					...s.needs,
					hunger: clamp(s.needs.hunger + 40),
					mood: clamp(s.needs.mood + 6)
				},
				flags: {
					...s.flags,
					ateToday: true
				},
				goals: complete(s.goals, "eat")
			});
			return;
		}
		if (effect === "kola-airtime") {
			if (s.money < 500) return;
			done({
				...pay(s, -500, {
					en: "Airtime",
					pg: "Airtime"
				}),
				inventory: {
					...s.inventory,
					airtime: s.inventory.airtime + 1
				}
			});
			sfx.pos();
			return;
		}
		if (effect === "kola-pos") {
			get().doHustle("pos");
			set({
				dialogue: null,
				radialNpc: null,
				...closeScene
			});
			return;
		}
		if (effect === "amaka-gist") {
			done({
				minutes: s.minutes + 20,
				trust: {
					...s.trust,
					amaka: (s.trust.amaka ?? 0) + 5
				},
				needs: {
					...s.needs,
					mood: clamp(s.needs.mood + 8)
				},
				flags: {
					...s.flags,
					metAmaka: true
				}
			});
			return;
		}
		if (effect === "amaka-flirt") done({
			trust: {
				...s.trust,
				amaka: (s.trust.amaka ?? 0) + 6
			},
			needs: {
				...s.needs,
				mood: clamp(s.needs.mood + 12)
			},
			flags: {
				...s.flags,
				metAmaka: true
			},
			toasts: pushToast(s.toasts, tx({
				en: "She smiles sideways. Don't overdo it.",
				pg: "She smile sideways. No overdo am."
			}, s.settings.pidgin), "good")
		});
	},
	doHustle: (id) => {
		const s = get();
		const h = HUSTLES.find((x) => x.id === id);
		if (!h) return;
		if (!canHustle(s, h) && !(h.id === "pos" && s.place === "street")) {
			const tod = timeOfDay(s.minutes);
			const night = tod === "night" || tod === "dusk";
			let reason = tx({
				en: "Not now.",
				pg: "No be now."
			}, s.settings.pidgin);
			if (h.when === "night" && !night) reason = tx({
				en: "That one is a night thing.",
				pg: "That one na night work."
			}, s.settings.pidgin);
			if (h.when === "day" && night) reason = tx({
				en: "Sun don go. Tomorrow.",
				pg: "Sun don go. Tomorrow."
			}, s.settings.pidgin);
			if (s.needs.energy < h.energy) reason = tx({
				en: "Your body is not agreeing.",
				pg: "Your body no gree."
			}, s.settings.pidgin);
			if (s.money < h.cost) reason = tx({
				en: "You need materials money first.",
				pg: "You need materials money first."
			}, s.settings.pidgin);
			if (h.place === "lounge" && s.place !== "lounge") reason = tx({
				en: "Go to the lounge first.",
				pg: "Go lounge first."
			}, s.settings.pidgin);
			if (h.place === "market" && s.place !== "market" && s.place !== "street") reason = tx({
				en: "Pass by the stall.",
				pg: "Pass by the stall."
			}, s.settings.pidgin);
			set({
				toasts: pushToast(s.toasts, reason, "warn"),
				phoneOpen: false
			});
			return;
		}
		const tips = h.id === "dj-set" ? 2e3 + Math.floor(Math.random() * 7e3) : 0;
		const net = h.pay + tips - h.cost;
		const paid = pay(s, net, h.name);
		const trust = h.trust ? {
			...s.trust,
			[h.trust.id]: (s.trust[h.trust.id] ?? 0) + h.trust.n
		} : s.trust;
		set({
			...paid,
			trust,
			minutes: s.minutes + h.minutes,
			needs: {
				...s.needs,
				energy: clamp(s.needs.energy - h.energy),
				hunger: clamp(s.needs.hunger - 10),
				mood: clamp(s.needs.mood + (h.id === "dj-set" ? 12 : 4))
			},
			goals: complete(s.goals, "hustle"),
			phoneOpen: false,
			pass: {
				label: tx({
					en: "Time passes.",
					pg: "Time dey go."
				}, s.settings.pidgin),
				left: 1
			},
			toasts: pushToast(s.toasts, `${tx(h.name, s.settings.pidgin)}  +${naira(net)}${tips ? ` (tips ${naira(tips)})` : ""}`, "good"),
			flags: h.id === "dj-set" ? {
				...s.flags,
				playedSet: true
			} : s.flags,
			trauma: .25
		});
		sfx.coin();
	},
	buy: (id) => {
		const s = get();
		const item = SHOP.find((x) => x.id === id);
		if (!item) return;
		if (s.money < item.price) {
			set({ toasts: pushToast(s.toasts, tx({
				en: "Balance no reach.",
				pg: "Balance no reach."
			}, s.settings.pidgin), "bad") });
			return;
		}
		set({
			...pay(s, -item.price, item.name),
			inventory: {
				...s.inventory,
				[id]: s.inventory[id] + 1
			},
			toasts: pushToast(s.toasts, `${tx(item.name, s.settings.pidgin)}  −${naira(item.price)}`, "ok")
		});
		sfx.pos();
	},
	setSetting: (k, v) => {
		set({ settings: {
			...get().settings,
			[k]: v
		} });
	}
}));
function Dialogue() {
	const d = useGame((s) => s.dialogue);
	const pidgin = useGame((s) => s.settings.pidgin);
	const place = useGame((s) => s.place);
	if (!d) return null;
	const art = place === "market" ? "/art/market.jpg" : place === "lounge" ? "/art/lounge.jpg" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col justify-end",
		children: [
			art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: art,
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto w-full max-w-lg px-4 pb-[max(16px,env(safe-area-inset-bottom))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-end gap-3",
					children: [d.portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: d.portrait,
						alt: "",
						className: "size-20 rounded-2xl border-2 border-ink object-cover shadow-[0_6px_0_#2A2320] sm:size-24"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 rounded-2xl border-2 border-ink bg-gold/40 px-3 py-2 text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "font-display",
							children: tx(d.speaker, pidgin)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-pretty text-sm leading-snug",
							children: tx(d.body, pidgin)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2 pb-3",
					children: d.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-cream px-3 py-2.5 text-left font-bold text-ink",
						onClick: () => useGame.getState().pickChoice(c.effect),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tx(c.label, pidgin) }), c.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
							className: "shrink-0 text-mute",
							children: tx(c.hint, pidgin)
						}) : null]
					}, c.id))
				})]
			})
		]
	});
}
function Joystick() {
	const wrap = (0, import_react.useRef)(null);
	const pid = (0, import_react.useRef)(null);
	const apply = (e) => {
		const el = wrap.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const cx = r.left + r.width / 2;
		const cy = r.top + r.height / 2;
		const v = radialDeadzone((e.clientX - cx) / (r.width / 2), (e.clientY - cy) / (r.height / 2));
		const m = Math.hypot(v.x, v.y);
		const k = m > 1 ? 1 / m : 1;
		setStick(v.x * k, v.y * k);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrap,
		className: "relative size-24 rounded-full border-2 border-ink/40 bg-cream/40 touch-none",
		onPointerDown: (e) => {
			pid.current = e.pointerId;
			e.currentTarget.setPointerCapture(e.pointerId);
			apply(e);
		},
		onPointerMove: (e) => {
			if (pid.current !== e.pointerId) return;
			apply(e);
		},
		onPointerUp: (e) => {
			if (pid.current !== e.pointerId) return;
			pid.current = null;
			setStick(0, 0);
		},
		onPointerCancel: () => {
			pid.current = null;
			setStick(0, 0);
		},
		"aria-label": "Move",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/70" })
	});
}
function Ring({ color, p, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("i", {
		className: "relative grid size-10 place-items-center rounded-full not-italic sm:size-11",
		style: { background: `conic-gradient(${color} ${Math.max(0, Math.min(100, p))}%, #2A232022 0)` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-[5px] rounded-full bg-cream" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "relative text-ink",
			children
		})]
	});
}
function Hud() {
	const s = useGame();
	const ch = CHARACTERS[s.character];
	const weather = weatherIcon(timeOfDay(s.minutes));
	const unread = s.messages.some((m) => m.unread);
	const label = s.hotspot ? tx(s.hotspot.label, s.settings.pidgin) : tx({
		en: "Look around",
		pg: "Look around"
	}, s.settings.pidgin);
	const placeName = s.place === "house" ? tx({
		en: "Home",
		pg: "House"
	}, s.settings.pidgin) : s.place === "yard" ? tx({
		en: "Compound",
		pg: "Compound"
	}, s.settings.pidgin) : s.place === "street" ? tx({
		en: "Street",
		pg: "Street"
	}, s.settings.pidgin) : s.place === "market" ? tx({
		en: "Market",
		pg: "Market"
	}, s.settings.pidgin) : tx({
		en: "Lounge",
		pg: "Lounge"
	}, s.settings.pidgin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute inset-0 z-10 p-[max(10px,env(safe-area-inset-top))] pb-[max(10px,env(safe-area-inset-bottom))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto hud-card absolute left-3 top-3 flex items-center gap-2 px-2 py-1.5 sm:left-4 sm:top-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: ch.portrait,
					alt: "",
					className: "size-11 rounded-full border-2 border-ink object-cover sm:size-12"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
							color: "#C8542B",
							p: s.needs.hunger,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, {
								className: "size-3.5",
								strokeWidth: 2.4
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
							color: "#F2B138",
							p: s.needs.energy,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
								className: "size-3.5",
								strokeWidth: 2.4
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
							color: "#2F7F86",
							p: s.needs.hygiene,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, {
								className: "size-3.5",
								strokeWidth: 2.4
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ring, {
							color: "#E0457B",
							p: s.needs.mood,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, {
								className: "size-3.5",
								strokeWidth: 2.4
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-auto hud-card absolute right-3 top-3 px-3 py-1.5 text-right sm:right-4 sm:top-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "font-display block text-lg leading-none text-gold tabular-nums sm:text-xl",
						children: naira(Math.round(s.displayMoney), true)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 flex items-center justify-end gap-1 text-xs text-mute",
						children: [
							"Day ",
							s.day,
							", ",
							clock(s.minutes),
							weather === "moon" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-3.5" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-bold text-ink/70",
						children: placeName
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute bottom-4 left-3 sm:bottom-5 sm:left-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Joystick, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute bottom-5 left-1/2 -translate-x-1/2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "press-btn relative bg-gold px-5 py-2.5 text-base",
					onClick: () => useGame.getState().togglePhone(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), "Phone"]
					}), unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -right-1 -top-1 size-3 rounded-full bg-neon" }) : null]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto absolute bottom-5 right-3 sm:right-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "press-btn bg-farm px-5 py-3 text-lg text-cream sm:px-6",
					onClick: () => useGame.getState().doContext(),
					children: label
				})
			})
		]
	});
}
var APPS = [
	{
		id: "chat",
		label: "Chat",
		icon: MessageCircle
	},
	{
		id: "bank",
		label: "Bank",
		icon: Landmark
	},
	{
		id: "people",
		label: "People",
		icon: Users
	},
	{
		id: "map",
		label: "Map",
		icon: MapPinned
	},
	{
		id: "jobs",
		label: "Jobs",
		icon: Briefcase
	},
	{
		id: "goals",
		label: "Goals",
		icon: StickyNote
	},
	{
		id: "shop",
		label: "Shop",
		icon: ShoppingBag
	},
	{
		id: "set",
		label: "Set",
		icon: Settings
	}
];
function Phone$1() {
	const open = useGame((s) => s.phoneOpen);
	const app = useGame((s) => s.phoneApp);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-[5.5rem] right-3 z-20 flex h-[min(72vh,520px)] w-[min(92vw,320px)] flex-col overflow-hidden rounded-[28px] border-[3px] border-ink bg-night p-3 text-cream shadow-[0_12px_40px_#0006] sm:right-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between text-[11px] text-cream/70",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "9:41" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MakeHam" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LTE" })
			]
		}), app === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeGrid, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBody, {})]
	});
}
function HomeGrid() {
	const messages = useGame((s) => s.messages);
	const pidgin = useGame((s) => s.settings.pidgin);
	const unread = messages.find((m) => m.unread);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-4 gap-2 text-center",
			children: APPS.map((a) => {
				const Icon = a.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-2xl bg-cream/10 py-2 text-[11px] leading-tight text-cream",
					onClick: () => useGame.getState().openApp(a.id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mx-auto mb-1 size-5" }), a.label]
				}, a.id);
			})
		}), unread ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "mt-auto rounded-2xl bg-neon p-3 text-left text-sm text-cream",
			onClick: () => useGame.getState().openApp("chat"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tx({
				en: "New message",
				pg: "New message"
			}, pidgin) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-cream/90",
				children: [
					unread.from,
					": ",
					tx(unread.body, pidgin).slice(0, 42),
					"…"
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-auto text-xs text-cream/50",
			children: tx({
				en: "No new alerts. That's a good day.",
				pg: "No new alert. Na good day."
			}, pidgin)
		})]
	});
}
function Back() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "mb-2 inline-flex items-center gap-1 text-sm text-gold",
		onClick: () => useGame.getState().openApp("home"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Back"]
	});
}
function AppBody() {
	const app = useGame((s) => s.phoneApp);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Back, {}),
			app === "chat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chat, {}) : null,
			app === "bank" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bank, {}) : null,
			app === "people" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(People, {}) : null,
			app === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapApp, {}) : null,
			app === "jobs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jobs, {}) : null,
			app === "goals" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Goals, {}) : null,
			app === "shop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shop, {}) : null,
			app === "set" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sets, {}) : null
		]
	});
}
function Chat() {
	const messages = useGame((s) => s.messages);
	const pidgin = useGame((s) => s.settings.pidgin);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-cream/10 p-3 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: m.from }), m.kind === "scam" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-neon",
						children: "alert"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-cream/85",
					children: tx(m.body, pidgin)
				}),
				m.replies?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 w-full rounded-xl bg-gold px-3 py-2 text-left text-sm font-bold text-ink",
					onClick: () => useGame.getState().pickChoice(r.effect),
					children: tx(r.label, pidgin)
				}, r.id))
			]
		}, m.id))
	});
}
function Bank() {
	const money = useGame((s) => s.money);
	const bank = useGame((s) => s.bank);
	const pidgin = useGame((s) => s.settings.pidgin);
	const flags = useGame((s) => s.flags);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-display text-3xl text-gold tabular-nums",
			children: naira(money)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-xs text-cream/60",
			children: flags.scamArrived && flags.scamResolved && !flags.scamFell ? tx({
				en: "No incoming ₦350,000. Ever.",
				pg: "No ₦350,000 wey enter. Forever."
			}, pidgin) : tx({
				en: "Live balance. Receipts below.",
				pg: "Live balance. Receipt dey below."
			}, pidgin)
		}),
		bank.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2 border-t border-cream/10 py-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: tx(t.label, pidgin) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-cream/50",
				children: t.at
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `tabular-nums ${t.amount >= 0 ? "text-farm" : "text-laterite"}`,
				children: [t.amount >= 0 ? "+" : "", naira(t.amount, true)]
			})]
		}, t.id))
	] });
}
function People() {
	const trust = useGame((s) => s.trust);
	const pidgin = useGame((s) => s.settings.pidgin);
	const me = useGame((s) => s.character);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: Object.entries(NPCS).filter(([id]) => id !== me).map(([id, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 rounded-2xl bg-cream/10 p-2",
			children: [n.portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: n.portrait,
				alt: "",
				className: "size-10 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-10 place-items-center rounded-full bg-gold font-display text-ink",
				children: n.name[0]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold leading-tight",
						children: n.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-cream/60",
						children: tx(n.role, pidgin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-cream/15",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-gold",
							style: { width: `${Math.max(4, Math.min(100, trust[id] ?? 0))}%` }
						})
					})
				]
			})]
		}, id))
	});
}
function MapApp() {
	const place = useGame((s) => s.place);
	const minutes = useGame((s) => s.minutes);
	const pidgin = useGame((s) => s.settings.pidgin);
	const tod = timeOfDay(minutes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: Object.entries(PLACES).map(([id, p]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `overflow-hidden rounded-2xl border ${place === id ? "border-gold" : "border-cream/15"}`,
			children: [p.art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: p.art,
				alt: "",
				className: "h-16 w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 bg-cream/10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold",
						children: tx(p.name, pidgin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-cream/70",
						children: tx(p.blurb, pidgin)
					}),
					id === "lounge" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-neon",
						children: tod === "night" || tod === "dusk" ? tx({
							en: "Open now",
							pg: "E open now"
						}, pidgin) : tx({
							en: "Opens at dusk",
							pg: "E go open dusk"
						}, pidgin)
					}) : null
				]
			})]
		}, id))
	});
}
function Jobs() {
	const s = useGame();
	const pidgin = s.settings.pidgin;
	const list = HUSTLES.filter((h) => h.who === "all" || h.who.includes(s.character));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: list.map((h) => {
			const ok = canHustle(s, h);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => useGame.getState().doHustle(h.id),
				className: "rounded-2xl bg-gold/90 p-3 text-left text-ink disabled:opacity-50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tx(h.name, pidgin) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-sm tabular-nums",
							children: ["+", naira(h.pay - h.cost, true)]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-ink/70",
						children: tx(h.blurb, pidgin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[11px] text-ink/60",
						children: [
							h.when,
							" · ",
							Math.round(h.minutes / 60),
							"h · ",
							h.energy,
							" energy",
							ok ? "" : " · not now"
						]
					})
				]
			}, h.id);
		})
	});
}
function Goals() {
	const goals = useGame((s) => s.goals);
	const pidgin = useGame((s) => s.settings.pidgin);
	const smarts = useGame((s) => s.streetSmarts);
	const wahala = useGame((s) => s.wahala);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mb-2 text-xs text-cream/60",
		children: [
			"Street smarts ",
			smarts,
			" · Wahala ",
			wahala
		]
	}), goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 border-b border-cream/10 py-2 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-4 rounded-full border ${g.done ? "bg-farm border-farm" : "border-cream/40"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: g.done ? "text-cream/50 line-through" : "",
			children: tx(g.label, pidgin)
		})]
	}, g.id))] });
}
function Shop() {
	const pidgin = useGame((s) => s.settings.pidgin);
	const inv = useGame((s) => s.inventory);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-2",
		children: SHOP.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex items-center justify-between rounded-2xl bg-cream/10 p-3 text-left",
			onClick: () => useGame.getState().buy(item.id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-bold",
				children: tx(item.name, pidgin)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] text-cream/60",
				children: [
					tx(item.note, pidgin),
					" · have ",
					inv[item.id]
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-gold tabular-nums",
				children: naira(item.price, true)
			})]
		}, item.id))
	});
}
function Sets() {
	const settings = useGame((s) => s.settings);
	const pidgin = settings.pidgin;
	const row = (label, on, fn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: fn,
		className: "flex w-full items-center justify-between rounded-2xl bg-cream/10 px-3 py-3 text-sm",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-bold ${on ? "text-gold" : "text-cream/40"}`,
			children: on ? "On" : "Off"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [
			row(pidgin ? "Pidgin" : "English / Pidgin", pidgin, () => useGame.getState().setSetting("pidgin", !pidgin)),
			row("Music", settings.music, () => useGame.getState().setSetting("music", !settings.music)),
			row("Sounds", settings.sfx, () => useGame.getState().setSetting("sfx", !settings.sfx)),
			row("Camera shake", settings.shake, () => useGame.getState().setSetting("shake", !settings.shake)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "rounded-2xl bg-cream/10 px-3 py-3 text-left text-sm",
				onClick: () => useGame.getState().setSetting("speed", settings.speed === 1 ? 2 : settings.speed === 2 ? 3 : 1),
				children: [
					"Time speed · ",
					settings.speed,
					"x"
				]
			})
		]
	});
}
function Radial() {
	const npc = useGame((s) => s.radialNpc);
	const pidgin = useGame((s) => s.settings.pidgin);
	const place = useGame((s) => s.place);
	if (!npc) return null;
	const info = NPCS[npc];
	const art = place === "market" ? "/art/market.jpg" : place === "lounge" ? "/art/lounge.jpg" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 grid place-items-center",
		children: [
			art ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: art,
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/45" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative size-[220px]",
				children: [[
					{
						id: "talk",
						label: {
							en: "Talk",
							pg: "Yarn"
						},
						icon: MessageCircle,
						pos: "top-0 left-1/2 -translate-x-1/2"
					},
					{
						id: "gift",
						label: {
							en: "Gift",
							pg: "Gift"
						},
						icon: Gift,
						pos: "top-1/2 right-0 -translate-y-1/2"
					},
					{
						id: "joke",
						label: {
							en: "Joke",
							pg: "Joke"
						},
						icon: Smile,
						pos: "bottom-0 left-1/2 -translate-x-1/2"
					},
					{
						id: "borrow",
						label: {
							en: "Borrow",
							pg: "Borrow"
						},
						icon: HandCoins,
						pos: "top-1/2 left-0 -translate-y-1/2"
					}
				].map((a) => {
					const Icon = a.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: `absolute ${a.pos} grid size-[72px] place-items-center rounded-full border-[3px] border-ink bg-gold font-display text-[11px] leading-tight text-ink`,
						onClick: () => useGame.getState().radial(a.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), tx(a.label, pidgin)]
					}, a.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-1/2 top-1/2 grid size-[86px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-ink text-center font-display text-xs leading-tight text-cream",
					children: info.portrait ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: info.portrait,
						alt: "",
						className: "size-full rounded-full object-cover"
					}) : info.name.split(" ").slice(0, 2).join("\n")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "absolute bottom-8 rounded-full border-2 border-ink bg-cream px-4 py-2 font-bold text-ink",
				onClick: () => useGame.getState().closeDialogue(),
				children: tx({
					en: "Not now",
					pg: "No be now"
				}, pidgin)
			})
		]
	});
}
var ORDER = [
	"ada",
	"tunde",
	"zainab",
	"terkimbi"
];
function TitleScreen() {
	const screen = useGame((s) => s.screen);
	const hasSave = useGame((s) => s.hasSave);
	const pidgin = useGame((s) => s.settings.pidgin);
	if (screen === "setup") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full flex-col overflow-y-auto bg-cream text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/art/street.jpg",
			alt: "",
			className: "absolute inset-0 h-full w-full object-cover opacity-35"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl leading-none",
					children: tx({
						en: "Who are you this week?",
						pg: "Who you be this week?"
					}, pidgin)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-prose text-mute",
					children: tx({
						en: "Same compound, same street. Different hustle. Needs still go run you.",
						pg: "Same compound, same street. Different hustle. Needs still go run you."
					}, pidgin)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: ORDER.map((id) => {
						const c = CHARACTERS[id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => useGame.getState().start(id),
							className: "flex gap-3 rounded-[22px] border-2 border-ink bg-cream p-3 text-left shadow-[0_5px_0_#2A2320]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.portrait,
								alt: "",
								className: "size-24 rounded-2xl object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display block text-2xl leading-none",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-bold text-laterite",
									children: tx(c.role, pidgin)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-sm text-mute",
									children: tx(c.bio, pidgin)
								})
							] })]
						}, id);
					})
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full flex-col overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/title.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-auto flex flex-col gap-3 px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-16 text-cream",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold tracking-[0.2em] text-gold",
						children: "MAKEHAM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display max-w-xl text-5xl leading-[0.9] text-balance sm:text-7xl",
						children: tx({
							en: "Live a day. Mind your people.",
							pg: "Live your day. Mind your people."
						}, pidgin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-md text-pretty text-cream/80",
						children: tx({
							en: "Eat, gist, hustle, don't fall for the alert. The compound is home. The street is the game.",
							pg: "Chop, gist, hustle, no fall for the alert. Compound na house. Street na the game."
						}, pidgin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press-btn bg-gold px-6 py-3 text-xl text-ink",
								onClick: () => useGame.setState({ screen: "setup" }),
								children: tx({
									en: "New day",
									pg: "New day"
								}, pidgin)
							}),
							hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press-btn bg-cream px-6 py-3 text-xl text-ink",
								onClick: () => useGame.getState().continueGame(),
								children: tx({
									en: "Continue",
									pg: "Continue"
								}, pidgin)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "press-btn bg-cream/20 px-4 py-3 text-cream",
								onClick: () => useGame.getState().setSetting("pidgin", !pidgin),
								children: pidgin ? "English" : "Pidgin"
							})
						]
					})
				]
			})
		]
	});
}
function npcHere(from, to, minutes) {
	const m = (minutes % 1440 + 1440) % 1440;
	if (to <= 1440) return m >= from && m < to;
	return m >= from || m < to - 1440;
}
function sky(minutes) {
	const tod = timeOfDay(minutes);
	if (tod === "night") return ["#1B1F3A", "#2a2450"];
	if (tod === "dusk") return ["#c45c4a", "#5a3a6a"];
	if (tod === "golden") return ["#f3c77a", "#e8a05a"];
	if (tod === "dawn") return ["#f0c9b0", "#cfe6ee"];
	return ["#cfe6ee", "#9cc774"];
}
function hair(ctx, kind, accent, dark) {
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
		for (const x of [
			-5,
			-2,
			2,
			5
		]) ctx.fillRect(x - .8, -20, 1.6, 10);
	} else {
		ctx.beginPath();
		ctx.arc(0, -20, 7, Math.PI, .2);
		ctx.fill();
	}
}
function drawPerson(ctx, opt) {
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
	ctx.roundRect(-6 + lean * .2, -16, 12, 16, 3);
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
function drawGround(ctx, w, h, color, ox, oy, place) {
	const P = (x, y) => project(x, y, 0, ox, oy);
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
	ctx.globalAlpha = .12;
	ctx.fillStyle = "#C8542B";
	for (let i = 0; i < w * h * 1.4; i++) {
		const [px, py] = P(i * 1.7 % w, i * 2.3 % h);
		ctx.fillRect(px, py, 2, 2);
	}
	ctx.restore();
}
function drawWorld(ctx, s, cam, now) {
	const w = ctx.canvas.clientWidth || 800;
	const h = ctx.canvas.clientHeight || 450;
	const place = s.place === "market" || s.place === "lounge" ? "street" : s.place;
	const map = mapFor(place);
	const [sk0, sk1] = sky(world.minutes);
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, sk0);
	g.addColorStop(1, sk1);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	const ox = w / 2 - cam.x;
	const oy = h * .28 - cam.y;
	drawGround(ctx, map.w, map.h, map.ground, ox, oy, place);
	const items = map.boxes.map((b) => ({
		k: sortKey({
			x: b.x,
			y: b.y,
			w: b.w,
			d: b.d,
			z: b.z
		}),
		kind: "box",
		box: b
	}));
	items.push({
		k: sortKey({
			x: world.pos.x,
			y: world.pos.y
		}),
		kind: "actor",
		who: "player",
		x: world.pos.x,
		y: world.pos.y
	});
	for (const n of map.npcs) {
		if (n.id === s.character) continue;
		if (!npcHere(n.from, n.to, world.minutes)) continue;
		items.push({
			k: sortKey({
				x: n.x,
				y: n.y
			}),
			kind: "actor",
			who: n.id,
			x: n.x,
			y: n.y
		});
	}
	items.sort((a, b) => a.k - b.k);
	const ch = CHARACTERS[s.character];
	for (const it of items) if (it.kind === "box") drawBox(ctx, it.box, ox, oy, now);
	else if (it.who === "player") drawPerson(ctx, {
		x: it.x,
		y: it.y,
		ox,
		oy,
		skin: ch.skin,
		cloth: ch.cloth,
		accent: ch.accent,
		hair: ch.hair,
		walk: world.speed > .2 ? now / 180 : 0,
		heading: world.heading
	});
	else {
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
			name: n.name.split(" ")[0]
		});
	}
	const tod = timeOfDay(world.minutes);
	if (tod === "night" || tod === "dusk") {
		ctx.fillStyle = tod === "night" ? "rgba(12,14,32,0.46)" : "rgba(40,20,50,0.22)";
		ctx.fillRect(0, 0, w, h);
	}
}
function cameraOf(_s) {
	const [cx, cy] = project(world.pos.x, world.pos.y, 0, 0, 0);
	return {
		x: cx,
		y: cy
	};
}
function WorldCanvas() {
	const ref = (0, import_react.useRef)(null);
	const cam = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const place = useGame((s) => s.place);
	(0, import_react.useEffect)(() => {
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
		const loop = (now) => {
			const s = useGame.getState();
			const target = cameraOf(s);
			const k = 1 - Math.exp(-.088);
			camState.x += (target.x - camState.x) * k;
			camState.y += (target.y - camState.y) * k;
			const shake = s.trauma * s.trauma * (s.settings.shake ? 10 : 0);
			const ox = camState.x + (Math.random() - .5) * shake;
			const oy = camState.y + (Math.random() - .5) * shake;
			ctx.setTransform(Math.min(2, window.devicePixelRatio || 1), 0, 0, Math.min(2, window.devicePixelRatio || 1), 0, 0);
			const r = canvas.getBoundingClientRect();
			ctx.clearRect(0, 0, r.width, r.height);
			drawWorld(ctx, s, {
				x: ox,
				y: oy
			}, now);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	}, []);
	const onPointer = (e) => {
		const s = useGame.getState();
		if (s.phoneOpen || s.dialogue || s.radialNpc) return;
		if (!walkable(s.place)) return;
		const canvas = ref.current;
		if (!canvas) return;
		const r = canvas.getBoundingClientRect();
		const sx = e.clientX - r.left;
		const sy = e.clientY - r.top;
		const map = mapFor(s.place);
		const p = unproject(sx, sy, r.width / 2 - cam.current.x, r.height * .28 - cam.current.y);
		setPointerTarget({
			x: Math.max(.5, Math.min(map.w - .5, p.x)),
			y: Math.max(.5, Math.min(map.h - .5, p.y))
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "absolute inset-0 h-full w-full touch-none",
		onPointerDown: onPointer,
		"aria-label": place
	});
}
function walkable(p) {
	return p === "house" || p === "yard" || p === "street";
}
function GameRoot() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const screen = useGame((s) => s.screen);
	const toasts = useGame((s) => s.toasts);
	const pass = useGame((s) => s.pass);
	const pidgin = useGame((s) => s.settings.pidgin);
	const music = useGame((s) => s.settings.music);
	const sfxOn = useGame((s) => s.settings.sfx);
	const minutes = useGame((s) => s.minutes);
	const nightMusic = timeOfDay(minutes) === "night" || timeOfDay(minutes) === "dusk";
	(0, import_react.useEffect)(() => {
		useGame.getState().hydrate();
		setReady(true);
		const unbind = bindInput(document.body);
		let last = performance.now();
		let raf = 0;
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
			last = now;
			useGame.getState().tick(dt);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		const save = () => writeSave(useGame.getState());
		const vis = () => {
			if (document.hidden) save();
			else resumeAudio();
		};
		document.addEventListener("visibilitychange", vis);
		window.addEventListener("pagehide", save);
		window.__controlsTest = {
			getYaw: () => world.heading,
			getSpeed: () => world.speed,
			setKeys
		};
		return () => {
			cancelAnimationFrame(raf);
			unbind();
			document.removeEventListener("visibilitychange", vis);
			window.removeEventListener("pagehide", save);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		setBuses(music, sfxOn);
		if (screen === "play" && music) startMusic(nightMusic);
		else stopMusic();
	}, [
		music,
		sfxOn,
		screen,
		nightMusic
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-dvh place-items-center bg-cream font-display text-4xl text-ink",
		children: "MakeHam"
	});
	if (screen !== "play") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-dvh",
		onPointerDown: () => unlockAudio(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh overflow-hidden bg-sand",
		onPointerDown: () => unlockAudio(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldCanvas, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radial, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialogue, {}),
			pass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 grid place-items-center bg-ink/70",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display px-6 text-center text-3xl text-cream",
					children: pass.label
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-1/2 top-24 z-50 flex -translate-x-1/2 flex-col items-center gap-2",
				children: toasts.slice(-2).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `rounded-full px-4 py-2 text-sm font-bold ${t.tone === "bad" ? "bg-laterite text-cream" : t.tone === "warn" ? "bg-ink text-cream" : t.tone === "good" ? "bg-farm text-cream" : "bg-ink text-cream"}`,
					children: t.text
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute left-3 top-[5.6rem] text-[10px] text-ink/50 sm:hidden",
				children: pidgin ? "Tap ground to waka · WASD" : "Tap ground to walk · WASD"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameRoot, {});
}
//#endregion
export { Home as component };
