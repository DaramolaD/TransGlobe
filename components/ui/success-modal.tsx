"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Copy, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type SuccessDetail = {
  label: string;
  value: string;
};

export type SuccessAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
};

type SuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  highlightLabel?: string;
  highlightValue?: string;
  details?: SuccessDetail[];
  primaryAction?: SuccessAction;
  secondaryAction?: SuccessAction;
  tertiaryAction?: SuccessAction;
};

function SuccessIllustration() {
  return (
    <div className="relative mx-auto flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
        className="absolute inset-0 rounded-full bg-emerald-100/80 dark:bg-emerald-950/40"
      />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.12 }}
        className="absolute inset-3 rounded-full bg-emerald-500/10"
      />
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.18 }}
        className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
      >
        <Check className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={2.5} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="absolute -right-1 top-2 flex h-10 w-10 items-center justify-center rounded-xl border bg-background shadow-sm"
      >
        <Package className="h-5 w-5 text-primary" />
      </motion.div>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25 + i * 0.08 }}
          className={cn(
            "absolute h-2 w-2 rounded-full bg-emerald-400",
            i === 0 && "-left-1 top-8",
            i === 1 && "bottom-3 left-4",
            i === 2 && "bottom-6 -right-2 bg-primary/70"
          )}
        />
      ))}
    </div>
  );
}

function ActionButton({ action }: { action: SuccessAction }) {
  const variant = action.variant ?? "default";

  if (action.href) {
    return (
      <Button asChild variant={variant} className="w-full sm:w-auto">
        <Link href={action.href} onClick={action.onClick}>
          {action.label}
        </Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} className="w-full sm:w-auto" onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  description,
  highlightLabel,
  highlightValue,
  details,
  primaryAction,
  secondaryAction,
  tertiaryAction,
}: SuccessModalProps) {
  async function copyHighlight() {
    if (!highlightValue) return;
    try {
      await navigator.clipboard.writeText(highlightValue);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(90dvh,640px)] w-[calc(100%-1rem)] flex-col overflow-hidden border-0 p-0 sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="shrink-0 bg-gradient-to-b from-emerald-50/80 to-background px-4 pt-6 pb-2 sm:px-6 sm:pt-8 dark:from-emerald-950/20">
          <SuccessIllustration />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
            {description ? (
              <DialogDescription className="text-sm sm:text-base leading-relaxed">
                {description}
              </DialogDescription>
            ) : null}
          </DialogHeader>

          {highlightValue ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-4 sm:mt-5 rounded-xl border bg-muted/40 p-3 sm:p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {highlightLabel ?? "Reference"}
              </p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <p className="font-mono text-base sm:text-lg font-semibold tracking-wide break-all">
                  {highlightValue}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full shrink-0 sm:w-auto"
                  onClick={copyHighlight}
                >
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copy
                </Button>
              </div>
            </motion.div>
          ) : null}

          {details && details.length > 0 ? (
            <ul className="mt-4 space-y-2 rounded-xl border p-3 sm:p-4 text-sm">
              {details.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium sm:text-right break-words">{item.value}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <DialogFooter className="mt-5 sm:mt-6 flex-col gap-2 sm:flex-col">
            {primaryAction ? <ActionButton action={primaryAction} /> : null}
            {secondaryAction ? <ActionButton action={{ ...secondaryAction, variant: secondaryAction.variant ?? "outline" }} /> : null}
            {tertiaryAction ? (
              <ActionButton action={{ ...tertiaryAction, variant: tertiaryAction.variant ?? "ghost" }} />
            ) : null}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
