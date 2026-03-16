const base = require('./jest.config.base');

module.exports = {
  ...base,
  testRegex: '.*\\.integration\\.spec\\.ts$',
  setupFiles: ['<rootDir>/src/test/setup/integration.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup/integration.setupAfterEnv.ts'],
};
