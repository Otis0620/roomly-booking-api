const base = require('./jest.config.base');

module.exports = {
  ...base,
  testRegex: '^(?!.*\\.integration\\.spec\\.ts$).*\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup/unit.setup.ts'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/infrastructure/',
    '/src/migrations/',
    '/src/entities/',
    '/src/validators/',
    '/src/test/',
    '/src/config/',
    '/src/routes/',
    '/src/app.ts',
    '/src/index.ts',
    '/src/lib/types/express.d.ts',
  ],
};
