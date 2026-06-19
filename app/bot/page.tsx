import type { Metadata } from "next";
import BotDashboard from "./BotDashboard";

export const metadata: Metadata = {
  title: "LLM Bot — Dashboard",
  description: "LLM paper trading monitor",
  robots: { index: false, follow: false },
};

export default function BotPage() {
  return <BotDashboard />;
}
