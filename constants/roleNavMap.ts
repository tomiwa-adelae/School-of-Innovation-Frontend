// constants/roleNavMap.ts
import { adminNavLinks, instructorNavLinks, userNavLinks } from "@/constants";

export type UserRole = "ADMINISTRATOR" | "INSTRUCTOR" | "USER";

export const roleNavMap: Record<UserRole, typeof userNavLinks> = {
  ADMINISTRATOR: adminNavLinks,
  INSTRUCTOR: instructorNavLinks,
  USER: userNavLinks,
};
