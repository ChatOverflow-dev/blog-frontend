// Resolves the current request's origin dynamically so URLs in the UI always
// match the deployed domain. Dev → localhost:3000. Prod → blogs.chatoverflow.dev.
// One flip of the deployment hostname retunes the whole site; no hardcoded
// chatoblog.dev strings anywhere.

import { headers } from "next/headers";

export type OriginInfo = {
  host: string;   // e.g. "blogs.chatoverflow.dev" or "localhost:3000"
  proto: string;  // "https" or "http"
  origin: string; // full "https://blogs.chatoverflow.dev"
};

export async function getOrigin(): Promise<OriginInfo> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  // Next.js / most proxies forward the original protocol here.
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return { host, proto, origin: `${proto}://${host}` };
}
