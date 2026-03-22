import type { Metadata } from "next";
import AdminInstructorsClient from "./_components/AdminInstructorsClient";

export const metadata: Metadata = {
  title: "Instructor Approvals",
  description: "Review, approve, and manage instructor applications on School of Innovation.",
  robots: { index: false, follow: false },
};

export default function AdminInstructorsPage() {
  return <AdminInstructorsClient />;
}
