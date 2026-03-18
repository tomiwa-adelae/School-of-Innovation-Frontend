"use client";

import * as React from "react";
import {
  IconSettings,
  IconHelp,
  IconBrandZapier,
  IconBuilding,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/useAuth";
import { Logo } from "./Logo";
import { getNavByRole } from "@/lib/getNavByRole";

const roleLabel: Record<string, string> = {
  ADMINISTRATOR: "Administrator",
  INSTRUCTOR: "Instructor",
  USER: "Student",
};

const sidebarData = {
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
      comingSoon: true,
    },
    { title: "Get Help", url: "/help", icon: IconHelp, comingSoon: true },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navItems = React.useMemo(() => getNavByRole(user?.role), [user?.role]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <a href="/">
                {/* <Logo /> */}
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                  <IconBuilding className="size-4" />
                </div>
                <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold uppercase text-sm">
                    School of Innovation
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {roleLabel[user?.role ?? ""] ?? "Student"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
        <NavSecondary items={sidebarData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
