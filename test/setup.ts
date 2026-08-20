/**
 * Test setup file - runs before each test suite
 */

// Mock environment variables for tests
Object.assign(process.env, {
  DATABASE_URL: "postgres://test:test@localhost:5432/test",
  SESSION_SECRET: "test-secret-at-least-32-characters-long",
  STORAGE_DIR: "./test-storage",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NODE_ENV: "test",
});
