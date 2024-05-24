export default {
  testEnvironment: 'jest-environment-jsdom', 
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};