import { CHARACTERS } from "@/game/content";
import { tx } from "@/game/format";
import { useGame } from "@/game/store";
import type { CharacterId } from "@/game/types";

const ORDER: CharacterId[] = ["ada", "tunde", "zainab", "terkimbi"];

export function TitleScreen() {
  const screen = useGame((s) => s.screen);
  const hasSave = useGame((s) => s.hasSave);
  const pidgin = useGame((s) => s.settings.pidgin);

  if (screen === "setup") {
    return (
      <div className="relative flex h-full flex-col overflow-y-auto bg-cream text-ink">
        <img src="/art/street.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
          <h1 className="font-display text-4xl leading-none">
            {tx({ en: "Who are you this week?", pg: "Who you be this week?" }, pidgin)}
          </h1>
          <p className="max-w-prose text-mute">
            {tx(
              {
                en: "Same compound, same street. Different hustle. Needs still go run you.",
                pg: "Same compound, same street. Different hustle. Needs still go run you.",
              },
              pidgin,
            )}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ORDER.map((id) => {
              const c = CHARACTERS[id];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => useGame.getState().start(id)}
                  className="flex gap-3 rounded-[22px] border-2 border-ink bg-cream p-3 text-left shadow-[0_5px_0_#2A2320]"
                >
                  <img src={c.portrait} alt="" className="size-24 rounded-2xl object-cover" />
                  <span>
                    <span className="font-display block text-2xl leading-none">{c.name}</span>
                    <span className="text-sm font-bold text-laterite">{tx(c.role, pidgin)}</span>
                    <span className="mt-1 block text-sm text-mute">{tx(c.bio, pidgin)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <img src="/art/title.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
      <div className="relative mt-auto flex flex-col gap-3 px-6 pb-[max(28px,env(safe-area-inset-bottom))] pt-16 text-cream">
        <p className="text-sm font-bold tracking-[0.2em] text-gold">MAKEHAM</p>
        <h1 className="font-display max-w-xl text-5xl leading-[0.9] text-balance sm:text-7xl">
          {tx({ en: "Live a day. Mind your people.", pg: "Live your day. Mind your people." }, pidgin)}
        </h1>
        <p className="max-w-md text-pretty text-cream/80">
          {tx(
            {
              en: "Eat, gist, hustle, don't fall for the alert. The compound is home. The street is the game.",
              pg: "Chop, gist, hustle, no fall for the alert. Compound na house. Street na the game.",
            },
            pidgin,
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="button"
            className="press-btn bg-gold px-6 py-3 text-xl text-ink"
            onClick={() => useGame.setState({ screen: "setup" })}
          >
            {tx({ en: "New day", pg: "New day" }, pidgin)}
          </button>
          {hasSave ? (
            <button
              type="button"
              className="press-btn bg-cream px-6 py-3 text-xl text-ink"
              onClick={() => useGame.getState().continueGame()}
            >
              {tx({ en: "Continue", pg: "Continue" }, pidgin)}
            </button>
          ) : null}
          <button
            type="button"
            className="press-btn bg-cream/20 px-4 py-3 text-cream"
            onClick={() => useGame.getState().setSetting("pidgin", !pidgin)}
          >
            {pidgin ? "English" : "Pidgin"}
          </button>
        </div>
      </div>
    </div>
  );
}
