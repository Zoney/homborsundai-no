const nextJest = require('next/jest');

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    // Add other aliases here if needed
  },
  // If using TypeScript with a baseUrl set to the root directory, you need the below for alias support
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // Handle CSS imports (if you import CSS files directly in your components)
  // '^.+\.module\.(css|sass|scss)$': 'identity-obj-proxy', // For CSS Modules
  // '^.+\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js', // For global CSS
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
