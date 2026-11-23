import { GameIsland } from "@/components/game/GameIsland";
import { DashboardIsland } from "@/components/game/DashboardIsland";
import { LandingPage } from "@/components/site/LandingPage";
import { DASHBOARD_ANCHOR } from "@/lib/routes";

export default function HomePage() {
  return (
    <LandingPage
      locale="ar"
      playHref={`#${DASHBOARD_ANCHOR}`}
      showStats={false}
      interactive={
        <>
          <DashboardIsland />
          <GameIsland />
        </>
      }
    />
  );
}
