// Centralized test setup for backend tests
// Mocks common modules that require env vars or external services

// Mock supabase client
jest.mock('@/lib/supabase/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({ single: () => ({ data: null, error: null }) }),
      insert: () => ({ error: null }),
      update: () => ({ error: null }),
      delete: () => ({ error: null }),
      order: () => ({ data: [], error: null }),
    }),
  },
}));

// Mock jwt utils
jest.mock('@/utils/jwt.utils', () => ({
  signAccessToken: () => 'access-token',
  signRefreshToken: () => ({ refreshToken: 'refresh-token', refreshTokenHash: 'refresh-hash' }),
  hashToken: () => 'refresh-hash',
}));

// Provide a minimal auth config so modules that validate it don't throw
jest.mock('@/config/auth.config', () => ({
  authConfig: {
    jwt: { secret: 'a'.repeat(32), expiresIn: '24h' },
    rateLimiting: {
      general: { windowMs: 60000, max: 100 },
      auth: { windowMs: 60000, max: 10 },
      admin: { windowMs: 60000, max: 1000 },
    },
  },
}));
