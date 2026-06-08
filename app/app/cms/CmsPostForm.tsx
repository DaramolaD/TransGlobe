"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { upsertCmsPost } from "@/lib/actions/cms";
import type { CmsPostStatus } from "@/lib/types/database";
import { toast } from "sonner";

type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: CmsPostStatus;
  featured: boolean;
  cover_image_url: string | null;
};

export function CmsPostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [status, setStatus] = useState<CmsPostStatus>(post?.status ?? "draft");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [coverUrl, setCoverUrl] = useState(post?.cover_image_url ?? "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await upsertCmsPost({
      id: post?.id,
      title,
      excerpt,
      content,
      status,
      featured,
      coverImageUrl: coverUrl || undefined,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Post saved");
      router.push("/app/cms");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Excerpt</Label>
        <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
      </div>
      <div className="space-y-2">
        <Label>Content (Markdown/HTML)</Label>
        <Textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={12} />
      </div>
      <div className="space-y-2">
        <Label>Cover image URL</Label>
        <Input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={featured} onCheckedChange={setFeatured} />
        <Label>Featured post</Label>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as CmsPostStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading}>
        Save post
      </Button>
    </form>
  );
}
