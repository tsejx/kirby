// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  verbose: true,
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.spec.json',
    },
  },
  automock: false,
  cacheDirectory: '<rootDir>/.jest',
  testMatch: ['<rootDir>/src/'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 74,
      functions: 66,
      lines: 87,
      statements: 87,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'ts'],
  testPathIgnorePatterns: ['/node_modules/', '/scripts/', '/dist/'],
  setupFiles: ['./tests/setup.js'],
};
