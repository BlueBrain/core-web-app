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
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'deepdash-es': '<rootDir>/global.mock.js', // deepdash-es is mocked because jest is not able to resolve the module. (see - https://github.com/YuriGor/deepdash/issues/133)
  },
  testPathIgnorePatterns: ['__tests__/__utils__'],
  setupFiles: ['./global.mock.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Provides utilities for expectations like "toBeInTheDocument"/,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
