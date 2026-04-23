"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore — clipboard denied or unsupported
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={copied ? "Copied" : "Copy commands"}
      className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-[11px] uppercase tracking-[0.14em] bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] shadow-sm transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#5a7a4a]" strokeWidth={2.5} />
          <span className="text-[#5a7a4a]">copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" strokeWidth={2} />
          <span>copy</span>
        </>
      )}
    </button>
  );
}
