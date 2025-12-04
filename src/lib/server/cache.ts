// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class Cache<T> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private ttl: number; // Time to live in milliseconds

  constructor(ttlSeconds: number = 300) {
    this.ttl = ttlSeconds * 1000; // Convert to ms
  }

  set(key: string, value: T): void {
    this.store.set(key, {
      data: value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(key?: string): void {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }

  invalidatePattern(pattern: string): void {
    for (const key of this.store.keys()) {
      if (key.includes(pattern)) {
        this.store.delete(key);
      }
    }
  }
}

// Create separate cache instances for different data types
export const linksCache = new Cache(300); // 5 minutes TTL for links
export const profileCache = new Cache(600); // 10 minutes TTL for profiles

// Cache key generators
export const cacheKeys = {
  userLinks: (userId: string) => `links:user:${userId}`,
  userProfile: (userId: string) => `profile:user:${userId}`,
  publicLinks: (username: string) => `links:public:${username}`,
};
