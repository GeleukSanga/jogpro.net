import type { Metadata } from "next";
import BotDashboard from "./BotDashboard";

export const metadata: Metadata = {
  title: "PSAR Bot — Dashboard",
  description: "PSAR M1 signal monitor — US30 + USSPX500",
  robots: { index: false, follow: false },
};

export default function BotPage() {
  return <BotDashboard />;
}
