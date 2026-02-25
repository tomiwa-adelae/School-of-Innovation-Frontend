"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IconUsers, IconSearch, IconLoader2 } from "@tabler/icons-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  onboardingCompleted: boolean;
  instructorStatus: string | null;
  createdAt: string;
}

type RoleFilter = "ALL" | "USER" | "INSTRUCTOR" | "ADMINISTRATOR";

const roleBadge: Record<string, string> = {
  USER: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  INSTRUCTOR:
    "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  ADMINISTRATOR:
    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700",
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && user.role !== "ADMINISTRATOR") router.push("/dashboard");
  }, [user, router]);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["admin-users", roleFilter],
    queryFn: () => {
      const url =
        roleFilter === "ALL" ? "/users" : `/users?role=${roleFilter}`;
      return fetchData<User[]>(url);
    },
    enabled: user?.role === "ADMINISTRATOR",
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  if (!user || user.role !== "ADMINISTRATOR") return null;

  const roleTabs: RoleFilter[] = ["ALL", "USER", "INSTRUCTOR", "ADMINISTRATOR"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">All Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage every account on the School of Innovation platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {roleTabs.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                roleFilter === r
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {r === "ALL"
                ? "All"
                : r === "USER"
                  ? "Students"
                  : r === "INSTRUCTOR"
                    ? "Instructors"
                    : "Admins"}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name, email or username…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <IconUsers size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-bold text-gray-900 dark:text-white">No users found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">User</p>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Email</p>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Role</p>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Joined</p>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map((u) => (
              <div
                key={u.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 items-center"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">
                    {u.firstName[0]}{u.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                  </div>
                </div>

                {/* Email */}
                <p className="text-sm text-muted-foreground truncate">{u.email}</p>

                {/* Role */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                      roleBadge[u.role] ?? roleBadge["USER"]
                    )}
                  >
                    {u.role === "USER"
                      ? "Student"
                      : u.role === "INSTRUCTOR"
                        ? "Instructor"
                        : "Admin"}
                  </span>
                  {u.role === "INSTRUCTOR" && u.instructorStatus && (
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                        u.instructorStatus === "PENDING"
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600"
                          : u.instructorStatus === "APPROVED"
                            ? "bg-green-100 dark:bg-green-950/40 text-green-600"
                            : "bg-red-100 dark:bg-red-950/40 text-red-600"
                      )}
                    >
                      {u.instructorStatus.toLowerCase()}
                    </span>
                  )}
                </div>

                {/* Joined date */}
                <p className="text-xs text-muted-foreground">
                  {new Date(u.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
