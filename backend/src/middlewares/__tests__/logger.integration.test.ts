import request from 'supertest';
import express from 'express';
import { loggerMiddleware } from '../logger.middleware';
import fs from 'fs';
import path from 'path';

describe('Logger Middleware Integration Tests', () => {
  let app: express.Application;
  
  beforeEach(() => {
    app = express();
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(loggerMiddleware);
    
    // Test routes with different scenarios
    app.get('/test', (req, res) => {
      res.json({ message: 'success' });
    });
    
    app.post('/auth/login', (req, res) => {
      // Simulate user authentication
      (req as any).user = { id: 'user-123', name: 'Test User' };
      res.json({ token: 'jwt-token-123', user: { id: 'user-123' } });
    });
    
    app.get('/protected', (req, res) => {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      (req as any).user = { id: 'user-456' };
      res.json({ data: 'protected data' });
    });
    
    app.post('/upload', (req, res) => {
      res.json({ uploaded: true, size: JSON.stringify(req.body).length });
    });
    
    app.get('/slow', (req, res) => {
      setTimeout(() => {
        res.json({ message: 'slow response' });
      }, 100);
    });
  });

  it('should handle concurrent requests without interference', async () => {
    const promises = Array.from({ length: 10 }, (_, i) => 
      request(app)
        .get(`/test?id=${i}`)
        .set('x-request-id', `req-${i}`)
    );
    
    const results = await Promise.all(promises);
    
    results.forEach((result, i) => {
      expect(result.status).toBe(200);
      expect(result.headers['x-request-id']).toBe(`req-${i}`);
    });
  });

  it('should handle large request bodies', async () => {
    const largeBody = {
      data: 'x'.repeat(100000), // 100KB
      metadata: { type: 'large', size: 100000 }
    };
    
    const response = await request(app)
      .post('/upload')
      .send(largeBody)
      .expect(200);
      
    expect(response.headers['x-request-id']).toBeDefined();
  });

  it('should handle requests with special characters', async () => {
    const specialData = {
      emoji: '🚀💼🌐',
      unicode: 'café naïve résumé',
      symbols: '!@#$%^&*()_+-={}[]|\\:";\'<>?,./',
      password: 'secret123' // Should be sanitized
    };
    
    await request(app)
      .post('/upload')
      .send(specialData)
      .expect(200);
  });

  it('should maintain request ID across middleware chain', async () => {
    const testId = 'chain-test-123';
    
    const response = await request(app)
      .post('/auth/login')
      .set('x-request-id', testId)
      .send({ username: 'test', password: 'secret' })
      .expect(200);
      
    expect(response.headers['x-request-id']).toBe(testId);
  });

  it('should handle mixed content types', async () => {
    // Test JSON
    await request(app)
      .post('/upload')
      .set('content-type', 'application/json')
      .send({ type: 'json' })
      .expect(200);
      
    // Test URL encoded
    await request(app)
      .post('/upload')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send('type=urlencoded&data=test')
      .expect(200);
  });

  it('should handle authentication flow', async () => {
    // Test without auth
    await request(app)
      .get('/protected')
      .expect(401);
      
    // Test with auth
    await request(app)
      .get('/protected')
      .set('authorization', 'Bearer valid-token')
      .expect(200);
  });

  it('should handle slow responses', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/slow')
      .expect(200);
      
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThan(90); // Should be at least 100ms
  });

  it('should create log files in logs directory', (done) => {
    const logPath = path.join(process.cwd(), 'logs', 'app.log');
    
    request(app)
      .get('/test')
      .expect(200)
      .end(() => {
        // Give Winston time to write to file
        setTimeout(() => {
          expect(fs.existsSync(logPath)).toBe(true);
          done();
        }, 100);
      });
  });
});