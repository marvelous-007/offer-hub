"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CacheConfig,
  CacheItem,
  Review,
  ReviewMutationEvent,
} from "@/types/reviews.types";
import ReviewCacheManager from "@/utils/review-cache-manager";

interface UseReviewCacheOptions extends Partial<CacheConfig> {
  onCacheUpdate?: (key: string) => void;
  syncAcrossTabs?: boolean;
  debugMode?: boolean;
}

/**
 * useReviewCache - Custom hook for managing review data caching
 * Features:
 * - Time-to-Live (TTL) management
 * - Automatic cache invalidation
 * - Cross-tab synchronization
 * - Cache hit/miss tracking
 */
export function useReviewCache(options: UseReviewCacheOptions = {}) {
  const {
    onCacheUpdate,
    syncAcrossTabs = true,
    debugMode = false,
    ...cacheConfig
  } = options;

  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0,
  });

  // Initialize cache manager with configuration
  const cacheManager = ReviewCacheManager.getInstance(cacheConfig);

  // Subscribe to cache updates for statistics
  useEffect(() => {
    if (!syncAcrossTabs) return;

    const unsubscribe = cacheManager.subscribe((key) => {
      setCacheStats((prev) => ({
        ...prev,
        size: cacheManager.size(),
      }));

      if (onCacheUpdate) {
        onCacheUpdate(key);
      }

      if (debugMode) {
        console.log(`[Review Cache] Updated: ${key}`);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [cacheManager, onCacheUpdate, syncAcrossTabs, debugMode]);

  /**
   * Cache a review or array of reviews with an optional TTL
   */
  const cacheReviews = useCallback(
    (key: string, data: Review | Review[], ttl?: number) => {
      cacheManager.set(key, data, ttl);

      if (debugMode) {
        console.log(`[Review Cache] Cached: ${key}`);
      }
    },
    [cacheManager, debugMode]
  );

  /**
   * Get cached reviews by key
   */
  const getCachedReviews = useCallback(
    <T extends Review | Review[]>(key: string): T | null => {
      const data = cacheManager.get<T>(key);

      if (data) {
        setCacheStats((prev) => ({
          ...prev,
          hits: prev.hits + 1,
        }));

        if (debugMode) {
          console.log(`[Review Cache] Hit: ${key}`);
        }
      } else {
        setCacheStats((prev) => ({
          ...prev,
          misses: prev.misses + 1,
        }));

        if (debugMode) {
          console.log(`[Review Cache] Miss: ${key}`);
        }
      }

      return data;
    },
    [cacheManager, debugMode]
  );

  /**
   * Check if reviews are cached
   */
  const hasCache = useCallback(
    (key: string): boolean => {
      return cacheManager.has(key);
    },
    [cacheManager]
  );

  /**
   * Invalidate cached reviews by key
   */
  const invalidateCache = useCallback(
    (key: string) => {
      cacheManager.delete(key);

      if (debugMode) {
        console.log(`[Review Cache] Invalidated: ${key}`);
      }
    },
    [cacheManager, debugMode]
  );

  /**
   * Invalidate all cache items matching a pattern
   * Example: invalidatePattern('reviews:userId')
   */
  const invalidatePattern = useCallback(
    (pattern: string) => {
      cacheManager.invalidatePattern(pattern);

      if (debugMode) {
        console.log(`[Review Cache] Invalidated pattern: ${pattern}`);
      }
    },
    [cacheManager, debugMode]
  );

  /**
   * Invalidate all user-related reviews cache
   */
  const invalidateUserCache = useCallback(
    (userId: string) => {
      cacheManager.invalidatePattern(`reviews:${userId}`);

      if (debugMode) {
        console.log(`[Review Cache] Invalidated user cache: ${userId}`);
      }
    },
    [cacheManager, debugMode]
  );

  /**
   * Clear entire review cache
   */
  const clearCache = useCallback(() => {
    cacheManager.clear();
    setCacheStats({ hits: 0, misses: 0, size: 0 });

    if (debugMode) {
      console.log("[Review Cache] Cleared all cache");
    }
  }, [cacheManager, debugMode]);

  /**
   * Refresh a cached item's timestamp
   */
  const refreshCache = useCallback(
    (key: string): boolean => {
      const result = cacheManager.refresh(key);

      if (debugMode && result) {
        console.log(`[Review Cache] Refreshed: ${key}`);
      }

      return result;
    },
    [cacheManager, debugMode]
  );

  /**
   * Update TTL for a cached item
   */
  const updateCacheTTL = useCallback(
    (key: string, ttl: number): boolean => {
      return cacheManager.updateTTL(key, ttl);
    },
    [cacheManager]
  );

  /**
   * Broadcast a mutation event to other tabs
   */
  const broadcastMutation = useCallback(
    (event: ReviewMutationEvent) => {
      if (!syncAcrossTabs || typeof window === "undefined") return;

      try {
        const eventKey = "offerhub_review_mutation";
        const eventData = JSON.stringify(event);

        localStorage.setItem(eventKey, eventData);

        // This is needed to trigger the storage event in the same tab
        setTimeout(() => {
          localStorage.removeItem(eventKey);
        }, 100);

        if (debugMode) {
          console.log(`[Review Cache] Broadcast mutation: ${event.type}`);
        }
      } catch (e) {
        console.error("Failed to broadcast mutation event:", e);
      }
    },
    [syncAcrossTabs, debugMode]
  );

  /**
   * Listen for mutation events from other tabs
   */
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "offerhub_review_mutation" || !event.newValue) return;

      try {
        const mutation = JSON.parse(event.newValue) as ReviewMutationEvent;

        // Handle mutation based on type
        switch (mutation.type) {
          case "create":
            invalidatePattern(`reviews:${mutation.payload.to_id}`);
            break;

          case "update":
          case "delete":
            invalidatePattern(`reviews:${mutation.payload.to_id}`);
            invalidateCache(`review:${mutation.payload.id}`);
            break;
        }

        if (debugMode) {
          console.log(`[Review Cache] Received mutation: ${mutation.type}`);
        }
      } catch (e) {
        console.error("Failed to process mutation event:", e);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncAcrossTabs, debugMode, invalidatePattern, invalidateCache]);

  // Stats monitoring (optional)
  useEffect(() => {
    // Update stats periodically
    if (debugMode) {
      const interval = setInterval(() => {
        setCacheStats((prev) => ({
          ...prev,
          size: cacheManager.size(),
        }));
      }, 10000); // Every 10 seconds

      return () => clearInterval(interval);
    }
  }, [cacheManager, debugMode]);

  return {
    cacheReviews,
    getCachedReviews,
    hasCache,
    invalidateCache,
    invalidatePattern,
    invalidateUserCache,
    clearCache,
    refreshCache,
    updateCacheTTL,
    broadcastMutation,
    cacheStats,
  };
}
