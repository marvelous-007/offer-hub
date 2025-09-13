const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock user data
const mockUser = {
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'client'
};

// Generate a valid JWT token
const token = jwt.sign(
  {
    user_id: mockUser.id,
    email: mockUser.email,
    role: mockUser.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  },
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  { algorithm: 'HS256' }
);

console.log('Generated JWT Token:');
console.log(token);
console.log('\nDecoded payload:');
console.log(JSON.stringify(jwt.decode(token), null, 2));
