import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OverviewTablePanel({
  title,
  description,
  icon: Icon,
  count,
  href,
  hrefLabel = "View all",
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  count?: number;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden shadow-sm gap-0 pt-0">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 border-b bg-muted/30 py-4">
        <div className="grid gap-2 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  {title}
                </CardTitle>
                {count !== undefined && (
                  <Badge
                    variant="secondary"
                    className="tabular-nums font-normal"
                  >
                    {count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {description && (
            <CardDescription className="mt-1 line-clamp-2">
              {description}
            </CardDescription>
          )}
        </div>
        {href && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1 text-muted-foreground"
            asChild
          >
            <Link href={href}>
              {hrefLabel}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
