import { Request, Response, NextFunction } from "express";
import { supabase } from "@/lib/supabase/supabase";
import { AppError } from "@/utils/AppError";
import { v4 as uuidv4 } from "uuid";

/**
 * Admin Rate Limiting Middleware
 * Implements comprehensive rate limiting for admin API endpoints
 */
export const adminRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKeyId = (req as any).apiKeyId;
    
    if (!apiKeyId) {
      return next(new AppError("API key ID not found", 500));
    }

    // Get API key rate limit configuration
    const { data: apiKey, error } = await supabase
      .from("admin_api_keys")
      .select("rate_limit")
      .eq("id", apiKeyId)
      .single();

    if (error || !apiKey) {
      return next(new AppError("API key not found", 404));
    }

    const rateLimit = apiKey.rate_limit;
    const now = new Date();

    // Check multiple time windows
    const minuteWindow = new Date(now.getTime() - 60 * 1000);
    const hourWindow = new Date(now.getTime() - 60 * 60 * 1000);
    const dayWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check minute rate limit
    const minuteUsage = await checkRateLimitUsage(apiKeyId, "minute", minuteWindow);
    if (minuteUsage >= rateLimit.requests_per_minute) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Minute rate limit exceeded",
        },
        meta: {
          rate_limit: {
            limit: rateLimit.requests_per_minute,
            remaining: 0,
            reset_time: new Date(now.getTime() + 60 * 1000).toISOString(),
            retry_after: 60,
          },
        },
      });
    }

    // Check hour rate limit
    const hourUsage = await checkRateLimitUsage(apiKeyId, "hour", hourWindow);
    if (hourUsage >= rateLimit.requests_per_hour) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Hour rate limit exceeded",
        },
        meta: {
          rate_limit: {
            limit: rateLimit.requests_per_hour,
            remaining: 0,
            reset_time: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
            retry_after: 3600,
          },
        },
      });
    }

    // Check day rate limit
    const dayUsage = await checkRateLimitUsage(apiKeyId, "day", dayWindow);
    if (dayUsage >= rateLimit.requests_per_day) {
      return res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Daily rate limit exceeded",
        },
        meta: {
          rate_limit: {
            limit: rateLimit.requests_per_day,
            remaining: 0,
            reset_time: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
            retry_after: 86400,
          },
        },
      });
    }

    // Update rate limit counters
    await updateRateLimitCounters(apiKeyId, minuteWindow, hourWindow, dayWindow, minuteUsage, hourUsage, dayUsage);

    // Add rate limit info to response headers
    res.set({
      "X-RateLimit-Limit-Minute": rateLimit.requests_per_minute.toString(),
      "X-RateLimit-Remaining-Minute": (rateLimit.requests_per_minute - minuteUsage - 1).toString(),
      "X-RateLimit-Limit-Hour": rateLimit.requests_per_hour.toString(),
      "X-RateLimit-Remaining-Hour": (rateLimit.requests_per_hour - hourUsage - 1).toString(),
      "X-RateLimit-Limit-Day": rateLimit.requests_per_day.toString(),
      "X-RateLimit-Remaining-Day": (rateLimit.requests_per_day - dayUsage - 1).toString(),
      "X-RateLimit-Reset-Minute": new Date(now.getTime() + 60 * 1000).toISOString(),
      "X-RateLimit-Reset-Hour": new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      "X-RateLimit-Reset-Day": new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    });

    next();
  } catch (error) {
    next(new AppError("Rate limiting failed", 500));
  }
};

/**
 * Check rate limit usage for a specific window
 */
async function checkRateLimitUsage(
  apiKeyId: string,
  windowType: "minute" | "hour" | "day",
  windowStart: Date
): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("admin_api_rate_limits")
      .select("request_count")
      .eq("api_key_id", apiKeyId)
      .eq("window_type", windowType)
      .gte("window_start", windowStart.toISOString())
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
      throw error;
    }

    return data?.request_count || 0;
  } catch (error) {
    console.error(`Failed to check ${windowType} rate limit usage:`, error);
    return 0;
  }
}

/**
 * Update rate limit counters for all windows
 */
async function updateRateLimitCounters(
  apiKeyId: string,
  minuteWindow: Date,
  hourWindow: Date,
  dayWindow: Date,
  minuteUsage: number,
  hourUsage: number,
  dayUsage: number
): Promise<void> {
  try {
    // Update minute counter
    await updateRateLimitCounter(apiKeyId, "minute", minuteWindow, minuteUsage);
    
    // Update hour counter
    await updateRateLimitCounter(apiKeyId, "hour", hourWindow, hourUsage);
    
    // Update day counter
    await updateRateLimitCounter(apiKeyId, "day", dayWindow, dayUsage);
  } catch (error) {
    console.error("Failed to update rate limit counters:", error);
  }
}

