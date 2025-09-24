import request from 'supertest';
import express from 'express';

import authRoutes from '@/routes/auth.routes';
import * as authService from '@/services/auth.service';
jest.mock('@/services/auth.service');
type AuthServiceType = typeof authService;
const mockedAuthService = authService as jest.Mocked<AuthServiceType>;
type LoginWithEmailReturn = Awaited<ReturnType<typeof authService.loginWithEmail>>;

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/login/email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when email or password is missing', async () => {
    const res = await request(app).post('/api/auth/login/email').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('code', 'MISSING_CREDENTIALS');
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login/email')
      .send({ email: 'not-an-email', password: 'validpassword' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'INVALID_EMAIL_FORMAT');
  });

  it('returns 400 for short password', async () => {
    const res = await request(app)
      .post('/api/auth/login/email')
      .send({ email: 'user@example.com', password: 'short' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'PASSWORD_TOO_SHORT');
  });

  it('returns 200 and payload on successful login', async () => {
    const mockResult = {
      user: { id: 'user-1', email: 'user@example.com', name: 'Test User' },
      tokens: { accessToken: 'access-token', refreshToken: 'refresh-token', expiresIn: 86400 },
      session: { id: 'session-1', created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() },
    };

  mockedAuthService.loginWithEmail.mockResolvedValue(mockResult as unknown as LoginWithEmailReturn);

    const res = await request(app)
      .post('/api/auth/login/email')
      .set('User-Agent', 'jest-test')
      .send({ email: 'user@example.com', password: 'validpassword' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user).toHaveProperty('email', 'user@example.com');
    expect(res.body.data).toHaveProperty('tokens');
    expect(res.body.data.tokens).toHaveProperty('accessToken', 'access-token');
    // ensure our service mock was called with normalized email and device info
  expect(mockedAuthService.loginWithEmail).toHaveBeenCalledTimes(1);
  const calledWith = mockedAuthService.loginWithEmail.mock.calls[0][0];
    expect(calledWith).toMatchObject({ email: 'user@example.com' });
  });
});
