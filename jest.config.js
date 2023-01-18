module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.ts'],
  coverageReporters: ['lcov', 'text-summary'],
  restoreMocks: true,
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    }
  },
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/lib']
};
