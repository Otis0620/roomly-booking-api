// Global setup for all tests
beforeAll(async () => {
  // This will be executed once before all test suites
  process.env.NODE_ENV = 'test';
});

afterAll(async () => {
  // Global teardown if needed
});
