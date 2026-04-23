import Link from "next/link";
import Avatar from "boring-avatars";
import { ArrowUpRight } from "lucide-react";
import ImportanceBadge from "./ImportanceBadge";
import ImportanceStar from "./ImportanceStar";
import { relativeTime } from "@/lib/time";
import type { Post } from "@/lib/data";

export default function PostCard({
  post,
  index = 0,
  number,
  variant = "badge",
  size = "default",
  showAuthor = false,
}: {
  post: Post;
  index?: number;
  number?: number;
  variant?: "badge" | "star";
  size?: "default" | "compact";
  showAuthor?: boolean;
}) {
  const padding = size === "compact" ? "p-5" : "p-6 lg:p-7";
  const titleSize =
    size === "compact"
      ? "text-[17px] lg:text-[17.5px]"
      : "text-[19px] lg:text-[20px]";
  const thingSize = size === "compact" ? "text-[13.5px]" : "text-[14.5px]";
  const mb = size === "compact" ? "mb-3" : "mb-4";
  const author =
    showAuthor && post.author_username
      ? { username: post.author_username, slug: post.author_slug }
      : null;
  return (
    <Link
      href={`/u/${post.author_slug}/${post.slug}`}
      className={`group block rounded-xl bg-white border border-[var(--color-border)] ${padding} highlight-ring-hover animate-fade-in-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`flex items-center justify-between ${mb}`}>
        <div className="flex items-center gap-3">
          {typeof number === "number" && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-primary)]">
              №{String(number).padStart(3, "0")}
            </span>
          )}
          {variant === "star" ? (
            <ImportanceStar value={post.importance} />
          ) : (
            <ImportanceBadge value={post.importance} />
          )}
          {author ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="rounded-full overflow-hidden ring-1 ring-[var(--color-border-soft)] shrink-0">
                <Avatar
                  size={18}
                  name={author.username}
                  variant="beam"
                  colors={[
                    "#f48024",
                    "#1a1a1a",
                    "#f0ddcf",
                    "#fdf0e6",
                    "#c96342",
                  ]}
                />
              </span>
              <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
                <span className="opacity-70">@</span>
                <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
                  {author.slug}
                </span>
              </span>
            </span>
          ) : (
            <time className="text-[12px] text-[var(--color-text-muted)] font-mono">
              {relativeTime(post.posted_at)}
            </time>
          )}
        </div>
        <div className="flex items-center gap-3">
          {author && (
            <time className="text-[11.5px] text-[var(--color-text-muted)] font-mono whitespace-nowrap">
              {relativeTime(post.posted_at)}
            </time>
          )}
          <ArrowUpRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>

      <h2
        className={`${titleSize} font-semibold text-[var(--color-text)] tracking-tight leading-snug mb-3 group-hover:text-[var(--color-primary)] transition-colors`}
      >
        {post.title}
      </h2>

      <p
        className={`${thingSize} text-[var(--color-text-secondary)] leading-relaxed line-clamp-3`}
      >
        {stripMd(post.thing)}
      </p>

      <div className={`mt-${size === "compact" ? "3" : "4"} text-[12px] text-[var(--color-text-muted)] tracking-wide`}>
        <span className="uppercase opacity-70 mr-2">context</span>
        <span className="italic">{stripMd(post.topic)}</span>
      </div>
    </Link>
  );
}

function stripMd(s: string) {
  return s.replace(/[`*_~]/g, "");
}
