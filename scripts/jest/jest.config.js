const jestDefaultConfig = {
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  rootDir: '.',
  roots: ['<rootDir>/src'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
};

const web = {
  ...jestDefaultConfig,
  displayName: 'web',
  setupFilesAfterEnv: ['<rootDir>/scripts/jest/jest.setup.ts'],
  testMatch: [
    '**/__tests__/**/*.(spec|test).ts?(x)',
    '**/__tests__/*.(spec|test).ts?(x)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'jsdom',
};

const getProjects = () => {
  return [web];
};

export default {
  collectCoverageFrom: [
    '**/**/*.{ts,tsx}',
    '!**/**/*.test.{ts,tsx}',
    '!**/src/types/**',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/__tests__/**',
  ],
  projects: getProjects(),
};
