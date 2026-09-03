"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData, updateData, deleteData } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconUserPlus,
  IconTrash,
  IconLoader2,
  IconClock,
} from "@tabler/icons-react";

type Role = "CO_INSTRUCTOR" | "ASSISTANT";

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
}

interface Collaborator {
  id: string;
  role: Role;
  revenueShare: number;
  acceptedAt: string | null;
  declinedAt: string | null;
  user: Person;
}

interface CollaboratorsResponse {
  owner: Person & { revenueShare: number };
  collaborators: Collaborator[];
  availableShare: number;
}

const ROLE_LABEL: Record<Role, string> = {
  CO_INSTRUCTOR: "Co-instructor",
  ASSISTANT: "Assistant",
};

const ROLE_HINT: Record<Role, string> = {
  CO_INSTRUCTOR: "Can edit content and curriculum",
  ASSISTANT: "Can view the course; no content edits",
};

function initials(p: Person) {
  return `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase();
}

/**
 * Owner-facing panel for inviting co-instructors and dividing revenue.
 *
 * The owner's share is always the remainder, so the two numbers can never
 * drift out of sync — the API rejects any set of shares totalling over 100%.
 */
export function CollaboratorsPanel({
  courseId,
  isOwner,
}: {
  courseId: string;
  isOwner: boolean;
}) {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("CO_INSTRUCTOR");
  const [share, setShare] = useState("0");

  const key = ["course-collaborators", courseId];

  const { data, isLoading } = useQuery<CollaboratorsResponse>({
    queryKey: key,
    queryFn: () => fetchData(`/courses/${courseId}/collaborators`),
  });

  function onError(err: any) {
    const msg = err?.response?.data?.message;
    toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Something went wrong"));
  }

  const invite = useMutation({
    mutationFn: () =>
      postData(`/courses/${courseId}/collaborators`, {
        email: email.trim(),
        role,
        revenueShare: Number(share) || 0,
      }),
    onSuccess: () => {
      toast.success("Invitation sent");
      setEmail("");
      setShare("0");
      qc.invalidateQueries({ queryKey: key });
    },
    onError,
  });

  const updateCollaborator = useMutation({
    mutationFn: ({ id, ...body }: { id: string; role?: Role; revenueShare?: number }) =>
      updateData(`/courses/${courseId}/collaborators/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError,
  });

  const removeCollaborator = useMutation({
    mutationFn: (id: string) =>
      deleteData(`/courses/${courseId}/collaborators/${id}`),
    onSuccess: () => {
      toast.success("Collaborator removed");
      qc.invalidateQueries({ queryKey: key });
    },
    onError,
  });

  if (isLoading || !data) {
    return (
      <div className="rounded-3xl border p-5 flex items-center gap-2 text-sm text-muted-foreground">
        <IconLoader2 size={16} className="animate-spin" />
        Loading collaborators…
      </div>
    );
  }

  return (
    <div className="rounded-3xl border p-5 space-y-5">
      <div>
        <h3 className="font-bold text-sm">Collaborators</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Invite another instructor to build this course with you and set how
          the revenue is divided.
        </p>
      </div>

      {/* Owner row — share is whatever the collaborators do not take */}
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src={data.owner.image ?? undefined} />
          <AvatarFallback>{initials(data.owner)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">
            {data.owner.firstName} {data.owner.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {data.owner.email}
          </p>
        </div>
        <Badge variant="secondary">Owner</Badge>
        <span className="text-sm font-bold tabular-nums w-12 text-right">
          {data.owner.revenueShare}%
        </span>
      </div>

      {data.collaborators.map((c) => (
        <div key={c.id} className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={c.user.image ?? undefined} />
            <AvatarFallback>{initials(c.user)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate flex items-center gap-1.5">
              {c.user.firstName} {c.user.lastName}
              {!c.acceptedAt && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                  <IconClock size={12} /> pending
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {c.user.email}
            </p>
          </div>

          {isOwner ? (
            <>
              <Select
                value={c.role}
                onValueChange={(v) =>
                  updateCollaborator.mutate({ id: c.id, role: v as Role })
                }
              >
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min={0}
                max={100}
                defaultValue={c.revenueShare}
                onBlur={(e) => {
                  const next = Number(e.target.value);
                  if (next !== c.revenueShare) {
                    updateCollaborator.mutate({ id: c.id, revenueShare: next });
                  }
                }}
                className="w-[70px] h-8 text-xs tabular-nums"
                aria-label="Revenue share percent"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCollaborator.mutate(c.id)}
                aria-label="Remove collaborator"
              >
                <IconTrash size={15} className="text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Badge variant="outline">{ROLE_LABEL[c.role]}</Badge>
              <span className="text-sm font-bold tabular-nums w-12 text-right">
                {c.revenueShare}%
              </span>
            </>
          )}
        </div>
      ))}

      {isOwner && (
        <div className="pt-4 border-t space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="instructor@example.com"
              className="flex-1"
            />
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="sm:w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={0}
              max={data.availableShare}
              value={share}
              onChange={(e) => setShare(e.target.value)}
              className="sm:w-[90px] tabular-nums"
              aria-label="Revenue share percent"
            />
            <Button
              onClick={() => invite.mutate()}
              disabled={!email.trim() || invite.isPending}
            >
              {invite.isPending ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <IconUserPlus size={16} /> Invite
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {ROLE_HINT[role]} · {data.availableShare}% of revenue is still
            unallocated. They must already have an instructor account.
          </p>
        </div>
      )}
    </div>
  );
}
