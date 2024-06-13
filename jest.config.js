const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: './test.environment.js',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'deepdash-es': '<rootDir>/global.mock.js', // deepdash-es is mocked because jest is not able to resolve the module. (see - https://github.com/YuriGor/deepdash/issues/133),
    '@apache-arrow/es2015-esm': '<rootDir>/global.mock.js',
    morphoviewer: '<rootDir>/global.mock.js',
    d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
    '^d3-(.*)$': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js',
  },
  testPathIgnorePatterns: ['__tests__/__utils__', '__tests__/__server__/*'],
  setupFiles: ['./global.mock.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Provides utilities for expectations like "toBeInTheDocument"/,
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  testTimeout: 10_000, // Default is 5000 ms which is a bit low for our ci (MemoryRequest - 4Gi, MemoryLimit - 8Gi),
  showSeed: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
