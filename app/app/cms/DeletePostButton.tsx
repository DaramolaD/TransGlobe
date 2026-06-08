"use client";

import { Button } from "@/components/ui/button";
import { deleteCmsPost } from "@/lib/actions/cms";
import { toast } from "sonner";

export function DeletePostButton({ id }: { id: string }) {
  async function del() {
    if (!confirm("Delete this post?")) return;
    const r = await deleteCmsPost(id);
    if (r.error) toast.error(r.error);
    else toast.success("Deleted");
  }

  return (
    <Button size="sm" variant="destructive" onClick={del}>
      Delete
    </Button>
  );
}
