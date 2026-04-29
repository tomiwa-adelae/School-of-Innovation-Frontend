"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import api from "@/lib/api";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  IconShield,
  IconShieldCheck,
  IconUserPlus,
  IconDotsVertical,
  IconRefresh,
  IconTrash,
  IconSearch,
  IconLoader2,
  IconCrown,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Position = "SUPER_ADMIN" | "ADMIN" | "MODERATOR";

interface TeamMember {
  id: string;
  userId: string;
  position: Position;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    image: string | null;
    createdAt: string;
  };
}

interface AdminRecord {
  id: string;
  userId: string;
  position: Position;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const positionConfig: Record<
  Position,
  { label: string; className: string; icon: React.ElementType }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    icon: IconCrown,
    className:
      "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700",
  },
  ADMIN: {
    label: "Admin",
    icon: IconShieldCheck,
    className:
      "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700",
  },
  MODERATOR: {
    label: "Moderator",
    icon: IconShield,
    className:
      "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600",
  },
};

const POSITIONS: Position[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];

// ─── Assign Dialog ────────────────────────────────────────────────────────────

function AssignDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState<Position>("MODERATOR");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(null);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    if (!email.trim()) return;
    setSearching(true);
    setFoundUser(null);
    setSearchError("");
    try {
      const user = await fetchData<any>(`/admin-team/search?email=${encodeURIComponent(email.trim())}`);
      setFoundUser(user);
    } catch (err: any) {
      setSearchError(err?.response?.data?.message ?? "User not found");
    } finally {
      setSearching(false);
    }
  };

  const assignMutation = useMutation({
    mutationFn: () =>
      api.post("/admin-team/assign", { email: foundUser!.email, position }),
    onSuccess: () => {
      toast.success(`${foundUser?.firstName} added as ${positionConfig[position].label}`);
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      handleClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to assign team member");
    },
  });

  const handleClose = () => {
    setEmail("");
    setPosition("MODERATOR");
    setFoundUser(null);
    setSearchError("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Search for a user by email and assign them a role on the admin team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email search */}
          <div className="space-y-2">
            <Label>User Email</Label>
            <div className="flex gap-2">
              <Input
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFoundUser(null);
                  setSearchError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSearch}
                disabled={searching || !email.trim()}
              >
                {searching ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconSearch className="size-4" />
                )}
              </Button>
            </div>
            {searchError && (
              <p className="text-xs text-destructive">{searchError}</p>
            )}
          </div>

          {/* Found user preview */}
          {foundUser && (
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
              <Avatar className="h-9 w-9 rounded-md">
                <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xs font-bold">
                  {foundUser.firstName[0]}
                  {foundUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {foundUser.firstName} {foundUser.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {foundUser.email}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {foundUser.role === "ADMINISTRATOR"
                  ? "Admin"
                  : foundUser.role === "INSTRUCTOR"
                  ? "Instructor"
                  : "Student"}
              </Badge>
            </div>
          )}

          {/* Position select */}
          <div className="space-y-2">
            <Label>Assign Position</Label>
            <div className="grid grid-cols-3 gap-2">
              {POSITIONS.map((p) => {
                const cfg = positionConfig[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPosition(p)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all",
                      position === p
                        ? `${cfg.className} ring-2 ring-offset-1`
                        : "border-border hover:bg-muted"
                    )}
                  >
                    <cfg.icon size={16} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={!foundUser || assignMutation.isPending}
            onClick={() => assignMutation.mutate()}
          >
            {assignMutation.isPending ? <Loader text="Assigning..." /> : "Assign Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Change Position Dialog ───────────────────────────────────────────────────

function ChangePositionDialog({
  member,
  onClose,
}: {
  member: TeamMember | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [position, setPosition] = useState<Position>(
    member?.position ?? "MODERATOR"
  );

  useEffect(() => {
    if (member) setPosition(member.position);
  }, [member]);

  const mutation = useMutation({
    mutationFn: () =>
      api.patch(`/admin-team/${member!.userId}/position`, { position }),
    onSuccess: () => {
      toast.success("Position updated");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to update position");
    },
  });

  if (!member) return null;

  return (
    <Dialog open={!!member} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Position</DialogTitle>
          <DialogDescription>
            Update the role for {member.user.firstName} {member.user.lastName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {POSITIONS.map((p) => {
            const cfg = positionConfig[p];
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs font-medium transition-all",
                  position === p
                    ? `${cfg.className} ring-2 ring-offset-1`
                    : "border-border hover:bg-muted"
                )}
              >
                <cfg.icon size={16} />
                {cfg.label}
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={position === member.position || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader text="Saving..." /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTeamClient() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showAssign, setShowAssign] = useState(false);
  const [changeTarget, setChangeTarget] = useState<TeamMember | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMINISTRATOR") router.push("/dashboard");
  }, [user, router]);

  const { data: team = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["admin-team"],
    queryFn: () => fetchData("/admin-team"),
    enabled: user?.role === "ADMINISTRATOR",
  });

  const { data: myRecord } = useQuery<AdminRecord | null>({
    queryKey: ["admin-team-me"],
    queryFn: () => fetchData("/admin-team/me"),
    enabled: user?.role === "ADMINISTRATOR",
  });

  const isSuperAdmin = myRecord?.position === "SUPER_ADMIN";

  const removeMutation = useMutation({
    mutationFn: (targetUserId: string) =>
      api.delete(`/admin-team/${targetUserId}`),
    onSuccess: () => {
      toast.success("Team member removed");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      setRemoveTarget(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to remove team member");
    },
  });

  if (!user || user.role !== "ADMINISTRATOR") return null;

  // Stats
  const superAdmins = team.filter((m) => m.position === "SUPER_ADMIN").length;
  const admins = team.filter((m) => m.position === "ADMIN").length;
  const moderators = team.filter((m) => m.position === "MODERATOR").length;

  const stats = [
    { label: "Total Members", value: team.length, icon: IconShield },
    { label: "Super Admins", value: superAdmins, icon: IconCrown },
    { label: "Admins", value: admins, icon: IconShieldCheck },
    { label: "Moderators", value: moderators, icon: IconShield },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        back
        title="Admin Team"
        description="Manage who has administrative access to the platform."
        action={
          isSuperAdmin ? (
            <Button onClick={() => setShowAssign(true)}>
              <IconUserPlus size={16} />
              Add Team Member
            </Button>
          ) : undefined
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
              <s.icon size={20} className="text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Team Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      ) : team.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800">
          <IconShield size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="font-bold">No team members yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first admin or moderator to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="p-0 hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Added</TableHead>
                  {isSuperAdmin && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => {
                  const cfg = positionConfig[member.position];
                  const isMe = member.userId === user.id;
                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-md">
                            <AvatarImage src={member.user.image ?? undefined} />
                            <AvatarFallback className="rounded-md bg-gradient-to-br from-blue-700 to-primary text-white text-xs font-black">
                              {member.user.firstName[0]}
                              {member.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {member.user.firstName} {member.user.lastName}
                              {isMe && (
                                <span className="ml-2 text-[10px] text-muted-foreground font-normal">
                                  (you)
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              @{member.user.username}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {member.user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("gap-1.5", cfg.className)}
                        >
                          <cfg.icon size={11} />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(member.createdAt)}
                      </TableCell>
                      {isSuperAdmin && (
                        <TableCell className="text-right">
                          {!isMe && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <IconDotsVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setChangeTarget(member)}
                                >
                                  <IconRefresh size={14} className="mr-2" />
                                  Change Position
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setRemoveTarget(member)}
                                >
                                  <IconTrash size={14} className="mr-2" />
                                  Remove from Team
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-2 sm:hidden">
            {team.map((member) => {
              const cfg = positionConfig[member.position];
              const isMe = member.userId === user.id;
              return (
                <Card key={member.id} className="p-0 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-md">
                          <AvatarImage src={member.user.image ?? undefined} />
                          <AvatarFallback className="rounded-md bg-primary text-primary-foreground font-black text-xs">
                            {member.user.firstName[0]}
                            {member.user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {member.user.firstName} {member.user.lastName}
                            {isMe && (
                              <span className="ml-1 text-[10px] text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{member.user.username}
                          </p>
                        </div>
                      </div>
                      {isSuperAdmin && !isMe && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="-mr-2">
                              <IconDotsVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setChangeTarget(member)}
                            >
                              <IconRefresh size={14} className="mr-2" />
                              Change Position
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setRemoveTarget(member)}
                            >
                              <IconTrash size={14} className="mr-2" />
                              Remove from Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Email</span>
                        <span className="text-xs font-medium">{member.user.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Position</span>
                        <Badge variant="outline" className={cn("gap-1 text-[10px]", cfg.className)}>
                          <cfg.icon size={10} />
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Added</span>
                        <span className="text-xs">{formatDate(member.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Modals */}
      <AssignDialog open={showAssign} onClose={() => setShowAssign(false)} />

      <ChangePositionDialog
        member={changeTarget}
        onClose={() => setChangeTarget(null)}
      />

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={() => setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-semibold">
                {removeTarget?.user.firstName} {removeTarget?.user.lastName}
              </span>{" "}
              from the admin team and revert their account to a regular user. This action can be undone by re-assigning them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                removeTarget && removeMutation.mutate(removeTarget.userId)
              }
            >
              {removeMutation.isPending ? (
                <IconLoader2 className="size-4 animate-spin mr-2" />
              ) : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
