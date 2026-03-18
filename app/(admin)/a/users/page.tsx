"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { IconUsers, IconSearch, IconLoader2 } from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Loader } from "@/components/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      const url = roleFilter === "ALL" ? "/users" : `/users?role=${roleFilter}`;
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
      <PageHeader
        back
        title="All Users"
        description={`Manager every account on the School of Innovation Platform`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center justify-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
          {roleTabs.map((r) => (
            <Button
              variant={"secondary"}
              size={"sm"}
              key={r}
              onClick={() => setRoleFilter(r)}
              className={cn(
                "flex-1",
                roleFilter === r
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              {r === "ALL"
                ? "All"
                : r === "USER"
                  ? "Students"
                  : r === "INSTRUCTOR"
                    ? "Instructors"
                    : "Admins"}
            </Button>
          ))}
        </div>

        <div className="relative flex-1">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800">
          <IconUsers
            size={40}
            className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
          />
          <p className="font-bold">No users found</p>
        </div>
      ) : (
        <>
          <Card className="p-0 hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-md">
                          <AvatarFallback className="bg-gradient-to-br from-blue-700 to-primary text-white text-xs font-black">
                            {u.firstName[0]}
                            {u.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="truncate">
                            {u.firstName} {u.lastName}
                          </span>
                          <span className="text-xs">@{u.username}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(roleBadge[u.role])}
                        >
                          {u.role === "USER"
                            ? "Student"
                            : u.role === "INSTRUCTOR"
                              ? "Instructor"
                              : "Admin"}
                        </Badge>
                        {u.role === "INSTRUCTOR" && u.instructorStatus && (
                          <Badge
                            className={cn(
                              "text-[10px] border-none",
                              u.instructorStatus === "PENDING"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40"
                                : u.instructorStatus === "APPROVED"
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/40"
                                  : "bg-red-100 text-red-700 dark:bg-red-950/40",
                            )}
                          >
                            {u.instructorStatus}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {formatDate(u.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {filtered.map((u) => (
              <Card key={u.id} className="overflow-hidden p-0">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-md">
                        <AvatarFallback className="bg-primary text-white font-black">
                          {u.firstName[0]}
                          {u.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{u.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">
                      {formatDate(u.createdAt)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Email
                      </span>
                      <span className="text-xs font-medium">{u.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Role
                      </span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {u.role}
                        </Badge>
                        {u.instructorStatus && (
                          <Badge className="text-[10px]">
                            {u.instructorStatus}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
