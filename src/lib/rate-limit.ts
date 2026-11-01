import "server-only";

// Simple in-memory limiter. Fine for a single PM2 process on one VPS;
// switch to Redis if you ever run several instances.
const hits = new Map<string, { count: number; reset: number }>();

export function tooManyAttempts(key: string, limit = 5) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) return false;
  return entry.count >= limit;
}

export function recordFailure(key: string, windowMs = 15 * 60_000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) hits.set(key, { count: 1, reset: now + windowMs });
  else entry.count++;
  if (hits.size > 10_000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
}

export function clearFailures(key: string) {
  hits.delete(key);
}
