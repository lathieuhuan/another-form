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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': '@swc/jest',
  },
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
