import type { Metadata } from "next";
import CreateLiveClient from "./_components/CreateLiveClient";

export const metadata: Metadata = {
  title: "Schedule a Live Class",
  description: "Schedule a new live class for your students.",
  robots: { index: false, follow: false },
};

export default function CreateLivePage() {
  return <CreateLiveClient />;
}
