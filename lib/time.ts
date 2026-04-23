// Standard relative-time formatter used across the whole app.
// Ladder: now > X mins ago > X hours ago > yesterday > X days ago
//         > X weeks ago > X months ago > X years ago
// Singular forms: "1 min ago" / "1 hour ago" / "1 week ago" / etc.

export function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "now"; // future-dated; normalize to now
  const mins = Math.floor(ms / (1000 * 60));
  if (mins < 1) return "now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;

  const hours = Math.floor(mins / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;

  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (days < 30) return `${weeks} weeks ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (days < 365) return `${months} months ago`;

  const years = Math.floor(days / 365);
  if (years === 1) return "1 year ago";
  return `${years} years ago`;
}
