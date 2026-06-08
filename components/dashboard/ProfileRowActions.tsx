"use client";

import Link from "next/link";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { profileDetailHref } from "@/lib/dashboard/profile-links";
import type { ProfileListItem } from "@/lib/dashboard/profile-table-rows";

export function ProfileRowActions({
  profile,
  audience,
  onViewPreview,
}: {
  profile: ProfileListItem;
  audience: "team" | "customer";
  onViewPreview: () => void;
}) {
  const detailHref = profileDetailHref(profile.id, audience);

  return (
    <div className="flex justify-end" data-no-row-click>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground data-[state=open]:bg-muted"
            aria-label="Row actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={onViewPreview}>Quick view</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={detailHref} className="flex items-center">
              View full details
              <ExternalLink className="ml-auto h-3.5 w-3.5 opacity-60" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
