import { userNavLinks } from "@/constants";
import { roleNavMap } from "@/constants/roleNavMap";

export function getNavByRole(role?: string) {
  if (!role) return userNavLinks;
  //   @ts-ignore
  return roleNavMap[role as UserRole] ?? userNavLinks;
}
