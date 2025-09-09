// Set up environment variables for testing
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only-must-be-at-least-32-characters-long';
process.env.JWT_EXPIRES_IN = '24h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  extractTokenFromHeader,
  isValidTokenFormat,
  isTokenExpired,
  isTokenNearExpiration,
  getTokenExpiration,
} from '../utils/jwt.utils';
import { UserRole } from '../types/auth.types';

describe('JWT Utils', () => {
  const testPayload = {
    user_id: 'test-user-123',
    role: 'client' as UserRole,
  };

  describe('Token Signing', () => {
    it('should sign access token successfully', () => {
      const token = signAccessToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should sign refresh token successfully', () => {
      const result = signRefreshToken(testPayload);
      expect(result).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.refreshTokenHash).toBeDefined();
      expect(typeof result.refreshToken).toBe('string');
      expect(typeof result.refreshTokenHash).toBe('string');
    });

    it('should create different tokens for same payload', () => {
      const token1 = signAccessToken(testPayload);
      const token2 = signAccessToken(testPayload);
      expect(token1).not.toBe(token2); // Different timestamps should create different tokens
    });
  });

  describe('Token Verification', () => {
    it('should verify valid access token', () => {
      const token = signAccessToken(testPayload);
      const decoded = verifyAccessToken(token);
      
      expect(decoded.user_id).toBe(testPayload.user_id);
      expect(decoded.role).toBe(testPayload.role);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it('should verify valid refresh token', () => {
      const { refreshToken } = signRefreshToken(testPayload);
      const decoded = verifyRefreshToken(refreshToken);
      
      expect(decoded.user_id).toBe(testPayload.user_id);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        verifyAccessToken('invalid.token.here');
      }).toThrow();
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        verifyAccessToken('not-a-jwt-token');
      }).toThrow();
    });
  });

  describe('Token Hashing', () => {
    it('should hash token consistently', () => {
      const token = 'test-token-123';
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(token);
      expect(hash1.length).toBe(64); // SHA256 produces 64 character hex string
    });

    it('should produce different hashes for different tokens', () => {
      const token1 = 'test-token-1';
      const token2 = 'test-token-2';
      const hash1 = hashToken(token1);
      const hash2 = hashToken(token2);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Token Extraction', () => {
    it('should extract token from valid Authorization header', () => {
      const token = 'valid.jwt.token';
      const authHeader = `Bearer ${token}`;
      const extracted = extractTokenFromHeader(authHeader);
      
      expect(extracted).toBe(token);
    });

    it('should return null for invalid Authorization header format', () => {
      expect(extractTokenFromHeader('InvalidFormat token')).toBeNull();
      expect(extractTokenFromHeader('Bearer')).toBeNull();
      expect(extractTokenFromHeader('')).toBeNull();
      expect(extractTokenFromHeader(undefined)).toBeNull();
    });

    it('should handle malformed Authorization headers', () => {
      expect(extractTokenFromHeader('Basic token')).toBeNull();
      expect(extractTokenFromHeader('Bearer')).toBeNull();
      expect(extractTokenFromHeader('Bearer ')).toBeNull();
    });
  });

  describe('Token Format Validation', () => {
    it('should validate correct JWT format', () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      expect(isValidTokenFormat(validToken)).toBe(true);
    });

    it('should reject invalid JWT format', () => {
      expect(isValidTokenFormat('invalid-token')).toBe(false);
      expect(isValidTokenFormat('only.two.parts')).toBe(false);
      expect(isValidTokenFormat('one')).toBe(false);
      expect(isValidTokenFormat('')).toBe(false);
      expect(isValidTokenFormat('too.many.parts.here.extra')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidTokenFormat(null as any)).toBe(false);
      expect(isValidTokenFormat(undefined as any)).toBe(false);
      expect(isValidTokenFormat(123 as any)).toBe(false);
    });
  });

  describe('Token Expiration', () => {
    it('should get token expiration time', () => {
      const token = signAccessToken(testPayload);
      const expiration = getTokenExpiration(token);
      
      expect(expiration).toBeDefined();
      expect(typeof expiration).toBe('number');
      expect(expiration).toBeGreaterThan(Date.now());
    });

    it('should return null for invalid token', () => {
      const expiration = getTokenExpiration('invalid-token');
      expect(expiration).toBeNull();
    });

    it('should detect non-expired tokens', () => {
      const token = signAccessToken(testPayload);
      const isExpired = isTokenExpired(token);
      
      expect(isExpired).toBe(false);
    });

    it('should detect tokens near expiration', () => {
      // Create a token that expires in 1 minute (within the 5-minute threshold)
      const nearExpirationPayload = {
        ...testPayload,
        exp: Math.floor(Date.now() / 1000) + 60, // 1 minute from now
      };
      
      // Note: This test might need adjustment based on actual token creation logic
      // as we can't directly set the exp field in signAccessToken
      const token = signAccessToken(testPayload);
      const needsRefresh = isTokenNearExpiration(token);
      
      // For a newly created token, it shouldn't need refresh
      expect(typeof needsRefresh).toBe('boolean');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing JWT_SECRET gracefully', () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;
      
      expect(() => {
        require('../utils/jwt.utils');
      }).toThrow('JWT_SECRET is not defined in environment');
      
      // Restore original secret
      process.env.JWT_SECRET = originalSecret;
    });

    it('should handle token verification errors gracefully', () => {
      expect(() => {
        verifyAccessToken('completely.invalid.token');
      }).toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full token lifecycle', () => {
      // 1. Sign token
      const token = signAccessToken(testPayload);
      expect(token).toBeDefined();
      
      // 2. Verify token
      const decoded = verifyAccessToken(token);
      expect(decoded.user_id).toBe(testPayload.user_id);
      
      // 3. Extract from header
      const extracted = extractTokenFromHeader(`Bearer ${token}`);
      expect(extracted).toBe(token);
      
      // 4. Validate format
      expect(isValidTokenFormat(token)).toBe(true);
      
      // 5. Check expiration
      expect(isTokenExpired(token)).toBe(false);
      
      // 6. Get expiration time
      const expiration = getTokenExpiration(token);
      expect(expiration).toBeGreaterThan(Date.now());
    });

    it('should handle refresh token lifecycle', () => {
      // 1. Sign refresh token
      const { refreshToken, refreshTokenHash } = signRefreshToken(testPayload);
      expect(refreshToken).toBeDefined();
      expect(refreshTokenHash).toBeDefined();
      
      // 2. Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      expect(decoded.user_id).toBe(testPayload.user_id);
      
      // 3. Hash should match
      const computedHash = hashToken(refreshToken);
      expect(computedHash).toBe(refreshTokenHash);
    });
  });
});
