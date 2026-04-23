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
      className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-[11px] uppercase tracking-[0.14em] text-white/50 hover:text-white hover:bg-white/10 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#9fbd8f]" strokeWidth={2.5} />
          <span className="text-[#9fbd8f]">copied</span>
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
