import { useEffect, useState } from "react";
import { resumeAudio, setBuses, startMusic, stopMusic, unlockAudio } from "@/game/audio";
import { bindInput, setKeys } from "@/game/input";
import { writeSave } from "@/game/save";
import { timeOfDay } from "@/game/format";
import { useGame } from "@/game/store";
import { world } from "@/game/world";
import { Dialogue } from "./Dialogue";
import { Hud } from "./Hud";
import { Phone } from "./Phone";
import { Radial } from "./Radial";
import { TitleScreen } from "./TitleScreen";
import { WorldCanvas } from "./WorldCanvas";

export function GameRoot() {
  const [ready, setReady] = useState(false);
  const screen = useGame((s) => s.screen);
  const toasts = useGame((s) => s.toasts);
  const pass = useGame((s) => s.pass);
  const pidgin = useGame((s) => s.settings.pidgin);
  const music = useGame((s) => s.settings.music);
  const sfxOn = useGame((s) => s.settings.sfx);
  const minutes = useGame((s) => s.minutes);
  const nightMusic = timeOfDay(minutes) === "night" || timeOfDay(minutes) === "dusk";

  useEffect(() => {
    useGame.getState().hydrate();
    setReady(true);
    const unbind = bindInput(document.body);
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
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
      setKeys,
    };

    return () => {
      cancelAnimationFrame(raf);
      unbind();
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  useEffect(() => {
    setBuses(music, sfxOn);
    if (screen === "play" && music) startMusic(nightMusic);
    else stopMusic();
  }, [music, sfxOn, screen, nightMusic]);

  if (!ready) {
    return (
      <div className="grid h-dvh place-items-center bg-cream font-display text-4xl text-ink">
        MakeHam
      </div>
    );
  }

  if (screen !== "play") {
    return (
      <div className="h-dvh" onPointerDown={() => unlockAudio()}>
        <TitleScreen />
      </div>
    );
  }

  return (
    <div
      className="relative h-dvh overflow-hidden bg-sand"
      onPointerDown={() => unlockAudio()}
    >
      <WorldCanvas />
      <Hud />
      <Phone />
      <Radial />
      <Dialogue />
      {pass ? (
        <div className="absolute inset-0 z-40 grid place-items-center bg-ink/70">
          <p className="font-display px-6 text-center text-3xl text-cream">{pass.label}</p>
        </div>
      ) : null}
      <div className="pointer-events-none absolute left-1/2 top-24 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.slice(-2).map((t) => (
          <div
            key={t.id}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              t.tone === "bad"
                ? "bg-laterite text-cream"
                : t.tone === "warn"
                  ? "bg-ink text-cream"
                  : t.tone === "good"
                    ? "bg-farm text-cream"
                    : "bg-ink text-cream"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
      <p className="pointer-events-none absolute left-3 top-[5.6rem] text-[10px] text-ink/50 sm:hidden">
        {pidgin ? "Tap ground to waka · WASD" : "Tap ground to walk · WASD"}
      </p>
    </div>
  );
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys: (codes: string[]) => void;
    };
  }
}
