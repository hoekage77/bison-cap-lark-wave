import { tx } from "@/game/format";
import { useGame } from "@/game/store";

export function Dialogue() {
  const d = useGame((s) => s.dialogue);
  const pidgin = useGame((s) => s.settings.pidgin);
  const place = useGame((s) => s.place);
  if (!d) return null;
  const art =
    place === "market" ? "/art/market.jpg" : place === "lounge" ? "/art/lounge.jpg" : null;
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {art ? (
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-ink/40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
      <div className="relative mx-auto w-full max-w-lg px-4 pb-[max(16px,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex items-end gap-3">
          {d.portrait ? (
            <img
              src={d.portrait}
              alt=""
              className="size-20 rounded-2xl border-2 border-ink object-cover shadow-[0_6px_0_#2A2320] sm:size-24"
            />
          ) : null}
          <div className="flex-1 rounded-2xl border-2 border-ink bg-gold/40 px-3 py-2 text-ink">
            <b className="font-display">{tx(d.speaker, pidgin)}</b>
            <p className="text-pretty text-sm leading-snug">{tx(d.body, pidgin)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-3">
          {d.choices.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-cream px-3 py-2.5 text-left font-bold text-ink"
              onClick={() => useGame.getState().pickChoice(c.effect)}
            >
              <span>{tx(c.label, pidgin)}</span>
              {c.hint ? <small className="shrink-0 text-mute">{tx(c.hint, pidgin)}</small> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
