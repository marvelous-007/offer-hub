const request = require('supertest');
const express = require('express');

// Simulate stress test scenarios
const app = express();
app.use(express.json());

// Test with various edge cases
const testCases = [
  { method: 'GET', path: '/test', headers: {} },
  { method: 'POST', path: '/test', headers: { 'content-type': 'application/json' }, body: { test: 'data' } },
  { method: 'POST', path: '/test', headers: { 'content-type': 'text/plain' }, body: 'plain text' },
  { method: 'PUT', path: '/test', headers: { 'x-request-id': 'existing-id' }, body: { large: 'x'.repeat(10000) } },
  { method: 'DELETE', path: '/test', headers: { 'user-agent': 'test/1.0' } },
  { method: 'PATCH', path: '/test', headers: { 'authorization': 'Bearer token123' }, body: { password: 'secret' } },
];

console.log('Stress test cases prepared');
console.log('Test cases:', testCases.length);

module.exports = { testCases };