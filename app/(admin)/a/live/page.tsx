import type { Metadata } from "next";
import AdminLiveClient from "./_components/AdminLiveClient";

export const metadata: Metadata = {
  title: "Live Classes | Admin",
  description: "Oversee all live classes on the platform.",
  robots: { index: false, follow: false },
};

export default function AdminLivePage() {
  return <AdminLiveClient />;
}
