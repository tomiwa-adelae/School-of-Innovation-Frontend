import type { Metadata } from "next";
import ManageLiveClient from "./_components/ManageLiveClient";

export const metadata: Metadata = {
  title: "Manage Live Class",
  description: "Manage your live class, roster and recording.",
  robots: { index: false, follow: false },
};

export default function ManageLivePage() {
  return <ManageLiveClient />;
}
