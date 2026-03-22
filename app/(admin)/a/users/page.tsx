import type { Metadata } from "next";
import AdminUsersClient from "./_components/AdminUsersClient";

export const metadata: Metadata = {
  title: "All Users",
  description: "Browse and manage all registered users on the School of Innovation platform.",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
