"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { publicFetch } from "@/lib/api";
import {
  LiveSession,
  countdownLabel,
  formatMoney,
  formatSessionTime,
} from "@/lib/live";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconBroadcast,
  IconCalendarEvent,
  IconLoader2,
  IconUsers,
} from "@tabler/icons-react";

export default function LiveIndexClient() {
  const { data: sessions = [], isLoading } = useQuery<LiveSession[]>({
    queryKey: ["public-live-sessions"],
    queryFn: () => publicFetch("/public/live?limit=50"),
  });

  return (
    <div className="container py-16 space-y-10">
      <header className="max-w-2xl space-y-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-purple-600">
          <IconBroadcast size={15} /> Live classes
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Learn live, with the instructor in the room
        </h1>
        <p className="text-muted-foreground text-lg">
          Small, scheduled sessions where you can ask questions as you go.
          Reserve a seat and we will send you a calendar invite — plus the
          recording afterwards.
        </p>
      </header>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground py-20">
          <IconLoader2 size={18} className="animate-spin" />
          Loading upcoming classes…
        </div>
      )}

      {!isLoading && sessions.length === 0 && (
        <div className="rounded-3xl border border-dashed py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center mx-auto mb-4">
            <IconCalendarEvent size={26} className="text-purple-500" />
          </div>
          <h2 className="font-bold text-lg mb-2">No classes scheduled yet</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            New live sessions are announced regularly. In the meantime, browse
            our self-paced courses.
          </p>
          <Button asChild className="mt-6">
            <Link href="/courses">Browse courses</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => {
          const seatsLeft =
            session.capacity === null
              ? null
              : Math.max(0, session.capacity - session._count.registrations);
          const soldOut = seatsLeft === 0;

          return (
            <Link
              key={session.id}
              href={`/live/${session.slug}`}
              className="group rounded-3xl border overflow-hidden flex flex-col hover:border-purple-400 transition-colors"
            >
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
                {session.coverImage && (
                  <Image
                    src={session.coverImage}
                    alt={session.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/75 text-white text-[11px] font-bold px-2.5 py-1">
                  <IconBroadcast size={12} />
                  {countdownLabel(session.startsAt)}
                </span>
                {soldOut && (
                  <span className="absolute top-3 right-3 rounded-full bg-red-600 text-white text-[11px] font-bold px-2.5 py-1">
                    Sold out
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col gap-3">
                <h2 className="font-bold leading-snug line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {session.title}
                </h2>

                <p className="text-xs text-muted-foreground">
                  {formatSessionTime(
                    session.startsAt,
                    session.endsAt,
                    session.timezone,
                  )}
                </p>

                {session.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>
                )}

                <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="size-7">
                      <AvatarImage src={session.host.image ?? undefined} />
                      <AvatarFallback className="text-[10px]">
                        {`${session.host.firstName?.[0] ?? ""}${session.host.lastName?.[0] ?? ""}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate">
                      {session.host.firstName} {session.host.lastName}
                    </span>
                  </div>

                  <Badge variant={session.price ? "secondary" : "outline"}>
                    {formatMoney(session.price, session.currency)}
                  </Badge>
                </div>

                {seatsLeft !== null && seatsLeft > 0 && seatsLeft <= 10 && (
                  <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    <IconUsers size={12} />
                    Only {seatsLeft} seat{seatsLeft === 1 ? "" : "s"} left
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
