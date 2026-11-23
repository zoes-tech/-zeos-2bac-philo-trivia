import { GameIsland } from "@/components/game/GameIsland";
import { DashboardIsland } from "@/components/game/DashboardIsland";
import { LandingPage } from "@/components/site/LandingPage";

export default function HomePage() {
  return (
    <LandingPage
      locale="ar"
      playHref="#dashboard"
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
