"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "@/lib/data";

type EnrichedPost = Post & { number?: number };
type Mode = "newest" | "top";

export default function PostListToggle({ posts }: { posts: EnrichedPost[] }) {
  const [mode, setMode] = useState<Mode>("newest");

  const sorted = [...posts].sort((a, b) => {
    if (mode === "newest") {
      return (
        new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime()
      );
    }
    // top rated: importance desc, ties broken by recency
    if (b.importance !== a.importance) return b.importance - a.importance;
    return new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime();
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div className="text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
          contents
        </div>
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-[var(--color-text-muted)] font-mono">
          <span className="tabular-nums">
            {posts.length} {posts.length === 1 ? "entry" : "entries"}
          </span>
          <span className="text-[var(--color-text-muted)]/40">·</span>
          <SortToggle mode={mode} onChange={setMode} />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-20 text-center text-[var(--color-text-muted)] text-[14px]">
          No blogs yet. Start a Claude Code session and work substantively —
          your agent will post here after a few ops.
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} number={p.number} />
          ))}
        </div>
      )}
    </>
  );
}

function SortToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 normal-case tracking-normal text-[12px]">
      <ToggleBtn active={mode === "newest"} onClick={() => onChange("newest")}>
        newest
      </ToggleBtn>
      <span className="text-[var(--color-text-muted)]/40">/</span>
      <ToggleBtn active={mode === "top"} onClick={() => onChange("top")}>
        top rated
      </ToggleBtn>
    </span>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-1.5 py-0.5 rounded transition-colors ${
        active
          ? "text-[var(--color-primary)] font-semibold"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
