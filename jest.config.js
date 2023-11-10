module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/__tests__/helpers.ts",
    "<rootDir>/__tests__/common_helpers.ts",
  ],
};
