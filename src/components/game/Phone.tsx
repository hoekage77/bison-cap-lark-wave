import {
  Briefcase,
  ChevronLeft,
  Landmark,
  MapPinned,
  MessageCircle,
  Settings,
  ShoppingBag,
  StickyNote,
  Users,
} from "lucide-react";
import { HUSTLES, NPCS, PLACES, SHOP } from "@/game/content";
import { naira, timeOfDay, tx } from "@/game/format";
import { canHustle, useGame } from "@/game/store";
import type { PhoneApp } from "@/game/types";

const APPS: { id: PhoneApp; label: string; icon: typeof MessageCircle }[] = [
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "bank", label: "Bank", icon: Landmark },
  { id: "people", label: "People", icon: Users },
  { id: "map", label: "Map", icon: MapPinned },
  { id: "jobs", label: "Jobs", icon: Briefcase },
  { id: "goals", label: "Goals", icon: StickyNote },
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "set", label: "Set", icon: Settings },
];

export function Phone() {
  const open = useGame((s) => s.phoneOpen);
  const app = useGame((s) => s.phoneApp);
  if (!open) return null;
  return (
    <div className="absolute bottom-[5.5rem] right-3 z-20 flex h-[min(72vh,520px)] w-[min(92vw,320px)] flex-col overflow-hidden rounded-[28px] border-[3px] border-ink bg-night p-3 text-cream shadow-[0_12px_40px_#0006] sm:right-6">
      <div className="mb-2 flex items-center justify-between text-[11px] text-cream/70">
        <span>9:41</span>
        <span>MakeHam</span>
        <span>LTE</span>
      </div>
      {app === "home" ? <HomeGrid /> : <AppBody />}
    </div>
  );
}

function HomeGrid() {
  const messages = useGame((s) => s.messages);
  const pidgin = useGame((s) => s.settings.pidgin);
  const unread = messages.find((m) => m.unread);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="grid grid-cols-4 gap-2 text-center">
        {APPS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              type="button"
              className="rounded-2xl bg-cream/10 py-2 text-[11px] leading-tight text-cream"
              onClick={() => useGame.getState().openApp(a.id)}
            >
              <Icon className="mx-auto mb-1 size-5" />
              {a.label}
            </button>
          );
        })}
      </div>
      {unread ? (
        <button
          type="button"
          className="mt-auto rounded-2xl bg-neon p-3 text-left text-sm text-cream"
          onClick={() => useGame.getState().openApp("chat")}
        >
          <b>{tx({ en: "New message", pg: "New message" }, pidgin)}</b>
          <div className="text-cream/90">
            {unread.from}: {tx(unread.body, pidgin).slice(0, 42)}…
          </div>
        </button>
      ) : (
        <p className="mt-auto text-xs text-cream/50">
          {tx({ en: "No new alerts. That's a good day.", pg: "No new alert. Na good day." }, pidgin)}
        </p>
      )}
    </div>
  );
}

function Back() {
  return (
    <button
      type="button"
      className="mb-2 inline-flex items-center gap-1 text-sm text-gold"
      onClick={() => useGame.getState().openApp("home")}
    >
      <ChevronLeft className="size-4" /> Back
    </button>
  );
}

function AppBody() {
  const app = useGame((s) => s.phoneApp);
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <Back />
      {app === "chat" ? <Chat /> : null}
      {app === "bank" ? <Bank /> : null}
      {app === "people" ? <People /> : null}
      {app === "map" ? <MapApp /> : null}
      {app === "jobs" ? <Jobs /> : null}
      {app === "goals" ? <Goals /> : null}
      {app === "shop" ? <Shop /> : null}
      {app === "set" ? <Sets /> : null}
    </div>
  );
}

