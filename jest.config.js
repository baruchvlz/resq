module.exports = {
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testPathIgnorePatterns: [
    "node_modules",
    "dist"
  ],
  coverageThreshold: {
    "global": {
      "branches": 97,
      "functions": 100,
      "lines": 100,
      "statements": 100
    }
  }
};
