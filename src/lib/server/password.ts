/**
 * Password Security Utilities
 * 
 * NOTE: This implementation is prepared for bcrypt integration.
 * To complete the implementation:
 * 1. Add bcrypt to dependencies: npm/bun install bcrypt
 * 2. Update admin password storage: hash it once during setup
 * 3. Update login validation to use bcrypt.compare()
 * 
 * For now, using crypto-based hashing as fallback
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Hash a password using PBKDF2 (fallback when bcrypt unavailable)
 * Salt is randomly generated (16 bytes = 128 bits)
 */
export function hashPasswordPBKDF2(password: string): string {
  const crypto = require('crypto');
  const salt = randomBytes(16);
  const iterations = 100000;
  const keyLength = 64;
  const digest = 'sha256';

  const key = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
  
  // Format: algorithm$iterations$salt$hash
  return `pbkdf2$${iterations}$${salt.toString('hex')}$${key.toString('hex')}`;
}

/**
 * Verify a PBKDF2-hashed password
 */
export function verifyPasswordPBKDF2(password: string, hash: string): boolean {
  try {
    const crypto = require('crypto');
    const [algorithm, iterations, saltHex, hashHex] = hash.split('$');

    if (algorithm !== 'pbkdf2') {
      return false;
    }

    const salt = Buffer.from(saltHex, 'hex');
    const iterCount = parseInt(iterations);

    const key = crypto.pbkdf2Sync(password, salt, iterCount, 64, 'sha256');
    return key.toString('hex') === hashHex;
  } catch {
    return false;
  }
}

/**
 * Hash a string for non-password use cases (e.g., email tokens)
 */
export function sha256Hash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * MIGRATION GUIDE FOR ADMIN PASSWORD HASHING
 * ============================================
 * 
 * Current state: Admin secret stored in plain text in ADMIN_SECRET env var
 * 
 * To implement password hashing:
 * 
 * 1. Add bcrypt to package.json:
 *    npm install bcrypt
 * 
 * 2. Create a setup script to hash the password:
 *    const bcrypt = require('bcrypt');
 *    const hashedPassword = await bcrypt.hash(process.env.ADMIN_SECRET, 10);
 *    // Store hashedPassword in database or env var ADMIN_PASSWORD_HASH
 * 
 * 3. Update src/routes/admin/login/+page.server.ts:
 *    import bcrypt from 'bcrypt';
 *    
 *    const password = form.get("password")?.toString();
 *    const storedHash = env.ADMIN_PASSWORD_HASH;
 *    
 *    if (password && await bcrypt.compare(password, storedHash)) {
 *      // Authentication successful
 *      cookies.set("mochi_admin", "authenticated", { ... });
 *    }
 * 
 * 4. Update src/hooks.server.ts:
 *    event.locals.admin = adminCookie === "authenticated";
 * 
 * SECURITY IMPROVEMENTS THIS WOULD PROVIDE:
 * - Password hashes instead of plain text
 * - Protection if environment variables are exposed
 * - Industry-standard bcrypt algorithm
 */

export const PASSWORD_MIGRATION_GUIDE = `
RECOMMENDED: Implement bcrypt password hashing

Current security issue:
- Admin password stored as plain text in ADMIN_SECRET
- If env vars are leaked, attacker has direct dashboard access

Recommended fix:
1. Install bcrypt: bun add bcrypt
2. Hash the password during setup
3. Store hash in ADMIN_PASSWORD_HASH env var
4. Update login to use bcrypt.compare()

This would make your application significantly more secure.
`;
