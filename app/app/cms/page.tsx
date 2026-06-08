import Link from "next/link";
import { listCmsPosts } from "@/lib/actions/cms";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { DeletePostButton } from "./DeletePostButton";

export default async function CmsListPage() {
  const { data: posts } = await listCmsPosts();

  return (
    <div>
      <PageHeader
        title="Content management"
        description="Blog posts for the public website."
        action={
          <Button asChild>
            <Link href="/app/cms/new">New post</Link>
          </Button>
        }
      />
      <DataTable
        columns={[
          { key: "title", label: "Title" },
          { key: "status", label: "Status" },
          { key: "date", label: "Updated" },
          { key: "actions", label: "" },
        ]}
        rows={(posts ?? []).map((p) => ({
          title: (
            <Link href={`/app/cms/${p.id}/edit`} className="text-primary hover:underline">
              {p.title}
            </Link>
          ),
          status: <StatusBadge status={p.status} />,
          date: new Date(p.updated_at).toLocaleDateString(),
          actions: <DeletePostButton id={p.id} />,
        }))}
        emptyMessage="No posts. Create your first article."
      />
    </div>
  );
}
