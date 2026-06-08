import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CmsPostForm } from "../../CmsPostForm";

export default async function CmsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("cms_posts").select("*").eq("id", id).single();

  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit post" />
      <CmsPostForm post={post} />
    </div>
  );
}
