"use client";

import {
  LogOutIcon,
  SettingsIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserIcon,
  BookOpenIcon,
  GraduationCapIcon,
  ClipboardListIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-signout";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";

type RoleConfig = {
  label: string;
  badgeClass: string;
  links: { href: string; label: string; icon: React.ReactNode }[];
};

const ROLE_CONFIG: Record<string, RoleConfig> = {
  USER: {
    label: "Student",
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    links: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboardIcon size={15} />,
      },
      {
        href: "/dashboard/courses",
        label: "My Courses",
        icon: <BookOpenIcon size={15} />,
      },
      {
        href: "/settings",
        label: "Profile & Settings",
        icon: <UserIcon size={15} />,
      },
    ],
  },
  INSTRUCTOR: {
    label: "Instructor",
    badgeClass:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    links: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboardIcon size={15} />,
      },
      {
        href: "/dashboard/courses",
        label: "My Courses",
        icon: <BookOpenIcon size={15} />,
      },
      {
        href: "/dashboard/students",
        label: "My Students",
        icon: <GraduationCapIcon size={15} />,
      },
      {
        href: "/settings",
        label: "Profile & Settings",
        icon: <UserIcon size={15} />,
      },
    ],
  },
  ADMINISTRATOR: {
    label: "Admin",
    badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    links: [
      {
        href: "/admin",
        label: "Admin Overview",
        icon: <ShieldCheckIcon size={15} />,
      },
      {
        href: "/admin/users",
        label: "All Users",
        icon: <UsersIcon size={15} />,
      },
      {
        href: "/admin/instructors",
        label: "Instructor Approvals",
        icon: <ClipboardListIcon size={15} />,
      },
    ],
  },
};

const INSTRUCTOR_STATUS_CONFIG = {
  PENDING: {
    label: "Pending Approval",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  },
} as const;

export function UserDropdown() {
  const { user } = useAuth();
  const handleSignout = useSignout();

  if (!user) return null;

  const roleConfig = ROLE_CONFIG[user.role] ?? ROLE_CONFIG["USER"];
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const instructorStatusConfig =
    user.role === "INSTRUCTOR" && user.instructorStatus
      ? INSTRUCTOR_STATUS_CONFIG[
          user.instructorStatus as keyof typeof INSTRUCTOR_STATUS_CONFIG
        ]
      : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent gap-2 focus-visible:ring-0"
        >
          <Avatar className="size-9 border-2">
            <AvatarImage
              src={user.image || DEFAULT_PROFILE_IMAGE}
              alt={`${user.firstName} ${user.lastName}`}
              className="size-full object-cover"
            />
            <AvatarFallback className="bg-white/20 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={14}
            // className="text-white/70"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* User identity */}
        <DropdownMenuLabel className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage
                src={user.image || DEFAULT_PROFILE_IMAGE}
                alt={`${user.firstName} ${user.lastName}`}
                className="object-cover"
              />
              <AvatarFallback className="text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleConfig.badgeClass}`}
                >
                  {roleConfig.label}
                </span>
                {instructorStatusConfig && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${instructorStatusConfig.className}`}
                  >
                    {instructorStatusConfig.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Role-specific links */}
        <DropdownMenuGroup>
          {roleConfig.links.map(({ href, label, icon }) => (
            <DropdownMenuItem key={href} asChild>
              <Link href={href} className="flex items-center gap-2.5">
                <span className="text-muted-foreground">{icon}</span>
                <span>{label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignout}
          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          <LogOutIcon size={15} className="mr-2.5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
