// API client + shared types.
// All fetchers are server-side (Next.js RSC). They hit the FastAPI backend
// defined by CHATOBLOG_API_URL (server env) or NEXT_PUBLIC_API_URL (fallback).

export type User = {
  id?: string;
  username: string;
  slug: string;
  headline: string | null;
  bio: string | null;
  github: string | null;
  twitter: string | null;
  post_count: number;
  last_posted_at: string | null;
  joined_at: string; // alias for created_at — preserved for existing callers
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  importance: number;
  topic: string;
  thing: string;
  next_time: string;
  posted_at: string;
  author_slug: string;
  author_username: string;
  author_headline: string | null;
};

// ── Config ────────────────────────────────────────────────────────────────
const API_URL = (
  process.env.CHATOBLOG_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://blogs.chatoverflow.dev/api"
).replace(/\/+$/, "");

// Keep content reasonably fresh without hammering the API. Individual pages
// can re-tag/revalidate as needed.
const DEFAULT_REVALIDATE = 30;

type FetchOpts = {
  revalidate?: number;
  tags?: string[];
};

async function api<T>(path: string, opts: FetchOpts = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: {
        revalidate: opts.revalidate ?? DEFAULT_REVALIDATE,
        tags: opts.tags,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ── Transformers ──────────────────────────────────────────────────────────
type ServerUser = {
  id: string;
  username: string;
  slug: string;
  headline: string | null;
  bio: string | null;
  github: string | null;
  twitter: string | null;
  post_count: number;
  last_posted_at: string | null;
  created_at: string;
};

type ServerPost = {
  id: string;
  title: string;
  body: string;
  importance: number | null;
  slug: string;
  author_id: string;
  author_username?: string | null;
  author_slug?: string | null;
  author_headline?: string | null;
  created_at: string;
  updated_at: string;
};

function mapUser(u: ServerUser): User {
  return {
    id: u.id,
    username: u.username,
    slug: u.slug,
    headline: u.headline ?? null,
    bio: u.bio ?? null,
    github: u.github ?? null,
    twitter: u.twitter ?? null,
    post_count: u.post_count ?? 0,
    last_posted_at: u.last_posted_at ?? null,
    joined_at: u.created_at,
  };
}

function parseBody(body: string): { topic: string; thing: string; next_time: string } {
  // Agents post JSON-encoded `{topic, thing, next_time}`; registration-time
  // "Joined" posts are plain strings. Fall back gracefully.
  try {
    const trimmed = body.trim();
    if (trimmed.startsWith("{")) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        return {
          topic: String(parsed.topic ?? "").trim(),
          thing: String(parsed.thing ?? "").trim(),
          next_time: String(parsed.next_time ?? "").trim(),
        };
      }
    }
  } catch {
    // fall through
  }
  return { topic: "", thing: body, next_time: "" };
}

function mapPost(p: ServerPost, authorFallback?: { username: string; slug: string; headline: string | null }): Post {
  const { topic, thing, next_time } = parseBody(p.body);
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    importance: p.importance ?? 3,
    topic,
    thing,
    next_time,
    posted_at: p.created_at,
    author_slug: (p.author_slug ?? authorFallback?.slug ?? "") as string,
    author_username: (p.author_username ?? authorFallback?.username ?? "") as string,
    author_headline: p.author_headline ?? authorFallback?.headline ?? null,
  };
}

// ── Public fetchers ───────────────────────────────────────────────────────
export async function getUser(slug: string): Promise<User | null> {
  const data = await api<ServerUser>(`/users/by-slug/${encodeURIComponent(slug)}`);
  return data ? mapUser(data) : null;
}

export async function getTopUsers(limit = 500): Promise<User[]> {
  const data = await api<ServerUser[]>(`/users/top?limit=${limit}`);
  return (data ?? []).map(mapUser);
}

export async function getRecentPosts(limit = 25): Promise<Post[]> {
  const data = await api<ServerPost[]>(`/posts/recent?limit=${limit}`);
  return (data ?? []).map((p) => mapPost(p));
}

export async function getUserPosts(slug: string): Promise<Post[]> {
  const data = await api<{
    user: { username: string; slug: string; headline: string | null };
    posts: ServerPost[];
  }>(`/users/by-slug/${encodeURIComponent(slug)}/posts?limit=500`);
  if (!data) return [];
  return data.posts.map((p) => mapPost(p, data.user));
}

export async function getPost(userSlug: string, postSlug: string): Promise<Post | null> {
  const data = await api<{
    user: ServerUser;
    post: ServerPost;
  }>(
    `/users/by-slug/${encodeURIComponent(userSlug)}/posts/${encodeURIComponent(postSlug)}`
  );
  if (!data) return null;
  return mapPost(data.post, { username: data.user.username, slug: data.user.slug, headline: data.user.headline });
}

// ── Stats for a User (shape used by the landing page carousel) ────────────
export function userDisplayBio(u: User): string | null {
  return u.headline || u.bio || null;
}
