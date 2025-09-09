const express = require('express');
const cors = require('cors');

// Set environment variables
process.env.JWT_SECRET = 'your-super-secret-jwt-key-that-is-at-least-32-characters-long-for-security';
process.env.JWT_EXPIRES_IN = '24h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.PORT = '4000';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Import our authentication middleware
const { authenticateToken, authorizeRoles } = require('./dist/middlewares/auth.middleware');
const { generalLimiter, authLimiter } = require('./dist/middlewares/ratelimit.middleware');

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: '💼 OFFER-HUB backend is up and running!',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Public route (no authentication required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Protected route (authentication required)
app.get('/api/protected', authenticateToken(), (req, res) => {
  res.json({ 
    message: 'Access granted to protected route',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Admin only route
app.get('/api/admin', authenticateToken(), authorizeRoles('admin'), (req, res) => {
  res.json({ 
    message: 'Admin access granted',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Test authentication endpoint
app.post('/api/test-auth', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'No token provided'
      }
    });
  }

  // This would normally validate the token
  res.json({
    success: true,
    message: 'Token received (validation would happen here)',
    token: token.substring(0, 20) + '...'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 OFFER-HUB test server is live at http://localhost:${port}`);
  console.log('🌐 Testing authentication middleware...');
  console.log('📋 Available endpoints:');
  console.log('  GET  / - Health check');
  console.log('  GET  /api/health - Public health endpoint');
  console.log('  GET  /api/protected - Protected endpoint (requires auth)');
  console.log('  GET  /api/admin - Admin endpoint (requires admin role)');
  console.log('  POST /api/test-auth - Test authentication');
});
