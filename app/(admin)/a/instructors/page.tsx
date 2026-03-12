"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  IconUserCheck,
  IconX,
  IconCheck,
  IconLoader2,
  IconFilter,
  IconSearch,
  IconMailForward,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  instructorStatus: "PENDING" | "APPROVED" | "REJECTED";
  bio: string | null;
  interests: string[];
  createdAt: string;
}

type Filter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const statusBadge: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  },
};

export default function AdminInstructorsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<Filter>("PENDING");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user && user.role !== "ADMINISTRATOR") router.push("/dashboard");
  }, [user, router]);

  const { data: instructors = [], isLoading } = useQuery<Instructor[]>({
    queryKey: ["instructors", filter],
    queryFn: () => {
      const url =
        filter === "ALL"
          ? "/users?role=INSTRUCTOR"
          : `/users?role=INSTRUCTOR&instructorStatus=${filter}`;
      return fetchData<Instructor[]>(url);
    },
    enabled: user?.role === "ADMINISTRATOR",
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/${id}/approve`),
    onSuccess: () => {
      toast.success("Instructor approved!");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["pending-instructors"] });
    },
    onError: () => toast.error("Failed to approve. Please try again."),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/${id}/reject`),
    onSuccess: () => {
      toast.success("Instructor rejected.");
      queryClient.invalidateQueries({ queryKey: ["instructors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["pending-instructors"] });
    },
    onError: () => toast.error("Failed to reject. Please try again."),
  });

  const filtered = instructors.filter((i) => {
    const q = search.toLowerCase();
    return (
      !q ||
      i.firstName.toLowerCase().includes(q) ||
      i.lastName.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q)
    );
  });

  if (!user || user.role !== "ADMINISTRATOR") return null;

  const filterTabs: Filter[] = ["PENDING", "APPROVED", "REJECTED", "ALL"];

  return (
    <div className="space-y-6">
      <PageHeader
        back
        title={"Instructor Approvals"}
        description={
          "Review and manage instructor applications from the community."
        }
      />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter tabs */}
        <div className="flex items-center  gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-md">
          {filterTabs.map((f) => (
            <Button
              variant={"secondary"}
              size={"sm"}
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                filter === f
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <InputGroup>
            <InputGroupInput placeholder="Search by name or email..." />
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <IconLoader2
            size={24}
            className="animate-spin text-muted-foreground"
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <IconUserCheck
            size={40}
            className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
          />
          <p className="font-bold text-gray-900 dark:text-white">
            No instructors found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "PENDING"
              ? "No pending applications right now."
              : `No ${filter.toLowerCase()} instructors.`}
          </p>
        </div>
      ) : (
        <>
          <Card className="p-0 hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((instructor) => {
                  const isActing =
                    approveMutation.isPending || rejectMutation.isPending;

                  return (
                    <TableRow key={instructor.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10 rounded-md">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-black text-sm">
                              {instructor.firstName[0]}
                              {instructor.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">
                              {instructor.firstName} {instructor.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {instructor.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {instructor.interests.length > 0 ? (
                            <>
                              {instructor.interests.slice(0, 2).map((s) => (
                                <Badge
                                  key={s}
                                  variant="secondary"
                                  className="text-[10px] px-2 py-0"
                                >
                                  {s}
                                </Badge>
                              ))}
                              {instructor.interests.length > 2 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-2 py-0"
                                >
                                  +{instructor.interests.length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Not specified
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium text-[10px] uppercase tracking-wide",
                            statusBadge[instructor.instructorStatus]?.className,
                          )}
                        >
                          {statusBadge[instructor.instructorStatus]?.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButtons
                            instructor={instructor}
                            isActing={isActing}
                            approveMutation={approveMutation}
                            rejectMutation={rejectMutation}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {filtered.map((instructor) => (
              <Card key={instructor.id}>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-black text-sm">
                          {instructor.firstName[0]}
                          {instructor.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">
                          {instructor.firstName} {instructor.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {instructor.email}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        statusBadge[instructor.instructorStatus]?.className,
                      )}
                    >
                      {statusBadge[instructor.instructorStatus]?.label}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Expertise
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {instructor.interests.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-[10px]"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-gray-50 dark:border-gray-800">
                      <ActionButtons
                        instructor={instructor}
                        isActing={
                          approveMutation.isPending || rejectMutation.isPending
                        }
                        approveMutation={approveMutation}
                        rejectMutation={rejectMutation}
                      />
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

function ActionButtons({
  instructor,
  isActing,
  approveMutation,
  rejectMutation,
}: any) {
  return (
    <>
      {instructor.instructorStatus === "PENDING" && (
        <>
          <Button
            size="sm"
            onClick={() => approveMutation.mutate(instructor.id)}
            disabled={isActing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {approveMutation.isPending ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconCheck />
            )}
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => rejectMutation.mutate(instructor.id)}
            disabled={isActing}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {rejectMutation.isPending ? (
              <IconLoader2 className="animate-spin" />
            ) : (
              <IconX />
            )}
            Reject
          </Button>
        </>
      )}

      {instructor.instructorStatus === "APPROVED" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => rejectMutation.mutate(instructor.id)}
          disabled={isActing}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <IconX /> Revoke
        </Button>
      )}

      {instructor.instructorStatus === "REJECTED" && (
        <Button
          size="sm"
          onClick={() => approveMutation.mutate(instructor.id)}
          disabled={isActing}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <IconCheck /> Approve
        </Button>
      )}

      <Button
        size="icon"
        variant="ghost"
        asChild
        className="text-muted-foreground"
      >
        <a href={`mailto:${instructor.email}`}>
          <IconMailForward size={14} />
        </a>
      </Button>
    </>
  );
}
