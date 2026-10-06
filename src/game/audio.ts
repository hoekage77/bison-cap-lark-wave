let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let musicTimer: number | null = null;
let unlocked = false;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    musicGain = ctx.createGain();
    sfxGain = ctx.createGain();
    musicGain.gain.value = 0.12;
    sfxGain.gain.value = 0.28;
    musicGain.connect(master);
    sfxGain.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockAudio() {
  const c = ac();
  if (c.state === "suspended") void c.resume();
  unlocked = true;
}

export function setBuses(music: boolean, sfx: boolean, muted = false) {
  if (!master || !musicGain || !sfxGain || !ctx) return;
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(muted ? 0 : 1, t, 0.04);
  musicGain.gain.setTargetAtTime(music ? 0.12 : 0, t, 0.05);
  sfxGain.gain.setTargetAtTime(sfx ? 0.28 : 0, t, 0.05);
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.12, bus: "sfx" | "music" = "sfx") {
  if (!unlocked) return;
  const c = ac();
  if (!sfxGain || !musicGain) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g);
  g.connect(bus === "music" ? musicGain : sfxGain);
  o.start();
  o.stop(c.currentTime + dur + 0.02);
}

export const sfx = {
  tap: () => beep(520, 0.05, "triangle", 0.07),
  coin: () => {
    beep(880, 0.08, "square", 0.08);
    setTimeout(() => beep(1320, 0.1, "square", 0.06), 70);
  },
  pos: () => beep(1400, 0.04, "square", 0.06),
  warn: () => {
    beep(140, 0.22, "sawtooth", 0.07);
    beep(110, 0.3, "sine", 0.08);
  },
  ok: () => beep(660, 0.1, "triangle", 0.08),
  night: () => beep(220, 0.4, "sine", 0.04),
};

export function startMusic(night: boolean) {
  stopMusic();
  if (!unlocked) return;
  const notes = night ? [196, 233, 262, 311] : [262, 311, 349, 392, 466];
  let i = 0;
  const pulse = () => {
    const n = notes[i % notes.length] ?? 262;
    beep(n, night ? 0.55 : 0.28, "triangle", 0.045, "music");
    if (i % 4 === 0) beep(n / 2, 0.5, "sine", 0.03, "music");
    i++;
    musicTimer = window.setTimeout(pulse, night ? 620 : 420);
  };
  pulse();
}

export function stopMusic() {
  if (musicTimer != null) {
    clearTimeout(musicTimer);
    musicTimer = null;
  }
}

export function resumeAudio() {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}