/**
 * Update rate limit counter for a specific window
 */
async function updateRateLimitCounter(
  apiKeyId: string,
  windowType: "minute" | "hour" | "day",
  windowStart: Date,
  currentCount: number
): Promise<void> {
  try {
    // Try to update existing record
    const { data, error } = await supabase
      .from("admin_api_rate_limits")
      .update({ request_count: currentCount + 1 })
      .eq("api_key_id", apiKeyId)
      .eq("window_type", windowType)
      .gte("window_start", windowStart.toISOString())
      .select();

    // If no existing record, create a new one
    if (error || !data || data.length === 0) {
      await supabase
        .from("admin_api_rate_limits")
        .insert({
          id: uuidv4(),
          api_key_id: apiKeyId,
          window_start: windowStart.toISOString(),
          window_type: windowType,
          request_count: 1,
        });
    }
  } catch (error) {
    console.error(`Failed to update ${windowType} rate limit counter:`, error);
  }
}

/**
 * Burst Rate Limiting Middleware
 * Implements burst protection to prevent sudden spikes in requests
 */
export const burstRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKeyId = (req as any).apiKeyId;
    
    if (!apiKeyId) {
      return next(new AppError("API key ID not found", 500));
    }

    // Get API key burst limit configuration
    const { data: apiKey, error } = await supabase
      .from("admin_api_keys")
      .select("rate_limit")
      .eq("id", apiKeyId)
      .single();

    if (error || !apiKey) {
      return next(new AppError("API key not found", 404));
    }

    const burstLimit = apiKey.rate_limit.burst_limit || 10;
    const now = new Date();
    const burstWindow = new Date(now.getTime() - 10 * 1000); // 10 second burst window

    // Check burst usage
    const burstUsage = await checkRateLimitUsage(apiKeyId, "minute", burstWindow);
    
    if (burstUsage >= burstLimit) {
      return res.status(429).json({
        success: false,
        error: {
          code: "BURST_RATE_LIMIT_EXCEEDED",
          message: "Burst rate limit exceeded",
        },
        meta: {
          rate_limit: {
            limit: burstLimit,
            remaining: 0,
            reset_time: new Date(now.getTime() + 10 * 1000).toISOString(),
            retry_after: 10,
          },
        },
      });
    }

    next();
  } catch (error) {
    next(new AppError("Burst rate limiting failed", 500));
  }
};

/**
 * Quota Management Middleware
 * Implements quota-based rate limiting for API keys
 */
export const quotaManagementMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKeyId = (req as any).apiKeyId;
    
    if (!apiKeyId) {
      return next(new AppError("API key ID not found", 500));
    }

    // Check quota usage
    const { data: quotas, error } = await supabase
      .from("admin_api_quotas")
      .select("*")
      .eq("api_key_id", apiKeyId)
      .lte("reset_time", new Date().toISOString());

    if (error) {
      return next(new AppError("Failed to check quota usage", 500));
    }

    // Check if any quota is exceeded
    for (const quota of quotas || []) {
      if (quota.current_usage >= quota.limit_value) {
        return res.status(429).json({
          success: false,
          error: {
            code: "QUOTA_EXCEEDED",
            message: `${quota.quota_type} quota exceeded`,
          },
          meta: {
            quota: {
              type: quota.quota_type,
              limit: quota.limit_value,
              used: quota.current_usage,
              reset_time: quota.reset_time,
            },
          },
        });
      }
    }

    // Update quota usage
    await updateQuotaUsage(apiKeyId);

    next();
  } catch (error) {
    next(new AppError("Quota management failed", 500));
  }
};

/**
 * Update quota usage for API key
 */
async function updateQuotaUsage(apiKeyId: string): Promise<void> {
  try {
    const now = new Date();
    const resetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Update or create daily quota
    const { data: existingQuota, error } = await supabase
      .from("admin_api_quotas")
      .select("*")
      .eq("api_key_id", apiKeyId)
      .eq("quota_type", "requests_per_day")
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (existingQuota) {
      await supabase
        .from("admin_api_quotas")
        .update({ current_usage: existingQuota.current_usage + 1 })
        .eq("id", existingQuota.id);
    } else {
      await supabase
        .from("admin_api_quotas")
        .insert({
          id: uuidv4(),
          api_key_id: apiKeyId,
          quota_type: "requests_per_day",
          limit_value: 10000, // Default daily limit
          current_usage: 1,
          reset_time: resetTime.toISOString(),
        });
    }
  } catch (error) {
    console.error("Failed to update quota usage:", error);
  }
}

/**
 * Rate Limit Status Middleware
 * Provides rate limit status information in response headers
 */
export const rateLimitStatusMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add rate limit status to response
  res.set({
    "X-RateLimit-Policy": "admin-api-v1",
    "X-RateLimit-Version": "1.0",
  });

  next();
};
