import { Droplets, Moon, Phone, Smile, Sun, Utensils, Zap } from "lucide-react";
import { CHARACTERS } from "@/game/content";
import { clock, naira, timeOfDay, tx, weatherIcon } from "@/game/format";
import { useGame } from "@/game/store";
import { Joystick } from "./Joystick";

function Ring({
  color,
  p,
  children,
}: {
  color: string;
  p: number;
  children: React.ReactNode;
}) {
  const pct = Math.max(0, Math.min(100, p));
  return (
    <i
      className="relative grid size-10 place-items-center rounded-full not-italic sm:size-11"
      style={{
        background: `conic-gradient(${color} ${pct}%, #2A232022 0)`,
      }}
    >
      <span className="absolute inset-[5px] rounded-full bg-cream" />
      <span className="relative text-ink">{children}</span>
    </i>
  );
}

export function Hud() {
  const s = useGame();
  const ch = CHARACTERS[s.character];
  const tod = timeOfDay(s.minutes);
  const weather = weatherIcon(tod);
  const unread = s.messages.some((m) => m.unread);
  const label = s.hotspot ? tx(s.hotspot.label, s.settings.pidgin) : tx({ en: "Look around", pg: "Look around" }, s.settings.pidgin);
  const placeName =
    s.place === "house"
      ? tx({ en: "Home", pg: "House" }, s.settings.pidgin)
      : s.place === "yard"
        ? tx({ en: "Compound", pg: "Compound" }, s.settings.pidgin)
        : s.place === "street"
          ? tx({ en: "Street", pg: "Street" }, s.settings.pidgin)
          : s.place === "market"
            ? tx({ en: "Market", pg: "Market" }, s.settings.pidgin)
            : tx({ en: "Lounge", pg: "Lounge" }, s.settings.pidgin);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 p-[max(10px,env(safe-area-inset-top))] pb-[max(10px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto hud-card absolute left-3 top-3 flex items-center gap-2 px-2 py-1.5 sm:left-4 sm:top-4">
        <img
          src={ch.portrait}
          alt=""
          className="size-11 rounded-full border-2 border-ink object-cover sm:size-12"
        />
        <div className="flex gap-1.5">
          <Ring color="#C8542B" p={s.needs.hunger}>
            <Utensils className="size-3.5" strokeWidth={2.4} />
          </Ring>
          <Ring color="#F2B138" p={s.needs.energy}>
            <Zap className="size-3.5" strokeWidth={2.4} />
          </Ring>
          <Ring color="#2F7F86" p={s.needs.hygiene}>
            <Droplets className="size-3.5" strokeWidth={2.4} />
          </Ring>
          <Ring color="#E0457B" p={s.needs.mood}>
            <Smile className="size-3.5" strokeWidth={2.4} />
          </Ring>
        </div>
      </div>

      <div className="pointer-events-auto hud-card absolute right-3 top-3 px-3 py-1.5 text-right sm:right-4 sm:top-4">
        <strong className="font-display block text-lg leading-none text-gold tabular-nums sm:text-xl">
          {naira(Math.round(s.displayMoney), true)}
        </strong>
        <span className="mt-0.5 flex items-center justify-end gap-1 text-xs text-mute">
          Day {s.day}, {clock(s.minutes)}
          {weather === "moon" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        </span>
        <span className="text-[11px] font-bold text-ink/70">{placeName}</span>
      </div>

      <div className="pointer-events-auto absolute bottom-4 left-3 sm:bottom-5 sm:left-5">
        <Joystick />
      </div>

      <div className="pointer-events-auto absolute bottom-5 left-1/2 -translate-x-1/2">
        <button
          type="button"
          className="press-btn relative bg-gold px-5 py-2.5 text-base"
          onClick={() => useGame.getState().togglePhone()}
        >
          <span className="inline-flex items-center gap-1.5">
            <Phone className="size-4" />
            Phone
          </span>
          {unread ? (
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-neon" />
          ) : null}
        </button>
      </div>

      <div className="pointer-events-auto absolute bottom-5 right-3 sm:right-5">
        <button
          type="button"
          className="press-btn bg-farm px-5 py-3 text-lg text-cream sm:px-6"
          onClick={() => useGame.getState().doContext()}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
