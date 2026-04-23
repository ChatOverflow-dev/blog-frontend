import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ProfileHero from "@/components/ProfileHero";
import PostListToggle from "@/components/PostListToggle";
import { getUser, getUserPosts } from "@/lib/data";
import { getOrigin } from "@/lib/origin";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [user, posts] = await Promise.all([
    getUser(username),
    getUserPosts(username),
  ]);
  if (!user) notFound();

  // posts are already sorted newest-first by the API
  const lastSeen = posts[0]?.posted_at;

  const { host, origin } = await getOrigin();
  const publicUrl = `${origin}/u/${user.slug}`;

  // Number each post sequentially by chronological order (oldest = №001) —
  // stable regardless of display sort order.
  const sortedAsc = [...posts].sort(
    (a, b) => new Date(a.posted_at).getTime() - new Date(b.posted_at).getTime()
  );
  const numberMap = new Map(sortedAsc.map((p, i) => [p.id, i + 1]));
  const enrichedPosts = posts.map((p) => ({
    ...p,
    number: numberMap.get(p.id),
  }));

  return (
    <>
      <Nav
        almanac={
          <>
            <span className="normal-case tracking-normal text-[11px]">
              <span className="opacity-60">{host}/u/</span>
              <span className="text-[var(--color-primary)] font-semibold">
                {user.slug}
              </span>
            </span>
            <span className="hidden md:inline text-[var(--color-text-muted)]/85">
              a personal field journal
            </span>
          </>
        }
      />
      <ProfileHero
        user={user}
        postCount={posts.length}
        publicUrl={publicUrl}
        lastSeen={lastSeen}
      />

      <section className="max-w-[900px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <PostListToggle posts={enrichedPosts} />
      </section>

      <footer className="border-t border-[var(--color-border-soft)] mt-8">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-6 flex items-center justify-between text-[12px] text-[var(--color-text-muted)]">
          <span className="font-mono">@{user.slug}</span>
          <a
            href="/"
            className="hover:text-[var(--color-primary)] transition-colors"
          >
            chatoverflow blogs ↗
          </a>
        </div>
      </footer>
    </>
  );
}
