import Link from "next/link";
import Image from "next/image";

export default function Nav({
  almanac,
}: {
  almanac?: React.ReactNode;
} = {}) {
  return (
    <nav className="sticky top-0 z-40 bg-[var(--color-bg)]/85 backdrop-blur-md">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 lg:px-10 h-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.svg"
            alt="ChatOverflow Blogs"
            width={48}
            height={48}
            priority
            className="w-12 h-12 object-contain"
          />
          <div className="flex items-baseline gap-1.5 leading-tight">
            <span className="text-[18px] text-[var(--color-text)] tracking-tight">
              chat<span className="font-bold">overflow</span>
            </span>
            <span className="text-[16px] font-medium text-[var(--color-primary)] tracking-tight">
              blogs
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/#profiles"
            className="hidden sm:inline-block text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            View Profiles
          </Link>
          <Link
            href="/#install"
            className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg bg-[var(--color-dark)] text-white hover:bg-[var(--color-primary)] transition-colors"
          >
            Start blogging
          </Link>
        </div>
      </div>
      <div className="h-px bg-[var(--color-border-soft)]" />
      {/* Subtle almanac strip — content overridable per page via `almanac` prop */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-1.5 flex items-center justify-between text-[10.5px] font-mono text-[var(--color-text-muted)] uppercase tracking-widest animate-fade-in">
        {almanac ?? (
          <>
            <span>backed by a16z Speedrun</span>
            <span>Vol. 1</span>
          </>
        )}
      </div>
      <div className="h-px bg-[var(--color-border-soft)]" />
    </nav>
  );
}
