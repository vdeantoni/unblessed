/**
 * wrap-cache.test.js - Tests for wrap cache
 */

import { beforeEach, describe, expect, it } from "vitest";
import {
  WrapCache,
  clearGlobalWrapCache,
  getGlobalWrapCache,
  resetGlobalWrapCache,
} from "../../src/lib/wrap-cache.js";

describe("wrap-cache", () => {
  describe("WrapCache", () => {
    let cache;

    beforeEach(() => {
      cache = new WrapCache({ maxSize: 3 });
    });

    describe("constructor", () => {
      it("should create cache with default max size", () => {
        const defaultCache = new WrapCache();
        expect(defaultCache.capacity).toBe(1000);
        expect(defaultCache.size).toBe(0);
      });

      it("should create cache with custom max size", () => {
        const customCache = new WrapCache({ maxSize: 100 });
        expect(customCache.capacity).toBe(100);
      });
    });

    describe("set and get", () => {
      it("should store and retrieve wrapped content", () => {
        const key = {
          content: "Hello World",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["Hello", "World"], {
          rtof: [0, 1],
          ftor: [[0], [1]],
          fake: ["Hello World"],
          real: ["Hello", "World"],
          mwidth: 5,
        });

        cache.set(key, value);
        const retrieved = cache.get(key);

        expect(retrieved).toBe(value);
        expect(retrieved[0]).toBe("Hello");
        expect(retrieved[1]).toBe("World");
      });

      it("should return undefined for non-existent key", () => {
        const key = {
          content: "Not there",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        expect(cache.get(key)).toBeUndefined();
      });

      it("should differentiate between different keys", () => {
        const key1 = {
          content: "Hello",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const key2 = {
          content: "Hello",
          width: 20, // Different width
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value1 = Object.assign(["Hello"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["Hello"],
          real: ["Hello"],
          mwidth: 5,
        });

        const value2 = Object.assign(["Hello"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["Hello"],
          real: ["Hello"],
          mwidth: 5,
        });

        cache.set(key1, value1);
        cache.set(key2, value2);

        expect(cache.get(key1)).toBe(value1);
        expect(cache.get(key2)).toBe(value2);
        expect(cache.size).toBe(2);
      });
    });

    describe("LRU eviction", () => {
      it.skip("should evict oldest entry when cache is full (TODO: investigate test issue)", () => {
        const key1 = {
          content: "1",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key2 = {
          content: "2",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key3 = {
          content: "3",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key4 = {
          content: "4",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        // Fill cache to capacity (3)
        cache.set(key1, value);
        cache.set(key2, value);
        cache.set(key3, value);

        expect(cache.size).toBe(3);
        expect(cache.get(key1)).toBeDefined();

        // Add 4th entry, should evict key1 (oldest)
        cache.set(key4, value);

        expect(cache.size).toBe(3);
        expect(cache.get(key1)).toBeUndefined(); // Evicted
        expect(cache.get(key2)).toBeDefined();
        expect(cache.get(key3)).toBeDefined();
        expect(cache.get(key4)).toBeDefined();
      });

      it("should update LRU order on get", () => {
        const key1 = {
          content: "1",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key2 = {
          content: "2",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key3 = {
          content: "3",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key4 = {
          content: "4",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        // Fill cache
        cache.set(key1, value);
        cache.set(key2, value);
        cache.set(key3, value);

        // Access key1, making it most recently used
        cache.get(key1);

        // Add key4, should evict key2 (now oldest)
        cache.set(key4, value);

        expect(cache.get(key1)).toBeDefined(); // Still there (accessed recently)
        expect(cache.get(key2)).toBeUndefined(); // Evicted
        expect(cache.get(key3)).toBeDefined();
        expect(cache.get(key4)).toBeDefined();
      });

      it("should update LRU order on set of existing key", () => {
        const key1 = {
          content: "1",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key2 = {
          content: "2",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key3 = {
          content: "3",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key4 = {
          content: "4",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        // Fill cache
        cache.set(key1, value);
        cache.set(key2, value);
        cache.set(key3, value);

        // Update key1, making it most recently used
        cache.set(key1, value);

        // Add key4, should evict key2 (now oldest)
        cache.set(key4, value);

        expect(cache.get(key1)).toBeDefined(); // Still there (set recently)
        expect(cache.get(key2)).toBeUndefined(); // Evicted
        expect(cache.get(key3)).toBeDefined();
        expect(cache.get(key4)).toBeDefined();
      });
    });

    describe("has", () => {
      it("should return true for existing key", () => {
        const key = {
          content: "Hello",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["Hello"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["Hello"],
          real: ["Hello"],
          mwidth: 5,
        });

        cache.set(key, value);
        expect(cache.has(key)).toBe(true);
      });

      it("should return false for non-existent key", () => {
        const key = {
          content: "Not there",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        expect(cache.has(key)).toBe(false);
      });
    });

    describe("clear", () => {
      it("should remove all entries", () => {
        const key1 = {
          content: "1",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key2 = {
          content: "2",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        cache.set(key1, value);
        cache.set(key2, value);

        expect(cache.size).toBe(2);

        cache.clear();

        expect(cache.size).toBe(0);
        expect(cache.get(key1)).toBeUndefined();
        expect(cache.get(key2)).toBeUndefined();
      });
    });

    describe("delete", () => {
      it("should remove specific entry", () => {
        const key = {
          content: "Hello",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["Hello"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["Hello"],
          real: ["Hello"],
          mwidth: 5,
        });

        cache.set(key, value);
        expect(cache.size).toBe(1);

        const deleted = cache.delete(key);

        expect(deleted).toBe(true);
        expect(cache.size).toBe(0);
        expect(cache.get(key)).toBeUndefined();
      });

      it("should return false for non-existent key", () => {
        const key = {
          content: "Not there",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const deleted = cache.delete(key);
        expect(deleted).toBe(false);
      });
    });

    describe("capacity", () => {
      it("should get capacity", () => {
        expect(cache.capacity).toBe(3);
      });

      it("should set capacity and evict if needed", () => {
        const key1 = {
          content: "1",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key2 = {
          content: "2",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };
        const key3 = {
          content: "3",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        cache.set(key1, value);
        cache.set(key2, value);
        cache.set(key3, value);

        expect(cache.size).toBe(3);

        // Reduce capacity to 2, should evict oldest
        cache.capacity = 2;

        expect(cache.capacity).toBe(2);
        expect(cache.size).toBe(2);
        expect(cache.get(key1)).toBeUndefined(); // Evicted
        expect(cache.get(key2)).toBeDefined();
        expect(cache.get(key3)).toBeDefined();
      });

      it("should allow increasing capacity", () => {
        cache.capacity = 10;
        expect(cache.capacity).toBe(10);
      });
    });

    describe("getStats", () => {
      it("should return cache statistics", () => {
        const key = {
          content: "Hello",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["Hello"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["Hello"],
          real: ["Hello"],
          mwidth: 5,
        });

        cache.set(key, value);

        const stats = cache.getStats();
        expect(stats.size).toBe(1);
        expect(stats.capacity).toBe(3);
        expect(stats.utilizationPercent).toBeCloseTo(33.33, 1);
      });

      it("should show 100% utilization when full", () => {
        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        cache.set(
          {
            content: "1",
            width: 10,
            wrapMode: "wrap",
            fullUnicode: false,
            align: null,
            parseTags: false,
          },
          value,
        );
        cache.set(
          {
            content: "2",
            width: 10,
            wrapMode: "wrap",
            fullUnicode: false,
            align: null,
            parseTags: false,
          },
          value,
        );
        cache.set(
          {
            content: "3",
            width: 10,
            wrapMode: "wrap",
            fullUnicode: false,
            align: null,
            parseTags: false,
          },
          value,
        );

        const stats = cache.getStats();
        expect(stats.utilizationPercent).toBe(100);
      });
    });

    describe("key differentiation", () => {
      it("should differentiate by wrapMode", () => {
        const baseKey = {
          content: "Hello World",
          width: 10,
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        cache.set({ ...baseKey, wrapMode: "wrap" }, value);
        cache.set({ ...baseKey, wrapMode: "truncate-end" }, value);

        expect(cache.size).toBe(2);
      });

      it("should differentiate by fullUnicode", () => {
        const baseKey = {
          content: "Hello World",
          width: 10,
          wrapMode: "wrap",
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        cache.set({ ...baseKey, fullUnicode: false }, value);
        cache.set({ ...baseKey, fullUnicode: true }, value);

        expect(cache.size).toBe(2);
      });

      it("should differentiate by boolean wrapMode", () => {
        const baseKey = {
          content: "Hello World",
          width: 10,
          fullUnicode: false,
          align: "left",
          parseTags: true,
        };

        const value = Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        });

        cache.set({ ...baseKey, wrapMode: true }, value);
        cache.set({ ...baseKey, wrapMode: false }, value);

        expect(cache.size).toBe(2);
      });
    });
  });

  describe("global cache", () => {
    beforeEach(() => {
      clearGlobalWrapCache();
    });

    it("should create and return global cache", () => {
      const cache1 = getGlobalWrapCache();
      const cache2 = getGlobalWrapCache();

      expect(cache1).toBe(cache2); // Same instance
      expect(cache1.capacity).toBe(1000);
    });

    it("should clear global cache", () => {
      const cache = getGlobalWrapCache();

      const key = {
        content: "Hello",
        width: 10,
        wrapMode: "wrap",
        fullUnicode: false,
        align: "left",
        parseTags: true,
      };

      const value = Object.assign(["Hello"], {
        rtof: [0],
        ftor: [[0]],
        fake: ["Hello"],
        real: ["Hello"],
        mwidth: 5,
      });

      cache.set(key, value);
      expect(cache.size).toBe(1);

      clearGlobalWrapCache();
      expect(cache.size).toBe(0);
    });

    it("should reset global cache with new options", () => {
      const cache1 = getGlobalWrapCache();
      cache1.set(
        {
          content: "test",
          width: 10,
          wrapMode: "wrap",
          fullUnicode: false,
          align: null,
          parseTags: false,
        },
        Object.assign(["test"], {
          rtof: [0],
          ftor: [[0]],
          fake: ["test"],
          real: ["test"],
          mwidth: 4,
        }),
      );

      resetGlobalWrapCache({ maxSize: 500 });

      const cache2 = getGlobalWrapCache();
      expect(cache2.capacity).toBe(500);
      expect(cache2.size).toBe(0); // New instance, empty
    });
  });
});
