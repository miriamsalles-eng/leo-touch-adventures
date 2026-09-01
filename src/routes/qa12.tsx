import { createFileRoute } from "@tanstack/react-router";
import { Stage } from "@/game/stage";
import { S12Ending } from "@/game/scenes/S12Ending";

export const Route = createFileRoute("/qa12")({ component: () => <Stage><S12Ending onRestart={() => {}} /></Stage> });
