/**
 * Simple in-memory rate limiting
 * For production, use Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const limitStore = new Map<string, RateLimitEntry>();

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP, email, etc.)
 * @param maxRequests - Max requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000 // 1 minute default
): boolean {
  const now = Date.now();
  const entry = limitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New entry or window expired
    limitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true; // Rate limited
  }

  entry.count++;
  return false;
}

/**
 * Get rate limit info for a given identifier
 */
export function getRateLimitInfo(identifier: string, maxRequests: number = 5, windowMs: number = 60 * 1000) {
  const now = Date.now();
  const entry = limitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    return {
      remaining: maxRequests,
      resetTime: now + windowMs,
      isLimited: false,
    };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime,
    isLimited: entry.count >= maxRequests,
  };
}

/**
 * Clean up old entries periodically
 * Call this from a cron job or periodically from your app
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of limitStore.entries()) {
    if (now > entry.resetTime) {
      limitStore.delete(key);
    }
  }
}

// Auto-cleanup every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000);

/**
 * Extract client IP from request
 * Handles proxied requests (X-Forwarded-For, CF-Connecting-IP, etc.)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  // Fallback - this won't work in serverless, use above headers
  return 'unknown';
}
