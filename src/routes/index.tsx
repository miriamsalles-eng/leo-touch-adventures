import { createFileRoute } from "@tanstack/react-router";
import { GameShell } from "../game/GameShell";

const title = "Leo em Movimento — aprenda o touchpad brincando";
const description =
  "Jogo educativo infantil para Chromebooks: aprenda a mover, clicar, arrastar e soltar com Leo, o ratinho.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <h1 className="sr-only">Leo em Movimento</h1>
      <GameShell />
    </main>
  );
}
