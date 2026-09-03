import type { Metadata } from "next";
import InvitationsClient from "./_components/InvitationsClient";

export const metadata: Metadata = {
  title: "Course Invitations",
  description:
    "Accept or decline invitations to collaborate on courses at School of Innovation.",
  robots: { index: false, follow: false },
};

export default function InvitationsPage() {
  return <InvitationsClient />;
}
