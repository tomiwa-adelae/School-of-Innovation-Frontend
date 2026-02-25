"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/store/useAuth";

const roleTitles: Record<string, string> = {
  ADMINISTRATOR: "Admin Panel",
  INSTRUCTOR: "Instructor Dashboard",
  USER: "Student Dashboard",
};

export function SiteHeader() {
  const { user } = useAuth();
  const title = roleTitles[user?.role ?? ""] ?? "Dashboard";
  const isPendingInstructor =
    user?.role === "INSTRUCTOR" && user?.instructorStatus === "PENDING";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-md sticky top-0 z-10 transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h1>
        <div className="ml-auto flex items-center gap-3">
          {isPendingInstructor && (
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400 text-xs font-semibold"
            >
              Pending Approval
            </Badge>
          )}
          {user?.role === "INSTRUCTOR" && user?.instructorStatus === "APPROVED" && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400 text-xs font-semibold"
            >
              Approved Instructor
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
