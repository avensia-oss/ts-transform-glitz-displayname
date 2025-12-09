module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.json",
      "isolatedModules": true
    }
  },
  "testRegex": "test\\.ts$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}