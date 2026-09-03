"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import {
  MyLiveSession,
  LiveSession,
  countdownLabel,
  formatSessionTime,
  formatInViewerZone,
  viewerZoneDiffers,
} from "@/lib/live";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JoinButton } from "./JoinButton";
import {
  IconBroadcast,
  IconCalendarEvent,
  IconClock,
  IconLoader2,
  IconPlus,
  IconVideo,
} from "@tabler/icons-react";

export default function MyLiveClient() {
  const { user } = useAuth();
  const isInstructor = user?.role === "INSTRUCTOR";

  const { data: registrations = [], isLoading } = useQuery<MyLiveSession[]>({
    queryKey: ["my-live-sessions"],
    queryFn: () => fetchData("/live/my"),
  });

  const { data: hosting = [] } = useQuery<LiveSession[]>({
    queryKey: ["hosting-live-sessions"],
    queryFn: () => fetchData("/live/hosting"),
    enabled: isInstructor,
  });

  const upcoming = registrations.filter((r) => !r.isPast);
  const past = registrations.filter((r) => r.isPast);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <PageHeader
          title="Live classes"
          description="Sessions you have registered for, and the ones you run."
        />
        {isInstructor && (
          <Button asChild className="w-full md:w-auto">
            <Link href="/dashboard/live/create">
              <IconPlus size={16} /> Schedule a class
            </Link>
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconLoader2 size={16} className="animate-spin" />
          Loading your classes…
        </div>
      )}

      {/* ── Hosting ── */}
      {isInstructor && hosting.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
            Classes you host
          </h2>
          <div className="grid gap-3">
            {hosting.map((session) => (
              <Link
                key={session.id}
                href={`/dashboard/live/${session.id}`}
                className="rounded-2xl border p-4 flex flex-wrap items-center gap-3 hover:border-purple-400 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSessionTime(
                      session.startsAt,
                      session.endsAt,
                      session.timezone,
                    )}
                  </p>
                </div>
                <Badge
                  variant={
                    session.status === "SCHEDULED" ? "default" : "secondary"
                  }
                >
                  {session.status.toLowerCase().replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {session._count.registrations} registered
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Upcoming ── */}
      <section className="space-y-3">
        <h2 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
          Upcoming
        </h2>

        {!isLoading && upcoming.length === 0 ? (
          <div className="rounded-3xl border border-dashed py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center mx-auto mb-3">
              <IconBroadcast size={22} className="text-purple-500" />
            </div>
            <p className="font-semibold">No upcoming classes</p>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              Browse what is coming up and reserve a seat.
            </p>
            <Button asChild variant="outline">
              <Link href="/live">See live classes</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {upcoming.map(({ id, session, canJoin }) => (
              <div
                key={id}
                className="rounded-3xl border p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="relative w-full sm:w-44 aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  {session.coverImage && (
                    <Image
                      src={session.coverImage}
                      alt={session.title}
                      fill
                      className="object-cover"
                      sizes="176px"
                    />
                  )}
                  {canJoin && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-red-600 text-white text-[10px] font-bold px-2 py-0.5">
                      <IconBroadcast size={10} /> LIVE
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold truncate">{session.title}</h3>
                    <Badge variant="outline" className="shrink-0">
                      {countdownLabel(session.startsAt)}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
                    <IconCalendarEvent size={14} />
                    {formatSessionTime(
                      session.startsAt,
                      session.endsAt,
                      session.timezone,
                    )}
                  </p>

                  {viewerZoneDiffers(session.timezone) && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 inline-flex items-center gap-1.5">
                      <IconClock size={13} />
                      {formatInViewerZone(session.startsAt)} your time
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    with {session.host.firstName} {session.host.lastName}
                  </p>

                  <div className="pt-1">
                    <JoinButton
                      sessionId={session.id}
                      startsAt={session.startsAt}
                      endsAt={session.endsAt}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Past + recordings ── */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-muted-foreground">
            Past classes
          </h2>
          <div className="grid gap-3">
            {past.map(({ id, session, attendedAt }) => (
              <div
                key={id}
                className="rounded-2xl border p-4 flex flex-wrap items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSessionTime(
                      session.startsAt,
                      session.endsAt,
                      session.timezone,
                    )}
                    {attendedAt ? " · attended" : ""}
                  </p>
                </div>

                {session.recordingUrl ? (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={session.recordingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconVideo size={15} /> Watch recording
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No recording posted
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
