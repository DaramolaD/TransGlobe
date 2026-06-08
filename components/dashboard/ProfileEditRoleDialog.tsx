"use client";

import { useState } from "react";
import { UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRoleForm } from "@/app/app/superadmin/users/UserRoleForm";
import {
  scrollableDialogBodyClass,
  scrollableDialogContentClass,
} from "@/lib/dashboard/scrollable-dialog";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types/database";

export function ProfileEditRoleDialog({
  userId,
  currentRole,
  mode,
}: {
  userId: string;
  currentRole: UserRole;
  mode: "team" | "customer";
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 bg-background/80 shadow-sm"
        onClick={() => setOpen(true)}
      >
        <UserCog className="h-3.5 w-3.5 mr-1.5" />
        Edit role
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn(scrollableDialogContentClass, "sm:max-w-md")}>
          <DialogHeader className="shrink-0 border-b px-6 py-4 space-y-1">
            <DialogTitle>Edit role</DialogTitle>
            <DialogDescription>
              Change access for this account. The user must sign in again for menu
              changes to apply.
            </DialogDescription>
          </DialogHeader>
          <div className={cn(scrollableDialogBodyClass, "px-6 py-4")}>
            <UserRoleForm userId={userId} currentRole={currentRole} mode={mode} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
