module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '/src/lib/types/',
    '/src/lib/validators/',
    '/src/config/',
    '/src/migrations/',
    '/src/entities/',
    '/src/errors/',
    '/src/index.ts',
    '/src/test/',
    '/src/.*index\\.ts$',
    'typeorm.config.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@entities$': '<rootDir>/src/entities/index',

    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@repositories$': '<rootDir>/src/repositories/index',

    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@services$': '<rootDir>/src/services/index',

    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@controllers$': '<rootDir>/src/controllers/index',

    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@middleware$': '<rootDir>/src/middleware/index',

    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@config$': '<rootDir>/src/config/index',

    '^@lib/types/(.*)$': '<rootDir>/src/lib/types/$1',
    '^@lib/types$': '<rootDir>/src/lib/types/index',

    '^@errors/(.*)$': '<rootDir>/src/errors/$1',
    '^@errors$': '<rootDir>/src/errors/index',

    '^@lib/validators/(.*)$': '<rootDir>/src/lib/validators/$1',
    '^@lib/validators$': '<rootDir>/src/lib/validators/index',

    '^@lib/helpers/(.*)$': '<rootDir>/src/lib/helpers/$1',
    '^@lib/helpers$': '<rootDir>/src/lib/helpers/index',

    '^@lib/crypto/(.*)$': '<rootDir>/src/lib/crypto/$1',
    '^@lib/crypto$': '<rootDir>/src/lib/crypto/index',

    '^@lib/jwt/(.*)$': '<rootDir>/src/lib/jwt/$1',
    '^@lib/jwt$': '<rootDir>/src/lib/jwt/index',

    '^@dtos/(.*)$': '<rootDir>/src/dtos/$1',
    '^@dtos$': '<rootDir>/src/dtos/index',

    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@routes$': '<rootDir>/src/routes/index',
  },
};
