module.exports = {
  verbose: true,
  roots: ["<rootDir>/src/"],
  moduleFileExtensions: ["js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.js$": "babel-jest",
  },
}