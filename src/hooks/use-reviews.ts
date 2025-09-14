"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Review,
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewFilterOptions,
  PaginationOptions,
  ReviewLoadingState,
  ReviewErrorState,
  ExportFormat,
  ReviewMutationEvent,
} from "@/types/reviews.types";
import { useReviewsApi } from "@/hooks/api-connections/use-reviews-api";
import { useReviewCache } from "@/hooks/use-review-cache";
import { useReviewFilters } from "@/hooks/use-review-filters";
import { useReviewStats } from "@/hooks/use-review-stats";
import {
  validateReviewInput,
  exportToCSV,
  exportToJSON,
  generatePaginationData,
  haveFiltersChanged,
  normalizeErrorMessage,
} from "@/utils/review-helpers";

/**
 * Configuration options for the useReviews hook
 */
interface UseReviewsOptions {
  /** User ID to fetch reviews for */
  userId?: string;

  /** Initial filter settings */
  initialFilters?: ReviewFilterOptions;

  /** Initial page number for pagination */
  initialPage?: number;

  /** Number of items per page */
  pageSize?: number;

  /** Whether to enable caching (default: true) */
  enableCaching?: boolean;

  /** Whether to enable debug logging (default: false) */
  enableLogging?: boolean;

  /** Whether to sync data across browser tabs (default: true) */
  syncAcrossTabs?: boolean;
}

/**
 * useReviews - Advanced Review Management Hook
 *
 * This hook provides centralized logic for comprehensive review management,
 * implementing CRUD operations, filtering, pagination, caching, and analytics.
 *
 * Key features:
 * - Complete CRUD operations with validation
 * - Advanced filtering by rating, date, and project type
 * - Full-text search with relevance scoring
 * - Efficient pagination with configurable page sizes
 * - Intelligent caching with TTL and cross-tab synchronization
 * - Comprehensive statistics and analytics
 * - Export capabilities in multiple formats
 * - Detailed loading and error states
 */
