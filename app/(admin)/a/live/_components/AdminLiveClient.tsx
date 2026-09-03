"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import {
  LiveSession,
  countdownLabel,
  formatMoney,
  formatSessionTime,
} from "@/lib/live";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  IconLoader2,
  IconExternalLink,
  IconUserPlus,
  IconBroadcast,
} from "@tabler/icons-react";

type Filter = "ALL" | "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED" | "DRAFT";

const FILTERS: Filter[] = [
  "SCHEDULED",
  "LIVE",
  "DRAFT",
  "ENDED",
  "CANCELLED",
  "ALL",
];

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  SCHEDULED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  LIVE: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  ENDED: "bg-gray-100 text-gray-500 dark:bg-gray-800",
  CANCELLED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

export default function AdminLiveClient() {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  const [filter, setFilter] = useState<Filter>("SCHEDULED");
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const isAdmin = user?.role === "ADMINISTRATOR";

  const { data: sessions = [], isLoading } = useQuery<LiveSession[]>({
    queryKey: ["admin-live-sessions", filter],
    queryFn: () =>
      fetchData(
        filter === "ALL" ? "/live/admin/list" : `/live/admin/list?status=${filter}`,
      ),
    enabled: isAdmin,
  });

  const manualRegister = useMutation({
    mutationFn: (sessionId: string) =>
      postData(`/live/admin/${sessionId}/manual-register`, {
        userEmail: email.trim(),
      }),
    onSuccess: () => {
      toast.success("Registered — they have been emailed the invite.");
      setAddingTo(null);
      setEmail("");
      qc.invalidateQueries({ queryKey: ["admin-live-sessions"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Could not register"));
    },
  });

  // Redirecting is a side effect — keep it out of the render body.
  useEffect(() => {
    if (user && !isAdmin) router.replace("/dashboard");
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) return null;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Live classes"
        description="Every scheduled session across the platform."
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors",
              filter === f
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-foreground",
            )}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <IconLoader2 size={16} className="animate-spin" />
          Loading…
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <div className="rounded-3xl border border-dashed py-16 text-center">
          <IconBroadcast size={26} className="text-gray-400 mx-auto mb-3" />
          <p className="font-semibold">No classes in this view</p>
        </div>
      )}

      <div className="grid gap-3">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-2xl border p-4 space-y-3">
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold truncate">{session.title}</p>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      STATUS_STYLE[session.status],
                    )}
                  >
                    {session.status.toLowerCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatSessionTime(
                    session.startsAt,
                    session.endsAt,
                    session.timezone,
                  )}
                  {session.status === "SCHEDULED" &&
                    ` · ${countdownLabel(session.startsAt)}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {session.host.firstName} {session.host.lastName} ·{" "}
                  {session._count.registrations} registered ·{" "}
                  {formatMoney(session.price, session.currency)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!session.meetingUrl && session.status !== "CANCELLED" && (
                  <Badge variant="outline" className="text-amber-600">
                    no link
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAddingTo(addingTo === session.id ? null : session.id)
                  }
                >
                  <IconUserPlus size={14} /> Add attendee
                </Button>
                {session.status !== "DRAFT" && (
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/live/${session.slug}`} target="_blank">
                      <IconExternalLink size={15} />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            {addingTo === session.id && (
              <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t mt-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="flex-1 mt-2"
                />
                <Button
                  className="mt-2"
                  onClick={() => manualRegister.mutate(session.id)}
                  disabled={!email.trim() || manualRegister.isPending}
                >
                  {manualRegister.isPending ? (
                    <IconLoader2 size={15} className="animate-spin" />
                  ) : (
                    "Register them"
                  )}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
