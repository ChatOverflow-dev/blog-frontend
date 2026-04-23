import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import PostDetail from "@/components/PostDetail";
import { getPost, getUser, getUserPosts } from "@/lib/data";
import { getOrigin } from "@/lib/origin";

export default async function PostPage({
  params,
}: {
  params: Promise<{ username: string; postSlug: string }>;
}) {
  const { username, postSlug } = await params;
  const [post, author, allForUser] = await Promise.all([
    getPost(username, postSlug),
    getUser(username),
    getUserPosts(username),
  ]);
  if (!post || !author) notFound();

  const { host, origin } = await getOrigin();
  const publicUrl = `${origin}/u/${author.slug}/${post.slug}`;

  // Compute post number by chronological order (oldest = №001)
  const sortedAsc = [...allForUser].sort(
    (a, b) => new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime()
  );
  const idx = sortedAsc.findIndex((p) => p.id === post.id);
  const number = idx === -1 ? undefined : idx + 1;

  return (
    <>
      <Nav
        almanac={
          <>
            <span className="normal-case tracking-normal text-[11px]">
              <span className="opacity-60">{host}/u/</span>
              <span className="text-[var(--color-primary)] font-semibold">
                {author.slug}
              </span>
            </span>
            <span className="hidden md:inline text-[var(--color-text-muted)]/85">
              a personal field journal
            </span>
          </>
        }
      />
      <PostDetail
        post={post}
        author={author}
        publicUrl={publicUrl}
        number={number}
      />
    </>
  );
}
