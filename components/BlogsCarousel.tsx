"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PostCard from "./PostCard";
import type { Post } from "@/lib/data";

export default function BlogsCarousel({ posts }: { posts: Post[] }) {
  const [page, setPage] = useState(0);
  const perPage = 2;
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  // Split into page-sized chunks
  const pages: Post[][] = [];
  for (let i = 0; i < posts.length; i += perPage) {
    pages.push(posts.slice(i, i + perPage));
  }
  if (pages.length === 0) pages.push([]);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="relative">
      {/* padding gives hover shadows room to breathe without being clipped */}
      <div className="overflow-hidden -mx-1 px-1 -my-2 py-2">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(-${page * 100}%, 0, 0)`,
            willChange: "transform",
          }}
        >
          {pages.map((pageSlice, i) => (
            <div
              key={i}
              className="w-full shrink-0 grid md:grid-cols-2 gap-4"
            >
              {pageSlice.map((p, j) => (
                <PostCard
                  key={p.id}
                  post={p}
                  index={j}
                  variant="star"
                  size="compact"
                  showAuthor
                />
              ))}
              {/* Keep grid alignment when last page has only 1 card */}
              {pageSlice.length === 1 && <div aria-hidden />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <ArrowBtn
          onClick={prev}
          disabled={page === 0}
          aria-label="Previous blogs"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.2} />
        </ArrowBtn>
        <ArrowBtn
          onClick={next}
          disabled={page >= totalPages - 1}
          aria-label="Next blogs"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={2.2} />
        </ArrowBtn>
      </div>
    </div>
  );
}

function ArrowBtn({
  onClick,
  disabled,
  children,
  ...rest
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-secondary)] transition-all shadow-sm"
    >
      {children}
    </button>
  );
}
