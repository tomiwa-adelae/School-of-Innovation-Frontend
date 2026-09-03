"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { publicFetch, postData, fetchData } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { toast } from "sonner";
import {
  LiveSession,
  countdownLabel,
  formatMoney,
  formatSessionTime,
  formatInViewerZone,
  viewerZoneDiffers,
} from "@/lib/live";
import { FlutterwavePayButton } from "@/components/FlutterwavePayButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconBroadcast,
  IconCalendarEvent,
  IconClock,
  IconLoader2,
  IconUsers,
  IconVideo,
  IconLock,
} from "@tabler/icons-react";

export default function LiveDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { user, _hasHydrated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Keeps the countdown honest without re-fetching.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const { data: session, isLoading } = useQuery<LiveSession>({
    queryKey: ["public-live-session", slug],
    queryFn: () => publicFetch(`/public/live/${slug}`),
  });

  // Am I already registered? Authenticated, so it only runs once signed in —
  // the page itself stays fully public.
  const { data: mine = [] } = useQuery<{ session: { id: string } }[]>({
    queryKey: ["my-live-sessions"],
    queryFn: () => fetchData("/live/my"),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container py-32 flex justify-center">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-32 text-center space-y-4">
        <h1 className="text-2xl font-bold">Class not found</h1>
        <Button asChild>
          <Link href="/live">See all live classes</Link>
        </Button>
      </div>
    );
  }

  const isFree = session.pricingType === "FREE";
  const isPast = new Date(session.endsAt).getTime() < now;
  const isCancelled = session.status === "CANCELLED";
  const soldOut = session.isSoldOut ?? false;
  const alreadyRegistered = mine.some((m) => m.session.id === session.id);

  async function handleFreeRegister() {
    if (!session) return;
    if (!user) {
      router.push(`/login?next=/live/${slug}`);
      return;
    }

    setIsRegistering(true);
    try {
      await postData(`/live/${session.id}/register`, {});
      toast.success("You are registered — check your email for the invite.");
      qc.invalidateQueries({ queryKey: ["my-live-sessions"] });
      router.push("/dashboard/live");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Could not register"));
    } finally {
      setIsRegistering(false);
    }
  }

  function renderCta() {
    if (isCancelled) {
      return (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-400">
          This class has been cancelled.
        </div>
      );
    }

    if (isPast) {
      return (
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-900 border p-4 text-sm text-muted-foreground">
          This class has finished.{" "}
          {session?.recordingUrl
            ? "A recording is available to registrants."
            : "Watch this space for the next one."}
        </div>
      );
    }

    if (alreadyRegistered) {
      return (
        <Button asChild size="lg" className="w-full rounded-2xl">
          <Link href="/dashboard/live">You are registered — view details</Link>
        </Button>
      );
    }

    if (soldOut) {
      return (
        <Button size="lg" disabled className="w-full rounded-2xl">
          Sold out
        </Button>
      );
    }

    if (!_hasHydrated) {
      return (
        <Button size="lg" disabled className="w-full rounded-2xl">
          <IconLoader2 size={18} className="animate-spin" />
        </Button>
      );
    }

    if (!user) {
      return (
        <Button asChild size="lg" className="w-full rounded-2xl">
          <Link href={`/login?next=/live/${slug}`}>
            Sign in to reserve a seat
          </Link>
        </Button>
      );
    }

    if (isFree) {
      return (
        <Button
          size="lg"
          className="w-full rounded-2xl"
          onClick={handleFreeRegister}
          disabled={isRegistering}
        >
          {isRegistering ? (
            <IconLoader2 size={18} className="animate-spin" />
          ) : (
            "Reserve my free seat"
          )}
        </Button>
      );
    }

    return (
      <FlutterwavePayButton
        productKind="live-session"
        courseId={session!.id}
        courseTitle={session!.title}
        price={session!.price ?? 0}
        currency={session!.currency ?? "NGN"}
        user={{
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        }}
        onSuccess={() => {
          qc.invalidateQueries({ queryKey: ["my-live-sessions"] });
          router.push("/dashboard/live");
        }}
        className="w-full rounded-2xl h-11"
      />
    );
  }

  return (
    <div className="container py-12 lg:py-16">
      <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* ── Main ── */}
        <article className="space-y-8 min-w-0">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {session.coverImage && (
              <Image
                src={session.coverImage}
                alt={session.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            )}
            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/75 text-white text-xs font-bold px-3 py-1.5">
              <IconBroadcast size={13} />
              {isPast ? "Ended" : `Starts ${countdownLabel(session.startsAt, now)}`}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {session.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <IconCalendarEvent size={16} />
                {formatSessionTime(
                  session.startsAt,
                  session.endsAt,
                  session.timezone,
                )}
              </span>
              {session.capacity !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <IconUsers size={16} />
                  {session._count.registrations} of {session.capacity} seats
                  taken
                </span>
              )}
            </div>

            {/* Only shown when it would actually change what time you show up */}
            {viewerZoneDiffers(session.timezone) && (
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium inline-flex items-center gap-1.5">
                <IconClock size={15} />
                That is {formatInViewerZone(session.startsAt)} where you are
              </p>
            )}
          </div>

          {session.description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {session.description.split("\n").map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : null,
              )}
            </div>
          )}

          {/* Host */}
          <div className="rounded-3xl border p-5 flex items-start gap-4">
            <Avatar className="size-12">
              <AvatarImage src={session.host.image ?? undefined} />
              <AvatarFallback>
                {`${session.host.firstName?.[0] ?? ""}${session.host.lastName?.[0] ?? ""}`.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Your instructor
              </p>
              <p className="font-bold">
                {session.host.firstName} {session.host.lastName}
              </p>
              {session.host.bio && (
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-4">
                  {session.host.bio}
                </p>
              )}
            </div>
          </div>
        </article>

        {/* ── Sticky registration card ── */}
        <aside className="lg:sticky lg:top-24 rounded-3xl border p-6 space-y-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-3xl font-bold">
              {formatMoney(session.price, session.currency)}
            </span>
            {session.seatsLeft !== null &&
              session.seatsLeft !== undefined &&
              session.seatsLeft > 0 &&
              session.seatsLeft <= 10 && (
                <Badge variant="secondary" className="text-amber-600">
                  {session.seatsLeft} left
                </Badge>
              )}
          </div>

          {renderCta()}

          <ul className="space-y-2.5 text-sm text-muted-foreground pt-1">
            <li className="flex items-start gap-2">
              <IconCalendarEvent size={16} className="mt-0.5 shrink-0" />
              Calendar invite sent the moment you register
            </li>
            <li className="flex items-start gap-2">
              <IconLock size={16} className="mt-0.5 shrink-0" />
              Join link appears in your dashboard 10 minutes before we start
            </li>
            <li className="flex items-start gap-2">
              <IconVideo size={16} className="mt-0.5 shrink-0" />
              Recording shared afterwards, if you cannot make it live
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
