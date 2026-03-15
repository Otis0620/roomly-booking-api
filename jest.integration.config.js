const base = require('./jest.config.base');

module.exports = {
  ...base,
  testRegex: '.*\\.integration\\.spec\\.ts$',
  setupFilesAfterEnv: ['./src/test/setup/integration.setup.ts'],
};
