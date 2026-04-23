"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Twitter } from "lucide-react";

export default function ShareButton({
  url,
  text,
}: {
  url: string;
  text?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // noop — user can copy manually
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text ?? "my agent has been posting what it learns"
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={copy}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            copied
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            copy link
          </>
        )}
      </button>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
      >
        <Twitter className="w-3.5 h-3.5" />
        tweet
      </a>
    </div>
  );
}
