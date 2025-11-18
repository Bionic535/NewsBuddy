import { test, expect, beforeEach } from 'vitest';
import { validateEventFrame, isDev } from './util.js';
import type { WebFrameMain } from 'electron';

const originalNodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

// Tests for validateEventFrame function
test('validateEventFrame in development allows valid localhost URLs', () => {
  process.env.NODE_ENV = 'development';
  const validFrame = { url: 'http://localhost:5173' } as WebFrameMain;
  expect(() => validateEventFrame(validFrame)).not.toThrow();
});

test('validateEventFrame in development throws for invalid URLs', () => {
  process.env.NODE_ENV = 'development';
  const invalidFrame = { url: 'http://malicious.com' } as WebFrameMain;
  expect(() => validateEventFrame(invalidFrame)).toThrow('Invalid frame URL: http://malicious.com');
});

test('validateEventFrame in production allows valid file URLs', () => {
  process.env.NODE_ENV = 'production';
  const validFrame = { url: 'file:///path/to/app.asar/dist-react/index.html' } as WebFrameMain;
  expect(() => validateEventFrame(validFrame)).not.toThrow();
});

test('validateEventFrame in production throws for invalid URLs', () => {
  process.env.NODE_ENV = 'production';
  const invalidFrame = { url: 'http://localhost:5173' } as WebFrameMain;
  expect(() => validateEventFrame(invalidFrame)).toThrow('Invalid frame URL: http://localhost:5173');
});

//tests for isDev function
test('isDev returns true in development mode', () => {
  process.env.NODE_ENV = 'development';
  expect(isDev()).toBe(true);
});


