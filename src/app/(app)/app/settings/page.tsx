import type { Metadata } from "next";
import { SettingsClient } from "@/components/app/SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your CrowdFifaX preferences, goals, and data.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
