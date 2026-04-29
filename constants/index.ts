import {
  IconHome,
  IconBook,
  IconUsers,
  IconShield,
  IconUserCheck,
  IconFileCertificate,
  IconChartHistogram,
  IconTrophy,
  IconCurrencyDollar,
  IconSchool,
  IconUsersGroup,
  IconCalendar,
  IconNews,
  IconSettings,
  IconReceipt,
} from "@tabler/icons-react";

export const DEFAULT_PROFILE_IMAGE = "/assets/images/profile-img.jpg";

interface NavLinkProps {
  label: string;
  slug: string;
  icon: any;
  comingSoon?: boolean;
  allowedRoles?: string[];
}

/** Student navigation */
export const userNavLinks: NavLinkProps[] = [
  {
    label: "Dashboard",
    slug: "/dashboard",
    icon: IconHome,
  },
  {
    label: "My Courses",
    slug: "/dashboard/courses",
    icon: IconBook,
  },
  {
    label: "Progress",
    slug: "/dashboard/progress",
    icon: IconChartHistogram,
  },
  {
    label: "Certificates",
    slug: "/dashboard/certificates",
    icon: IconFileCertificate,
  },
  {
    label: "Leaderboard",
    slug: "/dashboard/leaderboard",
    icon: IconTrophy,
    comingSoon: true,
  },
];

/** Instructor navigation */
export const instructorNavLinks: NavLinkProps[] = [
  {
    label: "Dashboard",
    slug: "/dashboard",
    icon: IconHome,
  },
  {
    label: "My Courses",
    slug: "/dashboard/courses",
    icon: IconBook,
  },
  {
    label: "My Students",
    slug: "/instructor/students",
    icon: IconUsersGroup,
    comingSoon: true,
  },
  {
    label: "Earnings",
    slug: "/instructor/earnings",
    icon: IconCurrencyDollar,
    comingSoon: true,
  },
  {
    label: "Schedule",
    slug: "/instructor/schedule",
    icon: IconCalendar,
    comingSoon: true,
  },
];

/** Admin navigation */
export const adminNavLinks: NavLinkProps[] = [
  {
    label: "Dashboard",
    slug: "/a/dashboard",
    icon: IconHome,
  },
  {
    label: "All Users",
    slug: "/a/users",
    icon: IconUsers,
  },
  {
    label: "Instructor Approvals",
    slug: "/a/instructors",
    icon: IconUserCheck,
  },
  {
    label: "Courses",
    slug: "/a/courses",
    icon: IconSchool,
  },
  {
    label: "Enrollments",
    slug: "/a/enrollments",
    icon: IconReceipt,
  },
  {
    label: "Events",
    slug: "/a/events",
    icon: IconCalendar,
    comingSoon: true,
  },
  {
    label: "Announcements",
    slug: "/a/announcements",
    icon: IconNews,
    comingSoon: true,
  },
  {
    label: "Admin Team",
    slug: "/a/team",
    icon: IconShield,
  },
];
