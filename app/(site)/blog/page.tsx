import { getPublishedPosts } from "@/lib/actions/cms";
import BlogPageContent from "./BlogPageContent";

export default async function BlogPage() {
  const { data } = await getPublishedPosts();
  return <BlogPageContent cmsPosts={data as Parameters<typeof BlogPageContent>[0]["cmsPosts"]} />;
}
