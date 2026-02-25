"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  IconUsers,
  IconUserCheck,
  IconBook,
  IconArrowRight,
  IconClock,
  IconSchool,
  IconShield,
  IconChartHistogram,
} from "@tabler/icons-react";

interface AdminStats {
  totalUsers: number;
  totalInstructors: number;
  pendingInstructors: number;
  approvedInstructors: number;
}

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  instructorStatus: string;
  bio: string | null;
  interests: string[];
  createdAt: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "ADMINISTRATOR") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => fetchData<AdminStats>("/users/stats"),
    enabled: user?.role === "ADMINISTRATOR",
  });

  const { data: pendingInstructors } = useQuery<Instructor[]>({
    queryKey: ["pending-instructors"],
    queryFn: () =>
      fetchData<Instructor[]>(
        "/users?role=INSTRUCTOR&instructorStatus=PENDING",
      ),
    enabled: user?.role === "ADMINISTRATOR",
  });

  if (!user || user.role !== "ADMINISTRATOR") return null;

  const statCards = [
    {
      label: "Total Students",
      value: statsLoading ? "—" : (stats?.totalUsers ?? 0),
      icon: IconUsers,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "Total Instructors",
      value: statsLoading ? "—" : (stats?.totalInstructors ?? 0),
      icon: IconSchool,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/40",
    },
    {
      label: "Pending Approvals",
      value: statsLoading ? "—" : (stats?.pendingInstructors ?? 0),
      icon: IconClock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      alert: (stats?.pendingInstructors ?? 0) > 0,
    },
    {
      label: "Active Instructors",
      value: statsLoading ? "—" : (stats?.approvedInstructors ?? 0),
      icon: IconChartHistogram,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <IconShield size={28} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl font-black">
              Welcome back, {user.firstName}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Here&apos;s what&apos;s happening on the platform today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, alert }) => (
          <div
            key={label}
            className={cn(
              "bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800",
              alert && "ring-2 ring-amber-400 dark:ring-amber-600",
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                bg,
              )}
            >
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {label}
            </p>
            {alert && (
              <p className="text-[10px] text-amber-500 font-bold mt-1 uppercase tracking-wide">
                Needs attention
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">
          Admin Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "Instructor Approvals",
              desc: `${stats?.pendingInstructors ?? 0} pending`,
              href: "/admin/instructors",
              icon: IconUserCheck,
              color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600",
              urgent: (stats?.pendingInstructors ?? 0) > 0,
            },
            {
              label: "All Users",
              desc: `${(stats?.totalUsers ?? 0) + (stats?.totalInstructors ?? 0)} total`,
              href: "/admin/users",
              icon: IconUsers,
              color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600",
              urgent: false,
            },
            {
              label: "Courses",
              desc: "Coming soon",
              href: "#",
              icon: IconBook,
              color: "bg-purple-50 dark:bg-purple-950/40 text-purple-600",
              urgent: false,
            },
          ].map(({ label, desc, href, icon: Icon, color, urgent }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all",
                urgent && "ring-2 ring-amber-300 dark:ring-amber-700",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  color,
                )}
              >
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <IconArrowRight
                size={16}
                className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Pending instructors quick view */}
      {(pendingInstructors?.length ?? 0) > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-amber-200 dark:border-amber-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center gap-2">
              <IconClock size={18} className="text-amber-500" />
              <h3 className="font-black text-gray-900 dark:text-white text-sm">
                Pending Instructor Applications
              </h3>
            </div>
            <Link
              href="/admin/instructors"
              className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              View All <IconArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {pendingInstructors?.slice(0, 3).map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                  {instructor.firstName[0]}
                  {instructor.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {instructor.firstName} {instructor.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {instructor.email}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
