"use client";

import dynamic from "next/dynamic";

/**
 * The quiz is below the fold and only matters after interaction, so it is
 * loaded as a separate chunk after hydration. The static marketing content
 * (hero, curriculum, FAQ) stays in the initial HTML and paints first.
 */
const GameShell = dynamic(
  () => import("./GameShell").then((module) => module.GameShell),
  {
    ssr: false,
    loading: () => (
      <section
        id="play"
        aria-busy="true"
        className="relative z-10 mx-auto w-full max-w-md px-4 pb-6"
      >
        <div className="glass-panel animate-pulse rounded-2xl p-10 text-center text-sm text-zinc-400">
          جارٍ تحميل الاختبار…
        </div>
      </section>
    ),
  },
);

export function GameIsland() {
  return <GameShell />;
}
