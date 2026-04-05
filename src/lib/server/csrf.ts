/**
 * CSRF Protection Utilities
 * Implements SameSite cookie strategy with optional CSRF tokens
 */

import { createHmac, randomBytes } from 'crypto';
import { ADMIN_SECRET } from '$env/static/private';

/**
 * Generate a CSRF token
 * Stored in session/cookie and validated on form submission
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create CSRF token hash for comparison
 * Double-submit cookie pattern
 */
export function hashCSRFToken(token: string): string {
  const hmac = createHmac('sha256', ADMIN_SECRET || 'fallback-secret');
  hmac.update(token);
  return hmac.digest('hex');
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, hash: string): boolean {
  try {
    const computedHash = hashCSRFToken(token);
    // Constant-time comparison to prevent timing attacks
    return computedHash === hash && token.length === 64;
  } catch {
    return false;
  }
}

export const CSRF_COOKIE_OPTIONS = {
  path: '/',
  httpOnly: false, // Needs to be false for JavaScript to access for CSRF token
  sameSite: 'lax',
  secure: true,
  maxAge: 60 * 60 * 24, // 24 hours
} as const;

export const CSRF_HEADER_NAME = 'x-csrf-token';