function Chat() {
  const messages = useGame((s) => s.messages);
  const pidgin = useGame((s) => s.settings.pidgin);
  return (
    <div className="flex flex-col gap-2">
      {messages.map((m) => (
        <div key={m.id} className="rounded-2xl bg-cream/10 p-3 text-sm">
          <div className="flex items-center justify-between">
            <b>{m.from}</b>
            {m.kind === "scam" ? <span className="text-[10px] text-neon">alert</span> : null}
          </div>
          <p className="mt-1 text-cream/85">{tx(m.body, pidgin)}</p>
          {m.replies?.map((r) => (
            <button
              key={r.id}
              type="button"
              className="mt-2 w-full rounded-xl bg-gold px-3 py-2 text-left text-sm font-bold text-ink"
              onClick={() => useGame.getState().pickChoice(r.effect)}
            >
              {tx(r.label, pidgin)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function Bank() {
  const money = useGame((s) => s.money);
  const bank = useGame((s) => s.bank);
  const pidgin = useGame((s) => s.settings.pidgin);
  const flags = useGame((s) => s.flags);
  return (
    <div>
      <div className="font-display text-3xl text-gold tabular-nums">{naira(money)}</div>
      <p className="mb-3 text-xs text-cream/60">
        {flags.scamArrived && flags.scamResolved && !flags.scamFell
          ? tx({ en: "No incoming ₦350,000. Ever.", pg: "No ₦350,000 wey enter. Forever." }, pidgin)
          : tx({ en: "Live balance. Receipts below.", pg: "Live balance. Receipt dey below." }, pidgin)}
      </p>
      {bank.map((t) => (
        <div key={t.id} className="flex items-start justify-between gap-2 border-t border-cream/10 py-2 text-sm">
          <div>
            <div>{tx(t.label, pidgin)}</div>
            <div className="text-[11px] text-cream/50">{t.at}</div>
          </div>
          <span className={`tabular-nums ${t.amount >= 0 ? "text-farm" : "text-laterite"}`}>
            {t.amount >= 0 ? "+" : ""}
            {naira(t.amount, true)}
          </span>
        </div>
      ))}
    </div>
  );
}

function People() {
  const trust = useGame((s) => s.trust);
  const pidgin = useGame((s) => s.settings.pidgin);
  const me = useGame((s) => s.character);
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(NPCS)
        .filter(([id]) => id !== me)
        .map(([id, n]) => (
          <div key={id} className="flex items-center gap-2 rounded-2xl bg-cream/10 p-2">
            {n.portrait ? (
              <img src={n.portrait} alt="" className="size-10 rounded-full object-cover" />
            ) : (
              <span className="grid size-10 place-items-center rounded-full bg-gold font-display text-ink">
                {n.name[0]}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-bold leading-tight">{n.name}</div>
              <div className="text-[11px] text-cream/60">{tx(n.role, pidgin)}</div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cream/15">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${Math.max(4, Math.min(100, trust[id] ?? 0))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

function MapApp() {
  const place = useGame((s) => s.place);
  const minutes = useGame((s) => s.minutes);
  const pidgin = useGame((s) => s.settings.pidgin);
  const tod = timeOfDay(minutes);
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(PLACES).map(([id, p]) => (
        <div
          key={id}
          className={`overflow-hidden rounded-2xl border ${place === id ? "border-gold" : "border-cream/15"}`}
        >
          {p.art ? (
            <img src={p.art} alt="" className="h-16 w-full object-cover" />
          ) : (
            <div className="h-10 bg-cream/10" />
          )}
          <div className="p-2">
            <div className="font-bold">{tx(p.name, pidgin)}</div>
            <p className="text-xs text-cream/70">{tx(p.blurb, pidgin)}</p>
            {id === "lounge" ? (
              <p className="text-[11px] text-neon">
                {tod === "night" || tod === "dusk"
                  ? tx({ en: "Open now", pg: "E open now" }, pidgin)
                  : tx({ en: "Opens at dusk", pg: "E go open dusk" }, pidgin)}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function Jobs() {
  const s = useGame();
  const pidgin = s.settings.pidgin;
  const list = HUSTLES.filter((h) => h.who === "all" || h.who.includes(s.character));
  return (
    <div className="flex flex-col gap-2">
      {list.map((h) => {
        const ok = canHustle(s, h);
        return (
          <button
            key={h.id}
            type="button"
            onClick={() => useGame.getState().doHustle(h.id)}
            className="rounded-2xl bg-gold/90 p-3 text-left text-ink disabled:opacity-50"
          >
            <div className="flex items-start justify-between gap-2">
              <b>{tx(h.name, pidgin)}</b>
              <span className="font-display text-sm tabular-nums">+{naira(h.pay - h.cost, true)}</span>
            </div>
            <p className="text-xs text-ink/70">{tx(h.blurb, pidgin)}</p>
            <p className="mt-1 text-[11px] text-ink/60">
              {h.when} · {Math.round(h.minutes / 60)}h · {h.energy} energy
              {ok ? "" : " · not now"}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function Goals() {
  const goals = useGame((s) => s.goals);
  const pidgin = useGame((s) => s.settings.pidgin);
  const smarts = useGame((s) => s.streetSmarts);
  const wahala = useGame((s) => s.wahala);
  return (
    <div>
      <p className="mb-2 text-xs text-cream/60">
        Street smarts {smarts} · Wahala {wahala}
      </p>
      {goals.map((g) => (
        <div key={g.id} className="flex items-center gap-2 border-b border-cream/10 py-2 text-sm">
          <span className={`size-4 rounded-full border ${g.done ? "bg-farm border-farm" : "border-cream/40"}`} />
          <span className={g.done ? "text-cream/50 line-through" : ""}>{tx(g.label, pidgin)}</span>
        </div>
      ))}
    </div>
  );
}

function Shop() {
  const pidgin = useGame((s) => s.settings.pidgin);
  const inv = useGame((s) => s.inventory);
  return (
    <div className="flex flex-col gap-2">
      {SHOP.map((item) => (
        <button
          key={item.id}
          type="button"
          className="flex items-center justify-between rounded-2xl bg-cream/10 p-3 text-left"
          onClick={() => useGame.getState().buy(item.id)}
        >
          <div>
            <div className="font-bold">{tx(item.name, pidgin)}</div>
            <div className="text-[11px] text-cream/60">
              {tx(item.note, pidgin)} · have {inv[item.id]}
            </div>
          </div>
          <span className="font-display text-gold tabular-nums">{naira(item.price, true)}</span>
        </button>
      ))}
    </div>
  );
}

function Sets() {
  const settings = useGame((s) => s.settings);
  const pidgin = settings.pidgin;
  const row = (label: string, on: boolean, fn: () => void) => (
    <button
      type="button"
      onClick={fn}
      className="flex w-full items-center justify-between rounded-2xl bg-cream/10 px-3 py-3 text-sm"
    >
      {label}
      <span className={`font-bold ${on ? "text-gold" : "text-cream/40"}`}>{on ? "On" : "Off"}</span>
    </button>
  );
  return (
    <div className="flex flex-col gap-2">
      {row(pidgin ? "Pidgin" : "English / Pidgin", pidgin, () =>
        useGame.getState().setSetting("pidgin", !pidgin),
      )}
      {row("Music", settings.music, () => useGame.getState().setSetting("music", !settings.music))}
      {row("Sounds", settings.sfx, () => useGame.getState().setSetting("sfx", !settings.sfx))}
      {row("Camera shake", settings.shake, () => useGame.getState().setSetting("shake", !settings.shake))}
      <button
        type="button"
        className="rounded-2xl bg-cream/10 px-3 py-3 text-left text-sm"
        onClick={() =>
          useGame.getState().setSetting("speed", settings.speed === 1 ? 2 : settings.speed === 2 ? 3 : 1)
        }
      >
        Time speed · {settings.speed}x
      </button>
    </div>
  );
}
