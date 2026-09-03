/** Shared types and time helpers for live classes. */

export type LiveSessionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "ENDED"
  | "CANCELLED";

export type MeetingProvider = "MANUAL_LINK" | "ZOOM" | "GOOGLE_MEET";

export interface LiveSessionHost {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
  bio?: string | null;
}

export interface LiveSession {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  startsAt: string;
  endsAt: string;
  timezone: string;
  capacity: number | null;
  status: LiveSessionStatus;
  pricingType: "FREE" | "PAID" | "SUBSCRIPTION";
  price: number | null;
  currency: string | null;
  provider: MeetingProvider;
  courseId: string | null;
  host: LiveSessionHost;
  _count: { registrations: number };
  recordingUrl?: string | null;
  meetingUrl?: string | null;
  seatsLeft?: number | null;
  isSoldOut?: boolean;
}

export interface MyLiveSession {
  id: string;
  paidAt: string | null;
  amountPaid: number | null;
  attendedAt: string | null;
  session: LiveSession;
  canJoin: boolean;
  isPast: boolean;
}

/** Mirrors JOIN_WINDOW_BEFORE_MS on the server. */
export const JOIN_WINDOW_BEFORE_MS = 10 * 60 * 1000;

/**
 * Render a session's time in its own timezone, with the zone label.
 *
 * The label is not decoration: Nigeria is UTC+1 year-round, so a diaspora
 * student reading "7:00pm" with no zone will reliably get it wrong.
 */
export function formatSessionTime(
  startsAt: string,
  endsAt: string,
  timeZone: string,
): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  try {
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(start);

    const time = (d: Date) =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d);

    const zone =
      new Intl.DateTimeFormat("en-GB", { timeZone, timeZoneName: "short" })
        .formatToParts(start)
        .find((p) => p.type === "timeZoneName")?.value ?? timeZone;

    return `${date}, ${time(start)}–${time(end)} ${zone}`;
  } catch {
    return start.toLocaleString();
  }
}

/** The same instant in the viewer's own zone, for the "your time" line. */
export function formatInViewerZone(startsAt: string): string {
  const start = new Date(startsAt);
  const zone =
    new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(start)
      .find((p) => p.type === "timeZoneName")?.value ?? "local time";

  return `${new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(start)} ${zone}`;
}

/** True when the viewer's zone differs from the session's. */
export function viewerZoneDiffers(timeZone: string): boolean {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone !== timeZone;
  } catch {
    return false;
  }
}

export function formatMoney(
  price: number | null | undefined,
  currency: string | null | undefined,
): string {
  if (!price) return "Free";
  const code = currency ?? "NGN";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${code} ${price.toLocaleString()}`;
  }
}

/** Human countdown: "in 3 days", "in 2 hours", "in 12 minutes", "now". */
export function countdownLabel(startsAt: string, now = Date.now()): string {
  const diff = new Date(startsAt).getTime() - now;
  if (diff <= 0) return "now";

  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `in ${minutes} min`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? "" : "s"}`;

  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}
