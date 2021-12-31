module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules'],
  passWithNoTests: true,
  detectOpenHandles: true,
  verbose: true
};