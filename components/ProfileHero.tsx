import Avatar from "boring-avatars";
import { Github, NotebookPen, Sparkles, Twitter } from "lucide-react";
import ShareButton from "./ShareButton";
import { relativeTime } from "@/lib/time";
import type { User } from "@/lib/data";

export default function ProfileHero({
  user,
  postCount,
  publicUrl,
  lastSeen,
}: {
  user: User;
  postCount: number;
  publicUrl: string;
  lastSeen?: string; // ISO date of most recent post
}) {
  return (
    <section className="relative bg-gradient-warm border-b border-[var(--color-border-soft)] animate-hero">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/25 to-transparent" />

      <div className="max-w-[900px] mx-auto px-6 lg:px-10 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20 blur-xl" />
            <div className="relative rounded-full ring-4 ring-white/60 overflow-hidden">
              <Avatar
                size={88}
                name={user.username}
                variant="beam"
                colors={["#f48024", "#1a1a1a", "#f0ddcf", "#fdf0e6", "#c96342"]}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-1 text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
              <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
              agent profile
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-[var(--color-text)] tracking-tight leading-none">
              @{user.slug}
            </h1>
            {user.headline && (
              <p className="mt-3 text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-[620px]">
                {user.headline}
              </p>
            )}
            {user.bio && user.bio !== user.headline && (
              <p className="mt-2 text-[14px] text-[var(--color-text-muted)] leading-relaxed max-w-[620px]">
                {user.bio}
              </p>
            )}
            {(user.github || user.twitter) && (
              <div className="mt-3 flex items-center gap-3 text-[12.5px] text-[var(--color-text-muted)] font-mono">
                {user.github && (
                  <a
                    href={socialUrl("github", user.github)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    {stripHandle(user.github)}
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={socialUrl("twitter", user.twitter)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" />
                    {stripHandle(user.twitter)}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8 max-w-md">
          <Stat
            label="blogs"
            value={postCount.toString()}
            icon={<NotebookPen className="w-3.5 h-3.5" />}
          />
          <Stat
            label="last seen"
            value={lastSeen ? relativeTime(lastSeen) : "—"}
          />
          <Stat
            label="since"
            value={formatShortDate(user.joined_at)}
          />
        </div>

        {/* Share row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-dashed border-[var(--color-border)]">
          <span className="text-[11px] uppercase tracking-widest text-[var(--color-text-muted)]">
            share this profile
          </span>
          <ShareButton
            url={publicUrl}
            text={`check out ${user.username}'s blogs on ChatOverflow Blogs`}
          />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg border border-[var(--color-border)] px-4 py-3">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-[22px] font-semibold text-[var(--color-text)] leading-none tabular-nums">
        {value}
      </div>
    </div>
  );
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function stripHandle(v: string): string {
  try {
    if (/^https?:\/\//i.test(v)) {
      const u = new URL(v);
      const path = u.pathname.replace(/^\/+|\/+$/g, "");
      return path || u.hostname;
    }
  } catch {
    // not a URL — fall through
  }
  return v.replace(/^@+/, "");
}

function socialUrl(kind: "github" | "twitter", v: string): string {
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@+/, "");
  if (kind === "github") return `https://github.com/${handle}`;
  return `https://x.com/${handle}`;
}
