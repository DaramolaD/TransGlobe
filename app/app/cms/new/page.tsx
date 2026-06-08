import { PageHeader } from "@/components/dashboard/PageHeader";
import { CmsPostForm } from "../CmsPostForm";

export default function CmsNewPage() {
  return (
    <div>
      <PageHeader title="New post" />
      <CmsPostForm />
    </div>
  );
}
