"use client";

import { useEffect, useState } from "react";
import { fetchData } from "@/lib/api";
import { toast } from "sonner";
import { JOIN_WINDOW_BEFORE_MS } from "@/lib/live";
import { Button } from "@/components/ui/button";
import { IconExternalLink, IconLoader2, IconLock } from "@tabler/icons-react";

interface Props {
  sessionId: string;
  startsAt: string;
  endsAt: string;
}

function minutesUntilOpen(startsAt: string, now: number) {
  const opensAt = new Date(startsAt).getTime() - JOIN_WINDOW_BEFORE_MS;
  return Math.max(0, Math.ceil((opensAt - now) / 60000));
}

/**
 * Fetches the meeting link on demand, never as part of a list response.
 *
 * On MANUAL_LINK every registrant shares one URL, so the defence against it
 * being forwarded to a group chat is that it does not exist client-side until
 * the join window opens and the server agrees you paid.
 */
export function JoinButton({ sessionId, startsAt, endsAt }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const opensAt = new Date(startsAt).getTime() - JOIN_WINDOW_BEFORE_MS;
  const closesAt = new Date(endsAt).getTime() + 60 * 60 * 1000;
  const isOpen = now >= opensAt && now <= closesAt;

  async function handleJoin() {
    setIsLoading(true);
    try {
      const { joinUrl, passcode } = await fetchData<{
        joinUrl: string | null;
        passcode: string | null;
      }>(`/live/${sessionId}/join`);

      if (!joinUrl) {
        toast.error("The host has not added the meeting link yet.");
        return;
      }

      if (passcode) {
        toast.info(`Passcode: ${passcode}`, { duration: 20000 });
      }
      window.open(joinUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Could not get the link"));
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    const mins = minutesUntilOpen(startsAt, now);
    return (
      <Button variant="outline" disabled className="gap-1.5">
        <IconLock size={15} />
        {mins > 60
          ? "Link opens 10 min before"
          : `Link opens in ${Math.max(1, mins)} min`}
      </Button>
    );
  }

  return (
    <Button onClick={handleJoin} disabled={isLoading} className="gap-1.5">
      {isLoading ? (
        <IconLoader2 size={15} className="animate-spin" />
      ) : (
        <IconExternalLink size={15} />
      )}
      Join class
    </Button>
  );
}
