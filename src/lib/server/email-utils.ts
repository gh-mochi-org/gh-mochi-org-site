import { createHmac, randomBytes } from 'crypto';
import { ADMIN_SECRET } from '$env/static/private';

/**
 * Generate a secure token for unsubscribe/verification links
 * Uses HMAC-SHA256 to create tamper-proof tokens
 */
export function generateEmailToken(email: string): string {
  const timestamp = Date.now().toString();
  const randomPart = randomBytes(16).toString('hex');
  
  // Create HMAC signature
  const hmac = createHmac('sha256', ADMIN_SECRET || 'fallback-secret');
  hmac.update(`${email}:${timestamp}:${randomPart}`);
  const signature = hmac.digest('hex');
  
  // Combine into token: email:timestamp:random:signature (base64 encoded for URL safety)
  const token = `${email}:${timestamp}:${randomPart}:${signature}`;
  return Buffer.from(token).toString('base64');
}

/**
 * Verify an email token
 * Returns the email if valid, null if tampered or expired
 */
export function verifyEmailToken(token: string, maxAgeMs: number = 30 * 24 * 60 * 60 * 1000): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, timestamp, randomPart, signature] = decoded.split(':');
    
    if (!email || !timestamp || !randomPart || !signature) {
      return null;
    }
    
    // Check expiration (default 30 days)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > maxAgeMs) {
      return null;
    }
    
    // Verify HMAC signature
    const hmac = createHmac('sha256', ADMIN_SECRET || 'fallback-secret');
    hmac.update(`${email}:${timestamp}:${randomPart}`);
    const expectedSignature = hmac.digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    return email;
  } catch {
    return null;
  }
}

/**
 * Validate email format using RFC 5322 simplified regex
 * This is more comprehensive than basic validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Basic checks
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return false;
  }
  
  // Split email into local and domain parts
  const [localPart, ...domainParts] = email.split('@');
  const domain = domainParts.join('@');
  
  // Local part checks
  if (localPart.length > 64 || localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  // Check for consecutive dots
  if (email.includes('..')) {
    return false;
  }
  
  // Domain must not start or end with hyphen
  if (domain.startsWith('-') || domain.endsWith('-')) {
    return false;
  }
  
  return true;
}

/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}
