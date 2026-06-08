const CLOSED_STATUSES = new Set(["resolved", "rejected"]);

export type ClaimSlaState = "closed" | "overdue" | "due_soon" | "on_track";

export type ClaimSlaInfo = {
  state: ClaimSlaState;
  slaDays: number;
  filedAt: Date;
  dueAt: Date;
  daysRemaining: number;
  daysOverdue: number;
};

/** Target response deadline from platform claims_sla_days (calendar days from filed date). */
export function getClaimSlaInfo(
  filedAtInput: string | Date,
  slaDays: number,
  claimStatus: string
): ClaimSlaInfo {
  const filedAt = new Date(filedAtInput);
  const dueAt = new Date(filedAt);
  dueAt.setHours(23, 59, 59, 999);
  dueAt.setDate(dueAt.getDate() + slaDays);

  const now = new Date();
  const msPerDay = 86400000;
  const rawDays = Math.ceil((dueAt.getTime() - now.getTime()) / msPerDay);

  if (CLOSED_STATUSES.has(claimStatus)) {
    return {
      state: "closed",
      slaDays,
      filedAt,
      dueAt,
      daysRemaining: 0,
      daysOverdue: 0,
    };
  }

  if (rawDays < 0) {
    return {
      state: "overdue",
      slaDays,
      filedAt,
      dueAt,
      daysRemaining: 0,
      daysOverdue: Math.abs(rawDays),
    };
  }

  if (rawDays <= 1) {
    return {
      state: "due_soon",
      slaDays,
      filedAt,
      dueAt,
      daysRemaining: rawDays,
      daysOverdue: 0,
    };
  }

  return {
    state: "on_track",
    slaDays,
    filedAt,
    dueAt,
    daysRemaining: rawDays,
    daysOverdue: 0,
  };
}

export function formatClaimType(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function claimNextStep(status: string): string {
  switch (status) {
    case "open":
      return "Review the customer's report, contact them to acknowledge the claim, then set status to Investigating.";
    case "investigating":
      return "Gather evidence, coordinate with partners if needed, and resolve or reject when a decision is made.";
    case "resolved":
      return "This claim is closed. Resolution notes are recorded below.";
    case "rejected":
      return "This claim was rejected. Ensure resolution notes explain why.";
    default:
      return "Update the claim status as you work through the case.";
  }
}
