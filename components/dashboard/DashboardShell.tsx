"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Package,
  LogOut,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "@/lib/actions/auth";
import type { UserRole } from "@/lib/types/database";
import { ROLE_HOME, ROLE_LABELS } from "@/lib/auth/roles";
import { dashboardContentClass } from "@/lib/dashboard/layout";
import {
  getNavForRole,
  getNavGroupsForRole,
  type NavGroup,
  type NavItem,
} from "@/lib/dashboard/nav-config";
import { StaffNotificationBell } from "@/components/dashboard/StaffNotificationBell";
import type { StaffInboxSummary } from "@/lib/actions/notifications";

export type { NavItem };

export { getNavForRole, getNavGroupsForRole };

function NavCountBadge({ count }: { count?: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function groupBadgeTotal(group: NavGroup, navBadges: Record<string, number>): number {
  return group.items.reduce((sum, item) => sum + (navBadges[item.href] ?? 0), 0);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getActiveNavLabel(pathname: string, nav: NavItem[], role: UserRole): string {
  const homeHref = ROLE_HOME[role];
  const sorted = [...nav].sort((a, b) => b.href.length - a.href.length);

  for (const item of sorted) {
    if (pathname === item.href) return item.label;
    if (item.href !== homeHref && pathname.startsWith(item.href + "/")) {
      return item.label;
    }
  }

  return nav[0]?.label ?? "Dashboard";
}

function isNavItemActive(pathname: string, href: string, role: UserRole): boolean {
  const homeHref = ROLE_HOME[role];
  return (
    pathname === href ||
    (href !== homeHref && pathname.startsWith(href + "/"))
  );
}

function groupHasActiveItem(
  group: NavGroup,
  pathname: string,
  role: UserRole
): boolean {
  return group.items.some((item) =>
    isNavItemActive(pathname, item.href, role)
  );
}

function CollapsedNavGroupMenu({
  group,
  pathname,
  role,
  navBadges,
}: {
  group: NavGroup;
  pathname: string;
  role: UserRole;
  navBadges: Record<string, number>;
}) {
  const GroupIcon = group.icon;
  const isActive = groupHasActiveItem(group, pathname, role);
  const badgeTotal = groupBadgeTotal(group, navBadges);

  return (
    <SidebarGroup className="py-0.5">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip={group.label}
                  isActive={isActive}
                  className="relative data-[state=open]:bg-sidebar-accent"
                >
                  <GroupIcon />
                  <span>{group.label}</span>
                  {badgeTotal > 0 ? (
                    <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {badgeTotal > 9 ? "9+" : badgeTotal}
                    </span>
                  ) : null}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="start"
                sideOffset={12}
                className="min-w-52"
              >
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {group.label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isNavItemActive(pathname, item.href, role);
                  const badge = navBadges[item.href];
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "cursor-pointer gap-2",
                          active && "bg-accent font-medium"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {badge ? (
                          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function CollapsibleNavGroup({
  group,
  pathname,
  role,
  defaultOpen,
  navBadges,
}: {
  group: NavGroup;
  pathname: string;
  role: UserRole;
  defaultOpen: boolean;
  navBadges: Record<string, number>;
}) {
  const { state, isMobile } = useSidebar();
  const GroupIcon = group.icon;
  const isSingleItem = group.items.length === 1;
  const groupActive = groupHasActiveItem(group, pathname, role);
  const isCollapsedIcon = state === "collapsed" && !isMobile;

  if (isSingleItem) {
    const item = group.items[0]!;
    const Icon = item.icon;
    const active = isNavItemActive(pathname, item.href, role);
    return (
      <SidebarGroup className="py-0.5">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                <Link href={item.href}>
                  <Icon />
                  <span>{item.label}</span>
                  <NavCountBadge count={navBadges[item.href]} />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isCollapsedIcon) {
    return (
      <CollapsedNavGroupMenu
        group={group}
        pathname={pathname}
        role={role}
        navBadges={navBadges}
      />
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarGroup className="py-0.5">
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={group.label}
                  isActive={groupActive}
                  className="justify-between gap-2"
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2">
                    <GroupIcon className="size-4 shrink-0" />
                    <span className="truncate">{group.label}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mx-0 mt-0.5 gap-0.5 border-0 px-0 py-0 pl-3">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isNavItemActive(pathname, item.href, role);
                    return (
                      <SidebarMenuSubItem key={item.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={active}
                          className="h-8 gap-2"
                        >
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.label}</span>
                            <NavCountBadge count={navBadges[item.href]} />
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function DashboardShellLayout({
  role,
  userName,
  userEmail,
  avatarUrl,
  staffInbox,
  navBadges = {},
  children,
}: {
  role: UserRole;
  userName: string;
  userEmail?: string | null;
  avatarUrl?: string | null;
  staffInbox?: StaffInboxSummary | null;
  navBadges?: Record<string, number>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const navGroups = useMemo(() => getNavGroupsForRole(role), [role]);
  const nav = useMemo(() => getNavForRole(role), [role]);
  const activeLabel = getActiveNavLabel(pathname, nav, role);
  const initials = getInitials(userName);
  const isCollapsedIcon = state === "collapsed" && !isMobile;

        return (
    <>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip="SwiftCargo">
                <Link href="/">
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Package className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">SwiftCargo</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {ROLE_LABELS[role]} Portal
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent
          className={cn(
            "gap-0.5 py-2",
            isCollapsedIcon && "items-center px-1"
          )}
        >
          {navGroups.map((group, index) => (
            <div key={group.id} className={cn("w-full", isCollapsedIcon && "flex flex-col items-center")}>
              {isCollapsedIcon && index > 0 ? (
                <SidebarSeparator className="my-1.5 w-6" />
              ) : null}
              <CollapsibleNavGroup
                group={group}
                pathname={pathname}
                role={role}
                defaultOpen={groupHasActiveItem(group, pathname, role)}
                navBadges={navBadges}
              />
            </div>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <form action={signOut} className="w-full">
                <SidebarMenuButton type="submit" tooltip="Sign out">
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 bg-muted/30">
        <header className="sticky top-0 z-20 shrink-0 border-b bg-background">
          <div
            className={cn(
              dashboardContentClass,
              "flex h-14 items-center gap-3"
            )}
          >
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{activeLabel}</p>
        </div>
            {staffInbox ? <StaffNotificationBell inbox={staffInbox} /> : null}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-9 gap-2 border-transparent bg-transparent px-2 text-foreground shadow-none hover:border-border hover:bg-muted hover:text-foreground focus-visible:text-foreground"
              >
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={userName} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline max-w-[140px] truncate text-sm font-medium text-foreground">
                  {userName}
                </span>
                <ChevronDown className="hidden md:inline h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  {userEmail ? (
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={ROLE_HOME[role]} className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  {role === "user" ? "Portal home" : "Dashboard home"}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Marketing website
              </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={signOut}>
                <DropdownMenuItem asChild>
                  <button
                    type="submit"
                    className={cn(
                      "w-full cursor-pointer text-destructive focus:text-destructive"
                    )}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </header>
        <main
          className={cn(
            dashboardContentClass,
            "flex-1 min-w-0 py-4 md:py-6 overflow-x-hidden"
          )}
        >
          {children}
        </main>
      </SidebarInset>
    </>
  );
}

export function DashboardShell({
  role,
  userName,
  userEmail,
  avatarUrl,
  defaultSidebarOpen = true,
  staffInbox = null,
  navBadges = {},
  children,
}: {
  role: UserRole;
  userName: string;
  userEmail?: string | null;
  avatarUrl?: string | null;
  /** From server cookie — keeps SSR and client hydration in sync */
  defaultSidebarOpen?: boolean;
  staffInbox?: StaffInboxSummary | null;
  navBadges?: Record<string, number>;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <DashboardShellLayout
        role={role}
        userName={userName}
        userEmail={userEmail}
        avatarUrl={avatarUrl}
        staffInbox={staffInbox}
        navBadges={navBadges}
      >
        {children}
      </DashboardShellLayout>
    </SidebarProvider>
  );
}
