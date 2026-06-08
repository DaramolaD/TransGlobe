"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  markNotificationRead,
  type StaffInboxSummary,
} from "@/lib/actions/notifications";

export function StaffNotificationBell({ inbox }: { inbox: StaffInboxSummary }) {
  const router = useRouter();
  const { unreadCount, items } = inbox;

  async function openItem(id: string, href: string) {
    await markNotificationRead(id);
    router.push(href);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 shrink-0"
          aria-label={
            unreadCount > 0
              ? `${unreadCount} unread notifications`
              : "Notifications"
          }
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">Notifications</span>
            {unreadCount > 0 ? (
              <span className="text-xs text-muted-foreground">{unreadCount} new</span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          items.slice(0, 8).map((item) => (
            <DropdownMenuItem key={item.id} asChild>
              <button
                type="button"
                className={cn(
                  "w-full cursor-pointer flex flex-col items-start gap-0.5 py-2",
                  !item.read && "bg-primary/5"
                )}
                onClick={() => openItem(item.id, item.href)}
              >
                <span className={cn("text-sm", !item.read && "font-semibold")}>
                  {item.title}
                </span>
                {item.body ? (
                  <span className="text-xs text-muted-foreground line-clamp-2 text-left">
                    {item.body}
                  </span>
                ) : null}
                <span className="text-[10px] text-muted-foreground">
                  {new Date(item.created_at).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </button>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/app/admin/claims" className="cursor-pointer text-sm">
            View all claims
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
