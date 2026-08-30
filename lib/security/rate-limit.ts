type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

const globalForRateLimit = globalThis as unknown as {
  iconicRateLimits?: Map<string, RateLimitBucket>;
};

function getStore() {
  if (!globalForRateLimit.iconicRateLimits) {
    globalForRateLimit.iconicRateLimits = new Map();
  }

  return globalForRateLimit.iconicRateLimits;
}

export function consumeRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const store = getStore();
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(key, existing);

  return { allowed: true, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}
