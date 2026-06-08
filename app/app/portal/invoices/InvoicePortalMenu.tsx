"use client";

import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function InvoicePortalMenu({
  id,
  invoiceNumber,
}: {
  id: string;
  invoiceNumber: string;
}) {
  return (
    <div className="flex justify-end" data-no-row-click>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground data-[state=open]:bg-muted"
            aria-label={`Actions for ${invoiceNumber}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link
              href={`/app/portal/invoices/${id}`}
              className="flex items-center cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View &amp; pay
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
