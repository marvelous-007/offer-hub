import request from 'supertest';
import express from 'express';
import { loggerMiddleware } from '../logger.middleware';

describe('Logger Middleware', () => {
  let app: express.Application;
  
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(loggerMiddleware);
    
    // Test routes
    app.get('/test', (req, res) => {
      res.json({ message: 'success' });
    });
    
    app.post('/test', (req, res) => {
      res.json({ received: req.body });
    });
    
    app.get('/error', (req, res) => {
      res.status(500).json({ error: 'server error' });
    });
    
    app.get('/not-found', (req, res) => {
      res.status(404).json({ error: 'not found' });
    });
  });

  it('should set request ID header in response', async () => {
    const response = await request(app)
      .get('/test')
      .expect(200);
      
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.headers['x-request-id']).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('should preserve custom request ID', async () => {
    const customId = 'custom-test-id-123';
    
    const response = await request(app)
      .get('/test')
      .set('x-request-id', customId)
      .expect(200);
      
    expect(response.headers['x-request-id']).toBe(customId);
  });

  it('should handle POST requests with body', async () => {
    const testData = { name: 'test', value: 123 };
    
    const response = await request(app)
      .post('/test')
      .send(testData)
      .expect(200);
      
    expect(response.body.received).toEqual(testData);
    expect(response.headers['x-request-id']).toBeDefined();
  });

  it('should handle server errors', async () => {
    await request(app)
      .get('/error')
      .expect(500);
  });

  it('should handle client errors', async () => {
    await request(app)
      .get('/not-found')
      .expect(404);
  });

  it('should handle requests with sensitive data', async () => {
    const sensitiveData = {
      username: 'testuser',
      password: 'secret123',
      token: 'sensitive-token',
      data: { nested: 'value' }
    };
    
    const response = await request(app)
      .post('/test')
      .send(sensitiveData)
      .expect(200);
      
    expect(response.headers['x-request-id']).toBeDefined();
  });
});