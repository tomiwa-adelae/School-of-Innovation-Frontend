"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, updateData, postData } from "@/lib/api";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconLoader2,
  IconRocket,
  IconUsers,
  IconExternalLink,
  IconAlertTriangle,
  IconVideo,
  IconCopy,
} from "@tabler/icons-react";

interface Registrant {
  id: string;
  paidAt: string | null;
  amountPaid: number | null;
  attendedAt: string | null;
  manuallyRegistered: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
}

type HostSession = LiveSession & {
  passcode: string | null;
  registrations: Registrant[];
};

export default function ManageLiveClient() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [recordingUrl, setRecordingUrl] = useState("");

  const key = ["live-session", sessionId];

  const { data: session, isLoading } = useQuery<HostSession>({
    queryKey: key,
    queryFn: () => fetchData(`/live/${sessionId}`),
    enabled: !!sessionId,
  });

  function onError(err: any) {
    const msg = err?.response?.data?.message;
    toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Something went wrong"));
  }

  const publish = useMutation({
    mutationFn: () => updateData(`/live/${sessionId}/publish`, {}),
    onSuccess: () => {
      toast.success("Class published — it is now open for registration.");
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["hosting-live-sessions"] });
    },
    onError,
  });

  const cancel = useMutation({
    mutationFn: () =>
      updateData<{ totalOwed: number; refundsOwed: unknown[] }>(
        `/live/${sessionId}/cancel`,
        { reason: cancelReason || undefined },
      ),
    onSuccess: (data) => {
      setConfirmCancel(false);
      qc.invalidateQueries({ queryKey: key });
      if (data.refundsOwed.length > 0) {
        toast.warning(
          `Cancelled. ${data.refundsOwed.length} paid registrant(s) are owed refunds totalling ${data.totalOwed.toLocaleString()}.`,
          { duration: 12000 },
        );
      } else {
        toast.success("Class cancelled and everyone notified.");
      }
    },
    onError,
  });

  const saveRecording = useMutation({
    mutationFn: () => updateData(`/live/${sessionId}`, { recordingUrl }),
    onSuccess: () => {
      toast.success("Recording link saved — registrants can watch it now.");
      qc.invalidateQueries({ queryKey: key });
    },
    onError,
  });

  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center py-20">
        <IconLoader2 size={28} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isPast = new Date(session.endsAt).getTime() < Date.now();
  const paidCount = session.registrations.filter((r) => r.paidAt).length;
  const revenue = session.registrations.reduce(
    (sum, r) => sum + (r.amountPaid ?? 0),
    0,
  );

  function copyLink() {
    navigator.clipboard
      .writeText(`${window.location.origin}/live/${session!.slug}`)
      .then(() => toast.success("Public link copied"))
      .catch(() => toast.error("Could not copy"));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <PageHeader
          back
          fallbackHref="/dashboard/live"
          title={session.title}
          description={formatSessionTime(
            session.startsAt,
            session.endsAt,
            session.timezone,
          )}
          badges={[
            session.status.toLowerCase().replace("_", " "),
            isPast ? "finished" : countdownLabel(session.startsAt),
          ]}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={copyLink}>
            <IconCopy size={15} /> Copy link
          </Button>
          {session.status !== "DRAFT" && (
            <Button asChild variant="outline">
              <Link href={`/live/${session.slug}`} target="_blank">
                <IconExternalLink size={15} /> View page
              </Link>
            </Button>
          )}
          {session.status === "DRAFT" && (
            <Button onClick={() => publish.mutate()} disabled={publish.isPending}>
              {publish.isPending ? (
                <IconLoader2 size={15} className="animate-spin" />
              ) : (
                <>
                  <IconRocket size={15} /> Publish
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Registered" value={session.registrations.length} />
        <Stat label="Paid" value={paidCount} />
        <Stat
          label="Revenue"
          value={formatMoney(revenue || null, session.currency)}
        />
        <Stat
          label="Seats"
          value={session.capacity === null ? "Unlimited" : session.capacity}
        />
      </div>

      {session.status === "DRAFT" && !session.meetingUrl && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-4 flex gap-3 text-sm">
          <IconAlertTriangle
            size={18}
            className="text-amber-600 shrink-0 mt-0.5"
          />
          <p className="text-amber-800 dark:text-amber-400">
            Add your Zoom or Meet link before publishing — students cannot join
            without it.
          </p>
        </div>
      )}

      {/* Recording, once the class is done */}
      {isPast && (
        <div className="rounded-3xl border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <IconVideo size={17} className="text-purple-600" />
            <h2 className="font-bold text-sm">Recording</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Paste the recording link and everyone who registered can watch it.
            This is what makes the class worth buying for people who could not
            attend live.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={recordingUrl || session.recordingUrl || ""}
              onChange={(e) => setRecordingUrl(e.target.value)}
              placeholder="https://…"
              className="flex-1 rounded-2xl"
            />
            <Button
              onClick={() => saveRecording.mutate()}
              disabled={saveRecording.isPending || !recordingUrl}
            >
              {saveRecording.isPending ? (
                <IconLoader2 size={15} className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Roster */}
      <div className="rounded-3xl border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <IconUsers size={17} />
          <h2 className="font-bold text-sm">
            Roster ({session.registrations.length})
          </h2>
          <p className="text-xs text-muted-foreground ml-auto">
            Use this to admit people from your waiting room
          </p>
        </div>

        {session.registrations.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No one has registered yet.
          </p>
        ) : (
          <div className="divide-y">
            {session.registrations.map((r) => (
              <div key={r.id} className="p-3 flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={r.user.image ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {`${r.user.firstName?.[0] ?? ""}${r.user.lastName?.[0] ?? ""}`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {r.user.firstName} {r.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.user.email}
                  </p>
                </div>
                {r.manuallyRegistered && (
                  <Badge variant="outline">added by admin</Badge>
                )}
                {r.attendedAt && <Badge variant="secondary">joined</Badge>}
                {r.amountPaid ? (
                  <span className="text-xs font-semibold tabular-nums">
                    {formatMoney(r.amountPaid, session.currency)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">free</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel */}
      {!isPast && session.status !== "CANCELLED" && (
        <div className="rounded-3xl border border-red-200 dark:border-red-900 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm">Cancel this class</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Everyone registered is notified. Refunds are handled by support —
              you will get the list of who is owed what.
            </p>
          </div>
          <Button variant="destructive" onClick={() => setConfirmCancel(true)}>
            Cancel class
          </Button>
        </div>
      )}

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this class?</AlertDialogTitle>
            <AlertDialogDescription>
              {paidCount > 0
                ? `${paidCount} person(s) have paid. They will be notified and shown as owed a refund — this does not refund them automatically.`
                : "Everyone registered will be notified that it is not going ahead."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason (optional, shared with registrants)"
            className="rounded-2xl"
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancel.mutate()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Cancel class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
    </div>
  );
}
