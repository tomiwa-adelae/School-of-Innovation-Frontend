import type { Metadata } from "next";
import AdminTeamClient from "./_components/AdminTeamClient";

export const metadata: Metadata = {
  title: "Admin Team",
  description: "Manage administrators and moderators for School of Innovation.",
  robots: { index: false, follow: false },
};

export default function AdminTeamPage() {
  return <AdminTeamClient />;
}
