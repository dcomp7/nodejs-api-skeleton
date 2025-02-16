module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/tests/**/*.test.js"],
  transform: { "\\.(js|jsx|ts|tsx)$": "@sucrase/jest-plugin" },
  setupFiles: ["<rootDir>/jest.setup.js"],
};
