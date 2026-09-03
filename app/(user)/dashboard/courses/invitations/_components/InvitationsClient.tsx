"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@/lib/api";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconLoader2,
  IconMailOpened,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

interface Invitation {
  id: string;
  role: "CO_INSTRUCTOR" | "ASSISTANT";
  revenueShare: number;
  createdAt: string;
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
    shortDescription: string | null;
    instructor: {
      id: string;
      firstName: string;
      lastName: string;
      image: string | null;
    };
  };
}

const ROLE_LABEL: Record<Invitation["role"], string> = {
  CO_INSTRUCTOR: "Co-instructor",
  ASSISTANT: "Assistant",
};

export default function InvitationsClient() {
  const qc = useQueryClient();
  const router = useRouter();

  const { data: invitations = [], isLoading } = useQuery<Invitation[]>({
    queryKey: ["collaboration-invitations"],
    queryFn: () => fetchData("/collaborations/invitations"),
  });

  const respond = useMutation({
    mutationFn: ({ id, accept }: { id: string; accept: boolean }) =>
      postData(
        `/collaborations/invitations/${id}/${accept ? "accept" : "decline"}`,
        {},
      ),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["collaboration-invitations"] });
      qc.invalidateQueries({ queryKey: ["my-courses"] });
      if (variables.accept) {
        toast.success("Invitation accepted — the course is now in My Courses.");
        router.push("/dashboard/courses");
      } else {
        toast.success("Invitation declined.");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : (msg ?? "Could not respond"));
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course invitations"
        description="Instructors who want to build a course with you."
      />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IconLoader2 size={16} className="animate-spin" />
          Loading invitations…
        </div>
      ) : invitations.length === 0 ? (
        <div className="rounded-3xl border border-dashed py-16 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <IconMailOpened size={26} className="text-gray-400" />
          </div>
          <div>
            <p className="font-semibold">No pending invitations</p>
            <p className="text-sm text-muted-foreground mt-1">
              When another instructor invites you to collaborate, it will show
              up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {invitations.map((invite) => {
            const owner = invite.course.instructor;
            const isPending = respond.isPending;

            return (
              <div
                key={invite.id}
                className="rounded-3xl border p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="relative w-full sm:w-40 aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  {invite.course.thumbnail ? (
                    <Image
                      src={invite.course.thumbnail}
                      alt={invite.course.title}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold truncate">
                      {invite.course.title}
                    </h3>
                    <Badge variant="secondary">
                      {ROLE_LABEL[invite.role]}
                    </Badge>
                    {invite.revenueShare > 0 && (
                      <Badge variant="outline">
                        {invite.revenueShare}% revenue
                      </Badge>
                    )}
                  </div>

                  {invite.course.shortDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {invite.course.shortDescription}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <Avatar className="size-6">
                      <AvatarImage src={owner.image ?? undefined} />
                      <AvatarFallback className="text-[10px]">
                        {`${owner.firstName?.[0] ?? ""}${owner.lastName?.[0] ?? ""}`.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground">
                      Invited by {owner.firstName} {owner.lastName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        respond.mutate({ id: invite.id, accept: true })
                      }
                    >
                      <IconCheck size={15} /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() =>
                        respond.mutate({ id: invite.id, accept: false })
                      }
                    >
                      <IconX size={15} /> Decline
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
