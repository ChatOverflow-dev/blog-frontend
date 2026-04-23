"use client";

import Link from "next/link";
import Avatar from "boring-avatars";
import { useEffect, useRef } from "react";
import type { User } from "@/lib/data";

type Stats = { contributions: number; joinedAgo: string };

export default function Carousel({
  users,
  stats,
  direction,
  speed = 0.035, // px per ms — ~35 px/s, gentle
}: {
  users: User[];
  stats: Record<string, Stats>;
  direction: "left" | "right";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const startRef = useRef({ x: 0, offset: 0, moved: false });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // One "copy" of the duplicated strip spans half the total scroll width
    const measure = () => {
      halfWidthRef.current = el.scrollWidth / 2;
    };
    measure();
    // Re-measure if fonts load / layout settles
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let raf = 0;
    let lastTime = performance.now();
    const dir = direction === "left" ? 1 : -1;

    const loop = (t: number) => {
      const dt = Math.min(t - lastTime, 64); // clamp if tab was backgrounded
      lastTime = t;
      if (!draggingRef.current && halfWidthRef.current > 0) {
        offsetRef.current += dir * speed * dt;
        if (offsetRef.current >= halfWidthRef.current) {
          offsetRef.current -= halfWidthRef.current;
        } else if (offsetRef.current < 0) {
          offsetRef.current += halfWidthRef.current;
        }
        // Transform-based = compositor-accelerated, sub-pixel smooth
        el.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [direction, speed]);

  // NOTE: we do NOT call setPointerCapture on the container. Doing so silently
  // blocks the synthesized click from reaching the child <Link> in some flows,
  // so pure clicks stop navigating. Instead, we attach pointermove/pointerup
  // on the window while the drag is active — regular click dispatch is left
  // untouched, and we only suppress the click if the user actually dragged
  // past the threshold.
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // primary button / touch only
    draggingRef.current = true;
    startRef.current = {
      x: e.clientX,
      offset: offsetRef.current,
      moved: false,
    };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startRef.current.x;
      if (Math.abs(dx) > 4) startRef.current.moved = true;
      if (!startRef.current.moved) return; // pre-threshold = potential click
      let next = startRef.current.offset - dx;
      const half = halfWidthRef.current;
      if (half > 0) {
        next = ((next % half) + half) % half;
      }
      offsetRef.current = next;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-next}px, 0, 0)`;
      }
    };
    const onEnd = () => {
      draggingRef.current = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      startRef.current.moved = false;
    }
  };

  const strip = [...users, ...users];

  return (
    <div
      className="overflow-hidden select-none cursor-grab active:cursor-grabbing carousel-mask"
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
    >
      <div
        ref={trackRef}
        className="flex gap-4 py-1"
        style={{
          width: "max-content",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        {strip.map((u, i) => {
          const s = stats[u.slug];
          return (
            <Link
              key={`${direction}-${i}`}
              href={`/u/${u.slug}`}
              draggable={false}
              className="group w-[300px] shrink-0 rounded-xl bg-white border border-[var(--color-border)] p-5 highlight-ring-hover flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full overflow-hidden ring-2 ring-[var(--color-border-soft)] shrink-0">
                  <Avatar
                    size={36}
                    name={u.username}
                    variant="beam"
                    colors={[
                      "#f48024",
                      "#1a1a1a",
                      "#f0ddcf",
                      "#fdf0e6",
                      "#c96342",
                    ]}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[14px] text-[var(--color-text)] leading-none mb-1 truncate">
                    <span className="text-[var(--color-text-muted)]">@</span>
                    <span className="font-semibold group-hover:text-[var(--color-primary)] transition-colors">
                      {u.slug}
                    </span>
                  </div>
                  {(u.headline || u.bio) && (
                    <p className="text-[12.5px] text-[var(--color-text-muted)] line-clamp-2 leading-snug">
                      {u.headline || u.bio}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-auto pt-3 border-t border-dashed border-[var(--color-border)] flex items-center justify-between font-mono text-[11px] text-[var(--color-text-muted)]">
                <span>Joined {s.joinedAgo}</span>
                <span>
                  <span className="text-[var(--color-text-secondary)] font-semibold tabular-nums">
                    {s.contributions}
                  </span>{" "}
                  {s.contributions === 1 ? "blog" : "blogs"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
