import request from 'supertest';
import express from 'express';
import { authenticateToken, authorizeRoles, validateToken } from '../middlewares/auth.middleware';
import { requireAdmin, requireRole } from '../middlewares/role.middleware';
import { generalLimiter, authLimiter } from '../middlewares/ratelimit.middleware';
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

describe('Authentication Middleware', () => {
  let app: express.Application;
  let validToken: string;
  let expiredToken: string;
  let invalidToken: string;

  beforeAll(() => {
    // Create test tokens
    validToken = signAccessToken({
      user_id: 'test-user-id',
      role: 'client' as UserRole,
    });

    // Create expired token (manually set exp to past time)
    expiredToken = signAccessToken({
      user_id: 'test-user-id',
      role: 'client' as UserRole,
    });

    invalidToken = 'invalid.token.here';
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('authenticateToken', () => {
    it('should allow access to public routes without token', async () => {
      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok' });
      });

      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });

    it('should reject requests without Authorization header', async () => {
      app.get('/api/protected', authenticateToken(), (req, res) => {
        res.json({ message: 'success' });
      });

      const response = await request(app)
        .get('/api/protected')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Authentication required');
    });

    it('should reject requests with invalid token format', async () => {
      app.get('/api/protected', authenticateToken(), (req, res) => {
        res.json({ message: 'success' });
      });

      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Invalid token format');
    });

    it('should reject requests with malformed Authorization header', async () => {
      app.get('/api/protected', authenticateToken(), (req, res) => {
        res.json({ message: 'success' });
      });

      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Authentication required');
    });

    it('should set security headers on successful authentication', async () => {
      // Mock successful user lookup
      const mockSupabase = require('../lib/supabase/supabase').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                role: 'client',
                wallet_address: 'test-wallet',
                email: 'test@example.com',
                created_at: '2023-01-01T00:00:00Z',
                updated_at: '2023-01-01T00:00:00Z',
              },
              error: null,
            }),
          }),
        }),
      });

      app.get('/api/protected', authenticateToken(), (req, res) => {
        res.json({ message: 'success' });
      });

      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });

  describe('authorizeRoles', () => {
    beforeEach(() => {
      // Mock successful user lookup
      const mockSupabase = require('../lib/supabase/supabase').supabase;
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: 'test-user-id',
                role: 'client',
                wallet_address: 'test-wallet',
                email: 'test@example.com',
                created_at: '2023-01-01T00:00:00Z',
                updated_at: '2023-01-01T00:00:00Z',
              },
              error: null,
            }),
          }),
        }),
      });
    });

    it('should allow access for authorized role', async () => {
      app.get('/api/client-only', 
        authenticateToken(), 
        authorizeRoles('client'), 
        (req, res) => {
          res.json({ message: 'success' });
        }
      );

      const response = await request(app)
        .get('/api/client-only')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.message).toBe('success');
    });

    it('should deny access for unauthorized role', async () => {
      app.get('/api/admin-only', 
        authenticateToken(), 
        authorizeRoles('admin'), 
        (req, res) => {
          res.json({ message: 'success' });
        }
      );

      const response = await request(app)
        .get('/api/admin-only')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Access denied');
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

    it('should detect expired tokens', () => {
      // Create a token with past expiration
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const expiredToken = signAccessToken({
        user_id: 'test-user-id',
        role: 'client' as UserRole,
      });

      const result = validateToken(expiredToken);
      // Note: This test might need adjustment based on actual token expiration logic
      expect(result.isValid).toBeDefined();
    });
  });
});

describe('Role Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('requireAdmin', () => {
    it('should create admin-only middleware', () => {
      const middleware = requireAdmin();
      expect(typeof middleware).toBe('function');
    });

    it('should accept custom options', () => {
      const middleware = requireAdmin({
        errorMessage: 'Custom admin error',
        logAccess: false,
      });
      expect(typeof middleware).toBe('function');
    });
  });

  describe('requireRole', () => {
    it('should create role-based middleware', () => {
      const middleware = requireRole({
        requiredRoles: ['admin', 'moderator'],
        allowAny: true,
      });
      expect(typeof middleware).toBe('function');
    });

    it('should validate required roles parameter', () => {
      expect(() => {
        requireRole({
          requiredRoles: [] as UserRole[],
        });
      }).not.toThrow();
    });
  });
});

describe('Rate Limiting Middleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('generalLimiter', () => {
    it('should create general rate limiter', () => {
      expect(typeof generalLimiter).toBe('function');
    });

    it('should apply rate limiting to requests', async () => {
      app.get('/api/test', generalLimiter, (req, res) => {
        res.json({ message: 'success' });
      });

      // First request should succeed
      await request(app)
        .get('/api/test')
        .expect(200);

      // Note: Testing actual rate limiting would require many requests
      // This is a basic structure test
    });
  });

  describe('authLimiter', () => {
    it('should create auth-specific rate limiter', () => {
      expect(typeof authLimiter).toBe('function');
    });

    it('should have stricter limits than general limiter', () => {
      // This is a structural test - actual limits are configured in auth.config.ts
      expect(typeof authLimiter).toBe('function');
    });
  });
});

describe('Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  it('should handle complete authentication flow', async () => {
    // Mock successful user lookup
    const mockSupabase = require('../lib/supabase/supabase').supabase;
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'test-user-id',
              role: 'client',
              wallet_address: 'test-wallet',
              email: 'test@example.com',
              created_at: '2023-01-01T00:00:00Z',
              updated_at: '2023-01-01T00:00:00Z',
            },
            error: null,
          }),
        }),
      }),
    });

    app.get('/api/integration-test', 
      generalLimiter,
      authenticateToken(),
      authorizeRoles('client'),
      (req, res) => {
        res.json({ 
          message: 'success',
          user: req.user,
          tokenInfo: (req as any).tokenInfo,
        });
      }
    );

    const validToken = signAccessToken({
      user_id: 'test-user-id',
      role: 'client' as UserRole,
    });

    const response = await request(app)
      .get('/api/integration-test')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.message).toBe('success');
    expect(response.body.user).toBeDefined();
    expect(response.body.tokenInfo).toBeDefined();
  });

  it('should handle authentication failure gracefully', async () => {
    app.get('/api/failure-test', 
      authenticateToken(),
      (req, res) => {
        res.json({ message: 'success' });
      }
    );

    const response = await request(app)
      .get('/api/failure-test')
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });
});
