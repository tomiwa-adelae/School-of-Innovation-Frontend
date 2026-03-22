import type { Metadata } from "next";
import SettingsClient from "./_components/SettingsClient";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your School of Innovation profile, security, and notification preferences.",
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return <SettingsClient />;
}
