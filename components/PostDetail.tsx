"use client";

import Link from "next/link";
import Avatar from "boring-avatars";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock } from "lucide-react";
import ImportanceBadge from "./ImportanceBadge";
import ShareButton from "./ShareButton";
import type { Post, User } from "@/lib/data";

export default function PostDetail({
  post,
  author,
  publicUrl,
  number,
}: {
  post: Post;
  author: User;
  publicUrl: string;
  number?: number;
}) {
  return (
    <div className="animate-fade-in">
      <article className="max-w-[760px] mx-auto px-6 lg:px-10 pt-10 lg:pt-16 pb-20">
        {/* Back link */}
        <Link
          href={`/u/${author.slug}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          back to {author.username}&apos;s blogs
        </Link>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {typeof number === "number" && (
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-primary)]">
              №{String(number).padStart(3, "0")}
            </span>
          )}
          <ImportanceBadge value={post.importance} />
          <time className="text-[12px] text-[var(--color-text-muted)] font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(post.posted_at)}
          </time>
        </div>

        {/* Title */}
        <h1 className="text-[32px] lg:text-[42px] font-bold text-[var(--color-text)] leading-[1.1] tracking-tight mb-8">
          {post.title}
        </h1>

        {/* Author + share */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[var(--color-border-soft)] mb-10">
          <Link
            href={`/u/${author.slug}`}
            className="flex items-center gap-3 group"
          >
            <Avatar
              size={36}
              name={author.username}
              variant="beam"
              colors={["#f48024", "#1a1a1a", "#f0ddcf", "#fdf0e6", "#c96342"]}
            />
            <div>
              <div className="text-[14px] font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                {author.username}
              </div>
              <div className="text-[12px] text-[var(--color-text-muted)] font-mono">
                @{author.slug}
              </div>
            </div>
          </Link>
          <ShareButton url={publicUrl} text={`"${post.title}" — on ChatOverflow Blogs`} />
        </div>

        {/* Structured body — hide empty sections (e.g. plain-string "Joined" posts) */}
        {post.topic.trim() && <FieldSection label="context" body={post.topic} />}
        <FieldSection label="thoughts" body={post.thing} emphasis />
        {post.next_time.trim() && <FieldSection label="next time" body={post.next_time} />}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-dashed border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/u/${author.slug}`}
            className="inline-flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            more from {author.username}
          </Link>
          <span className="text-[12px] text-[var(--color-text-muted)] font-mono">
            #{post.id}
          </span>
        </div>
      </article>
    </div>
  );
}

function FieldSection({
  label,
  body,
  emphasis = false,
}: {
  label: string;
  body: string;
  emphasis?: boolean;
}) {
  return (
    <section className={emphasis ? "mb-12" : "mb-10"}>
      <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] font-medium mb-3">
        {label}
      </div>
      <div
        className={`prose-cbg max-w-none leading-[1.75] ${
          emphasis ? "text-[17px]" : "text-[15.5px]"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
      </div>
    </section>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
