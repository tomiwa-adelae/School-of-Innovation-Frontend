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

const statusBadge: Record<
  string,
  { label: string; className: string }
> = {
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Instructor Approvals
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and manage instructor applications from the community.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {filterTabs.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize",
                filter === f
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                  : "text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <IconSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name or email…"
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
          <IconUserCheck size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-bold text-gray-900 dark:text-white">No instructors found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "PENDING"
              ? "No pending applications right now."
              : `No ${filter.toLowerCase()} instructors.`}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_1.5fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Name</p>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Expertise</p>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Status</p>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Actions</p>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map((instructor) => {
              const isActing =
                approveMutation.isPending || rejectMutation.isPending;

              return (
                <div
                  key={instructor.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_1fr_auto] gap-4 px-6 py-5 items-center"
                >
                  {/* Name + email */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                      {instructor.firstName[0]}
                      {instructor.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {instructor.firstName} {instructor.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {instructor.email}
                      </p>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="flex flex-wrap gap-1.5">
                    {instructor.interests.length > 0 ? (
                      instructor.interests.slice(0, 3).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Not specified
                      </span>
                    )}
                    {instructor.interests.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{instructor.interests.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Status badge */}
                  <div>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
                        statusBadge[instructor.instructorStatus]?.className
                      )}
                    >
                      {statusBadge[instructor.instructorStatus]?.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {instructor.instructorStatus === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(instructor.id)}
                          disabled={isActing}
                          className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                        >
                          {approveMutation.isPending ? (
                            <IconLoader2 size={13} className="animate-spin" />
                          ) : (
                            <IconCheck size={13} />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectMutation.mutate(instructor.id)}
                          disabled={isActing}
                          className="h-8 gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-xs font-bold"
                        >
                          {rejectMutation.isPending ? (
                            <IconLoader2 size={13} className="animate-spin" />
                          ) : (
                            <IconX size={13} />
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
                        className="h-8 gap-1.5 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-xs font-bold"
                      >
                        <IconX size={13} /> Revoke
                      </Button>
                    )}

                    {instructor.instructorStatus === "REJECTED" && (
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(instructor.id)}
                        disabled={isActing}
                        className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold"
                      >
                        <IconCheck size={13} /> Approve
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="h-8 gap-1 text-muted-foreground rounded-xl text-xs"
                    >
                      <a href={`mailto:${instructor.email}`}>
                        <IconMailForward size={13} />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
