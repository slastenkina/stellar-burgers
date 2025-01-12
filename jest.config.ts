/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,

  coverageDirectory: 'coverage',

  coverageProvider: 'v8',

  preset: 'ts-jest',

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}]
  },
  moduleNameMapper: {
    '@api': '<rootDir>/src/utils/burger-api.ts',
    '@utils-types': '<rootDir>/src/utils/types/auth.ts'
  }
};

export default config;
