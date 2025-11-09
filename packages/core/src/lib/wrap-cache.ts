/**
 * wrap-cache.ts - LRU cache for wrapped content
 *
 * Caches the result of text wrapping operations to avoid recomputation
 * when the same text is wrapped multiple times with the same parameters.
 */

import type { WrappedContent } from "../types/common.js";

export interface WrapCacheOptions {
  /** Maximum number of entries in the cache */
  maxSize?: number;
}

export interface WrapCacheKey {
  content: string;
  width: number;
  wrapMode:
    | "wrap"
    | "truncate-end"
    | "truncate-middle"
    | "truncate-start"
    | boolean;
  fullUnicode: boolean;
  align: string | null;
  parseTags: boolean;
}

/**
 * LRU Cache for wrapped content
 *
 * Uses a Map to store entries and tracks access order.
 * When max size is reached, removes least recently used entry.
 */
export class WrapCache {
  private cache: Map<string, WrappedContent>;
  private maxSize: number;

  constructor(options: WrapCacheOptions = {}) {
    this.maxSize = options.maxSize ?? 1000;
    this.cache = new Map();
  }

  /**
   * Generate cache key from parameters
   */
  private generateKey(key: WrapCacheKey): string {
    // Create a deterministic string key from parameters
    // Use JSON.stringify for simplicity, but could be optimized
    return JSON.stringify({
      c: key.content,
      w: key.width,
      m: key.wrapMode,
      u: key.fullUnicode,
      a: key.align,
      t: key.parseTags,
    });
  }

  /**
   * Get wrapped content from cache
   * Returns undefined if not found
   * Moves accessed entry to end (most recently used)
   */
  get(key: WrapCacheKey): WrappedContent | undefined {
    const cacheKey = this.generateKey(key);
    const value = this.cache.get(cacheKey);

    if (value !== undefined) {
      // Move to end (most recently used) by deleting and re-adding
      this.cache.delete(cacheKey);
      this.cache.set(cacheKey, value);
    }

    return value;
  }

  /**
   * Store wrapped content in cache
   * Evicts least recently used entry if cache is full
   */
  set(key: WrapCacheKey, value: WrappedContent): void {
    const cacheKey = this.generateKey(key);

    // Check if we need to evict before modifying cache
    const exists = this.cache.has(cacheKey);

    // If key doesn't exist and cache is full, evict oldest
    if (!exists && this.cache.size >= this.maxSize) {
      // Map iterates in insertion order, so first entry is oldest
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    // If already exists, delete it first (will re-add at end for LRU)
    if (exists) {
      this.cache.delete(cacheKey);
    }

    // Add new entry (most recently used)
    this.cache.set(cacheKey, value);
  }

  /**
   * Check if cache has an entry
   */
  has(key: WrapCacheKey): boolean {
    const cacheKey = this.generateKey(key);
    return this.cache.has(cacheKey);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * Get maximum cache size
   */
  get capacity(): number {
    return this.maxSize;
  }

  /**
   * Set maximum cache size
   * If new size is smaller than current size, evicts oldest entries
   */
  set capacity(newSize: number) {
    this.maxSize = newSize;

    // Evict oldest entries if cache is now too large
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Delete a specific entry from the cache
   */
  delete(key: WrapCacheKey): boolean {
    const cacheKey = this.generateKey(key);
    return this.cache.delete(cacheKey);
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    capacity: number;
    utilizationPercent: number;
  } {
    return {
      size: this.cache.size,
      capacity: this.maxSize,
      utilizationPercent: (this.cache.size / this.maxSize) * 100,
    };
  }
}

/**
 * Global default cache instance
 * Can be used by widgets that don't need their own cache
 */
let globalCache: WrapCache | null = null;

export function getGlobalWrapCache(): WrapCache {
  if (!globalCache) {
    globalCache = new WrapCache({ maxSize: 1000 });
  }
  return globalCache;
}

/**
 * Clear the global cache
 * Useful for testing or memory management
 */
export function clearGlobalWrapCache(): void {
  if (globalCache) {
    globalCache.clear();
  }
}

/**
 * Reset the global cache (creates new instance)
 */
export function resetGlobalWrapCache(options?: WrapCacheOptions): void {
  globalCache = new WrapCache(options);
}