export function useReviews({
  userId,
  initialFilters = {},
  initialPage = 1,
  pageSize = 10,
  enableCaching = true,
  enableLogging = false,
  syncAcrossTabs = true,
}: UseReviewsOptions = {}) {
  // Main review data state
  const [reviews, setReviews] = useState<Review[]>([]);

  // Pagination configuration
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: initialPage,
    pageSize: pageSize,
  });

  // Granular loading states for better UI feedback
  const [loadingState, setLoadingState] = useState<ReviewLoadingState>({
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isFetching: false,
  });

  // Operation-specific error states
  const [errorState, setErrorState] = useState<ReviewErrorState>({});

  // Debounced filters to prevent excessive API calls
  const [debouncedFilters, setDebouncedFilters] =
    useState<ReviewFilterOptions>(initialFilters);

  // API hooks
  const { fetchUserReviews, createReview, computeAverage } = useReviewsApi();

  // Cache hook
  const {
    cacheReviews,
    getCachedReviews,
    hasCache,
    invalidateUserCache,
    broadcastMutation,
  } = useReviewCache({
    syncAcrossTabs,
    debugMode: enableLogging,
  });

  // Logging utility
  const log = useCallback(
    (message: string, data?: any) => {
      if (enableLogging) {
        console.log(`[Reviews Hook] ${message}`, data);
      }
    },
    [enableLogging]
  );

  // Generate cache key for reviews
  const generateCacheKey = useCallback(
    (targetUserId: string, filterOptions?: ReviewFilterOptions) => {
      if (filterOptions && Object.keys(filterOptions).length > 0) {
        return `reviews:${targetUserId}:${JSON.stringify(filterOptions)}`;
      }
      return `reviews:${targetUserId}`;
    },
    []
  );

  // Fetch reviews from API
  const fetchReviews = useCallback(
    async (targetUserId?: string, filterOptions?: ReviewFilterOptions) => {
      if (!targetUserId) {
        log("No user ID provided for fetching reviews");
        return [];
      }

      const finalUserId = targetUserId;
      const cacheKey = generateCacheKey(finalUserId, filterOptions);

      // Set loading state
      setLoadingState((prev) => ({ ...prev, isFetching: true }));
      setErrorState((prev) => ({ ...prev, fetchError: undefined }));

      try {
        // Check cache first if enabled
        if (enableCaching && hasCache(cacheKey)) {
          const cachedData = getCachedReviews<Review[]>(cacheKey);
          if (cachedData) {
            log(`Retrieved ${cachedData.length} reviews from cache`, {
              cacheKey,
            });
            return cachedData;
          }
        }

        // Fetch from API
        log(`Fetching reviews for user ${finalUserId}`);
        const data = await fetchUserReviews(finalUserId);
        log(`Fetched ${data.length} reviews`);

        // Cache the results if enabled
        if (enableCaching) {
          cacheReviews(cacheKey, data);
        }

        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch reviews";
        log(`Error fetching reviews: ${errorMessage}`, err);
        setErrorState((prev) => ({
          ...prev,
          fetchError: normalizeErrorMessage(errorMessage),
        }));
        return [];
      } finally {
        setLoadingState((prev) => ({ ...prev, isFetching: false }));
      }
    },
    [
      fetchUserReviews,
      enableCaching,
      hasCache,
      getCachedReviews,
      cacheReviews,
      generateCacheKey,
      log,
    ]
  );

  // Load reviews
  const loadReviews = useCallback(async () => {
    if (!userId) return;

    setLoadingState((prev) => ({ ...prev, isLoading: true }));
    log("Loading reviews", { userId, filters: debouncedFilters });

    try {
      const reviewsData = await fetchReviews(userId, debouncedFilters);
      setReviews(reviewsData);

      // Update pagination
      setPagination((prev) => ({
        ...prev,
        totalItems: reviewsData.length,
        totalPages: Math.ceil(reviewsData.length / prev.pageSize),
      }));

      log(`Loaded ${reviewsData.length} reviews`);
    } catch (err) {
      log("Error loading reviews", err);
    } finally {
      setLoadingState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [userId, debouncedFilters, fetchReviews, log]);

  // Handle filter changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (haveFiltersChanged(debouncedFilters, initialFilters)) {
        setDebouncedFilters(initialFilters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [initialFilters, debouncedFilters]);

  // Load reviews when userId or filters change
  useEffect(() => {
    if (userId) {
      loadReviews();
    }
  }, [userId, debouncedFilters, loadReviews]);

  // Initialize pagination when reviews change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalItems: reviews.length,
      totalPages: Math.ceil(reviews.length / prev.pageSize),
      page: Math.min(prev.page, Math.ceil(reviews.length / prev.pageSize) || 1),
    }));
  }, [reviews]);

  // Review filtering system
  const {
    filters,
    setFilters,
    setFilter,
    setRatingFilter,
    setDateRangeFilter,
    setProjectTypeFilter,
    setSearchQuery,
    setSortOptions,
    resetFilters,
    filteredReviews,
    searchResults,
    availableProjectTypes,
    hasActiveFilters,
    activeFiltersSummary,
  } = useReviewFilters({
    initialFilters: debouncedFilters,
    reviews,
    enableSearchScoring: true,
  });

  // Update main filters and refresh
  const applyFilters = useCallback((newFilters: ReviewFilterOptions) => {
    setDebouncedFilters(newFilters);
  }, []);

  // Paginated reviews
  const paginatedReviews = useMemo(() => {
    const startIdx = (pagination.page - 1) * pagination.pageSize;
    const endIdx = startIdx + pagination.pageSize;
    return filteredReviews.slice(startIdx, endIdx);
  }, [filteredReviews, pagination.page, pagination.pageSize]);

  // Set page
  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages || 1)),
    }));
  }, []);

  // Set page size
  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => {
      const newTotalPages = Math.ceil((prev.totalItems || 0) / size);
      return {
        ...prev,
        pageSize: size,
        totalPages: newTotalPages,
        page: Math.min(prev.page, newTotalPages || 1),
      };
    });
  }, []);

  // Get pagination data
  const paginationData = useMemo(() => {
    return generatePaginationData(
      filteredReviews.length,
      pagination.pageSize,
      pagination.page
    );
  }, [filteredReviews.length, pagination.pageSize, pagination.page]);

  // Create a new review
  const createNewReview = useCallback(
    async (input: CreateReviewDTO): Promise<Review> => {
      // Validate input
      const validationError = validateReviewInput(input);
      if (validationError) {
        log("Validation error", validationError);
        setErrorState((prev) => ({ ...prev, createError: validationError }));
        throw new Error(validationError);
      }

      setLoadingState((prev) => ({ ...prev, isCreating: true }));
      setErrorState((prev) => ({ ...prev, createError: undefined }));

      try {
        log("Creating review", input);
        const review = await createReview(input);
        log("Review created", review);

        // Update local state
        setReviews((prev) => {
          const updated = [review, ...prev];

          // If caching is enabled, update cache
          if (enableCaching && userId) {
            const cacheKey = generateCacheKey(userId);
            cacheReviews(cacheKey, updated);

            if (input.to_id !== userId) {
              // Also invalidate cache for the reviewee
              invalidateUserCache(input.to_id);
            }
          }

          return updated;
        });

        // Broadcast mutation to other tabs if enabled
        broadcastMutation({
          type: "create",
          payload: review,
          timestamp: Date.now(),
        });

        return review;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create review";
        log("Error creating review", errorMessage);
        setErrorState((prev) => ({
          ...prev,
          createError: normalizeErrorMessage(errorMessage),
        }));
        throw err;
      } finally {
        setLoadingState((prev) => ({ ...prev, isCreating: false }));
      }
    },
    [
      createReview,
      userId,
      enableCaching,
      generateCacheKey,
      cacheReviews,
      invalidateUserCache,
      broadcastMutation,
      log,
    ]
  );

  // Update an existing review
  const updateReview = useCallback(
    async (input: UpdateReviewDTO): Promise<Review> => {
      if (!input.id) {
        const errorMsg = "Review ID is required for updates";
        setErrorState((prev) => ({ ...prev, updateError: errorMsg }));
        throw new Error(errorMsg);
      }

      setLoadingState((prev) => ({ ...prev, isUpdating: true }));
      setErrorState((prev) => ({ ...prev, updateError: undefined }));

      try {
        log("Updating review", input);

        // In a real implementation, this would call an API endpoint
        // For now, we'll update locally
        let updatedReview: Review | undefined;

        setReviews((prev) => {
          const updated = prev.map((review) => {
            if (review.id === input.id) {
              updatedReview = {
                ...review,
                ...(input.rating !== undefined && { rating: input.rating }),
                ...(input.comment !== undefined && { comment: input.comment }),
                ...(input.project_title !== undefined && {
                  project_title: input.project_title,
                }),
                ...(input.project_type !== undefined && {
                  project_type: input.project_type,
                }),
                ...(input.project_value !== undefined && {
                  project_value: input.project_value,
                }),
              };
              return updatedReview;
            }
            return review;
          });

          // Update cache
          if (enableCaching && userId && updatedReview) {
            const cacheKey = generateCacheKey(userId);
            cacheReviews(cacheKey, updated);

            if (updatedReview.to_id !== userId) {
              // Also invalidate cache for the reviewee
              invalidateUserCache(updatedReview.to_id);
            }
          }

          return updated;
        });

        if (!updatedReview) {
          throw new Error("Review not found");
        }

        // Broadcast mutation
        broadcastMutation({
          type: "update",
          payload: updatedReview,
          timestamp: Date.now(),
        });

        log("Review updated", updatedReview);
        return updatedReview;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update review";
        log("Error updating review", errorMessage);
        setErrorState((prev) => ({
          ...prev,
          updateError: normalizeErrorMessage(errorMessage),
        }));
        throw err;
      } finally {
        setLoadingState((prev) => ({ ...prev, isUpdating: false }));
      }
    },
    [
      userId,
      enableCaching,
      generateCacheKey,
      cacheReviews,
      invalidateUserCache,
      broadcastMutation,
      log,
    ]
  );

  // Delete a review
  const deleteReview = useCallback(
    async (reviewId: string): Promise<void> => {
      if (!reviewId) {
        const errorMsg = "Review ID is required for deletion";
        setErrorState((prev) => ({ ...prev, deleteError: errorMsg }));
        throw new Error(errorMsg);
      }

      setLoadingState((prev) => ({ ...prev, isDeleting: true }));
      setErrorState((prev) => ({ ...prev, deleteError: undefined }));

      try {
        log("Deleting review", { reviewId });

        // Find the review to be deleted (for cache invalidation)
        const reviewToDelete = reviews.find((r) => r.id === reviewId);
        if (!reviewToDelete) {
          throw new Error("Review not found");
        }

        // In a real implementation, this would call an API endpoint
        // For now, we'll delete locally
        setReviews((prev) => {
          const updated = prev.filter((review) => review.id !== reviewId);

          // Update cache
          if (enableCaching && userId) {
            const cacheKey = generateCacheKey(userId);
            cacheReviews(cacheKey, updated);

            if (reviewToDelete.to_id !== userId) {
              // Also invalidate cache for the reviewee
              invalidateUserCache(reviewToDelete.to_id);
            }
          }

          return updated;
        });

        // Broadcast mutation
        broadcastMutation({
          type: "delete",
          payload: reviewToDelete,
          timestamp: Date.now(),
        });

        log("Review deleted", { reviewId });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete review";
        log("Error deleting review", errorMessage);
        setErrorState((prev) => ({
          ...prev,
          deleteError: normalizeErrorMessage(errorMessage),
        }));
        throw err;
      } finally {
        setLoadingState((prev) => ({ ...prev, isDeleting: false }));
      }
    },
    [
      reviews,
      userId,
      enableCaching,
      generateCacheKey,
      cacheReviews,
      invalidateUserCache,
      broadcastMutation,
      log,
    ]
  );

  // Get a review by ID
  const getReviewById = useCallback(
    (reviewId: string): Review | undefined => {
      return reviews.find((review) => review.id === reviewId);
    },
    [reviews]
  );

  // Export reviews in different formats
  const exportReviews = useCallback(
    (format: ExportFormat = "csv", includeFilters = true): string => {
      const dataToExport = includeFilters ? filteredReviews : reviews;

      switch (format) {
        case "json":
          return exportToJSON(dataToExport);
        case "csv":
          return exportToCSV(dataToExport);
        default:
          return exportToCSV(dataToExport);
      }
    },
    [reviews, filteredReviews]
  );

  // Download exported reviews
  const downloadReviews = useCallback(
    (format: ExportFormat = "csv", filename?: string) => {
      const dataToExport = exportReviews(format, true);

      // Create file download
      const element = document.createElement("a");
      let mimeType: string;
      let extension: string;

      switch (format) {
        case "json":
          mimeType = "application/json";
          extension = "json";
          break;
        case "pdf":
          mimeType = "application/pdf";
          extension = "pdf";
          break;
        case "csv":
        default:
          mimeType = "text/csv";
          extension = "csv";
      }

      const finalFilename =
        filename ||
        `reviews-export-${new Date().toISOString().split("T")[0]}.${extension}`;

      const blob = new Blob([dataToExport], { type: mimeType });
      const url = URL.createObjectURL(blob);

      element.href = url;
      element.download = finalFilename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      log("Reviews downloaded", { format, filename: finalFilename });
    },
    [exportReviews, log]
  );

  // Review statistics
  const reviewStats = useReviewStats({
    reviews: filteredReviews,
    includeProjectValues: true,
    includeTrends: true,
  });

  // Manual refresh
  const refreshReviews = useCallback(() => {
    if (userId) {
      // Clear cache for this user
      if (enableCaching) {
        invalidateUserCache(userId);
      }

      // Reload reviews
      loadReviews();
    }
  }, [userId, enableCaching, invalidateUserCache, loadReviews]);

  // Return comprehensive review management API
  return {
    // Review data
    reviews,
    filteredReviews,
    paginatedReviews,
    searchResults,

    // CRUD operations
    createReview: createNewReview,
    updateReview,
    deleteReview,
    getReviewById,
    refreshReviews,

    // Filter system
    filters,
    setFilters,
    setFilter,
    setRatingFilter,
    setDateRangeFilter,
    setProjectTypeFilter,
    setSearchQuery,
    setSortOptions,
    resetFilters,
    applyFilters,
    availableProjectTypes,
    hasActiveFilters,
    activeFiltersSummary,

    // Pagination
    pagination: paginationData,
    setPage,
    setPageSize,

    // Loading and error states
    isLoading: loadingState.isLoading,
    isCreating: loadingState.isCreating,
    isUpdating: loadingState.isUpdating,
    isDeleting: loadingState.isDeleting,
    isFetching: loadingState.isFetching,

    errors: errorState,

    // Statistics
    averageRating: reviewStats.averageRating,
    totalReviews: reviewStats.totalReviews,
    fiveStarReviews: reviewStats.fiveStarReviews,
    fiveStarPercentage: reviewStats.fiveStarPercentage,
    ratingDistribution: reviewStats.ratingDistribution,
    reviewStats,
    computeAverage,

    // Export capabilities
    exportReviews,
    downloadReviews,
  };
}
