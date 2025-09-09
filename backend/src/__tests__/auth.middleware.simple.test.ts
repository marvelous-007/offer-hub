// Set up environment variables for testing
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only-must-be-at-least-32-characters-long';
process.env.JWT_EXPIRES_IN = '24h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

import { authenticateToken, authorizeRoles, validateToken } from '../middlewares/auth.middleware';
import { requireAdmin, requireRole } from '../middlewares/role.middleware';
import { signAccessToken } from '../utils/jwt.utils';
import { UserRole } from '../types/auth.types';

// Mock Supabase
jest.mock('../lib/supabase/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Authentication Middleware - Simple Tests', () => {
  let validToken: string;

  beforeAll(() => {
    // Create test token
    validToken = signAccessToken({
      user_id: 'test-user-id',
      role: 'client' as UserRole,
    });
  });

  describe('validateToken utility', () => {
    it('should validate correct token format', () => {
      const result = validateToken(validToken);
      expect(result.isValid).toBe(true);
      expect(result.isExpired).toBe(false);
      expect(result.payload).toBeDefined();
    });

    it('should reject invalid token format', () => {
      const result = validateToken('invalid-token');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid token format');
    });
  });

  describe('Role Middleware', () => {
    it('should create admin-only middleware', () => {
      const middleware = requireAdmin();
      expect(typeof middleware).toBe('function');
    });

    it('should create role-based middleware', () => {
      const middleware = requireRole({
        requiredRoles: ['admin', 'moderator'],
        allowAny: true,
      });
      expect(typeof middleware).toBe('function');
    });
  });

  describe('Token Creation', () => {
    it('should create valid access token', () => {
      const token = signAccessToken({
        user_id: 'test-user-123',
        role: 'client' as UserRole,
      });
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });
});
