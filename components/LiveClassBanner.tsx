"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch } from "@/lib/api";
import { countdownLabel, formatMoney } from "@/lib/live";
import { IconX, IconBroadcast } from "@tabler/icons-react";

interface BannerSession {
  id: string;
  title: string;
  slug: string;
  startsAt: string;
  timezone: string;
  price: number | null;
  currency: string | null;
  pricingType: string;
}

const DISMISS_KEY = "live-banner-dismissed";

/**
 * Site-wide strip advertising the next live class within seven days.
 *
 * Dismissal is stored per session id, so hiding one banner does not hide the
 * next class — and it is per-browser, which is all this needs to be.
 */
export function LiveClassBanner() {
  const [session, setSession] = useState<BannerSession | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    let cancelled = false;

    publicFetch<BannerSession | null>("/public/live/banner")
      .then((data) => {
        if (cancelled || !data) return;
        setSession(data);

        // Reading storage can throw in private modes — never let it break render.
        try {
          setDismissed(localStorage.getItem(DISMISS_KEY) === data.id);
        } catch {
          setDismissed(false);
        }
      })
      .catch(() => {
        /* No banner is a fine outcome. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!session || dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    try {
      if (session) localStorage.setItem(DISMISS_KEY, session.id);
    } catch {
      /* Dismissal simply will not persist. */
    }
  }

  const isFree = session.pricingType === "FREE";

  return (
    <div className="relative bg-purple-600 text-white">
      <Link
        href={`/live/${session.slug}`}
        className="flex items-center justify-center gap-x-3 gap-y-1 flex-wrap px-10 py-2.5 text-sm hover:bg-purple-700 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <IconBroadcast size={16} />
          Live class
        </span>
        <span className="font-medium">{session.title}</span>
        <span className="text-purple-200">
          {countdownLabel(session.startsAt)}
          {" · "}
          {isFree ? "Free" : formatMoney(session.price, session.currency)}
        </span>
        <span className="underline underline-offset-2 font-semibold">
          Reserve a seat
        </span>
      </Link>

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-purple-800 transition-colors"
      >
        <IconX size={15} />
      </button>
    </div>
  );
}
