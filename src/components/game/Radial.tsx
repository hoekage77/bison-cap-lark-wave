import { Gift, HandCoins, MessageCircle, Smile } from "lucide-react";
import { NPCS } from "@/game/content";
import { tx } from "@/game/format";
import { useGame } from "@/game/store";

export function Radial() {
  const npc = useGame((s) => s.radialNpc);
  const pidgin = useGame((s) => s.settings.pidgin);
  const place = useGame((s) => s.place);
  if (!npc) return null;
  const info = NPCS[npc];
  const art = place === "market" ? "/art/market.jpg" : place === "lounge" ? "/art/lounge.jpg" : null;
  const actions = [
    { id: "talk" as const, label: { en: "Talk", pg: "Yarn" }, icon: MessageCircle, pos: "top-0 left-1/2 -translate-x-1/2" },
    { id: "gift" as const, label: { en: "Gift", pg: "Gift" }, icon: Gift, pos: "top-1/2 right-0 -translate-y-1/2" },
    { id: "joke" as const, label: { en: "Joke", pg: "Joke" }, icon: Smile, pos: "bottom-0 left-1/2 -translate-x-1/2" },
    { id: "borrow" as const, label: { en: "Borrow", pg: "Borrow" }, icon: HandCoins, pos: "top-1/2 left-0 -translate-y-1/2" },
  ];
  return (
    <div className="absolute inset-0 z-30 grid place-items-center">
      {art ? <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 bg-ink/50" />}
      <div className="absolute inset-0 bg-ink/45" />
      <div className="relative size-[220px]">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              type="button"
              className={`absolute ${a.pos} grid size-[72px] place-items-center rounded-full border-[3px] border-ink bg-gold font-display text-[11px] leading-tight text-ink`}
              onClick={() => useGame.getState().radial(a.id)}
            >
              <Icon className="size-5" />
              {tx(a.label, pidgin)}
            </button>
          );
        })}
        <div className="absolute left-1/2 top-1/2 grid size-[86px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-ink text-center font-display text-xs leading-tight text-cream">
          {info.portrait ? (
            <img src={info.portrait} alt="" className="size-full rounded-full object-cover" />
          ) : (
            info.name.split(" ").slice(0, 2).join("\n")
          )}
        </div>
      </div>
      <button
        type="button"
        className="absolute bottom-8 rounded-full border-2 border-ink bg-cream px-4 py-2 font-bold text-ink"
        onClick={() => useGame.getState().closeDialogue()}
      >
        {tx({ en: "Not now", pg: "No be now" }, pidgin)}
      </button>
    </div>
  );
}
