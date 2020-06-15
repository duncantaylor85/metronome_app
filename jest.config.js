module.exports = {
  verbose: true,
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  moduleFileExtensions: ["js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.js$": "babel-jest",
  },
}