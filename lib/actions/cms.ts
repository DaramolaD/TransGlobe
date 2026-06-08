"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { canManageCms } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { CmsPostStatus } from "@/lib/types/database";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function listCmsPosts(status?: CmsPostStatus) {
  const supabase = await createClient();
  let q = supabase
    .from("cms_posts")
    .select("*, cms_categories(name, slug)")
    .order("created_at", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return { error: error.message, data: [] };
  return { data: data ?? [] };
}

export async function getPublishedPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cms_posts")
    .select("*, cms_categories(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return { data: [] };
  return { data: data ?? [] };
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cms_posts")
    .select("*, cms_categories(name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function upsertCmsPost(data: {
  id?: string;
  title: string;
  excerpt?: string;
  content: string;
  categoryId?: string;
  status: CmsPostStatus;
  featured?: boolean;
  coverImageUrl?: string;
}) {
  const profile = await requireProfile();
  if (!canManageCms(profile.role)) return { error: "Forbidden" };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Not configured" };

  const supabase = await createClient();
  const slug = slugify(data.title);
  const payload = {
    organization_id: orgId,
    author_id: profile.id,
    title: data.title,
    slug,
    excerpt: data.excerpt ?? null,
    content: data.content,
    category_id: data.categoryId ?? null,
    status: data.status,
    featured: data.featured ?? false,
    cover_image_url: data.coverImageUrl ?? null,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  };

  if (data.id) {
    const { error } = await supabase.from("cms_posts").update(payload).eq("id", data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("cms_posts").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/blog");
  revalidatePath("/app/cms");
  return { success: true };
}

export async function deleteCmsPost(id: string) {
  const profile = await requireProfile();
  if (!canManageCms(profile.role)) return { error: "Forbidden" };

  const supabase = await createClient();
  const { error } = await supabase.from("cms_posts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/blog");
  return { success: true };
}

export async function listCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("cms_categories").select("*").order("name");
  return data ?? [];
}
