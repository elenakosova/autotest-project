const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }]
  ],

  use: {
    baseURL: 'https://apichallenges.herokuapp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.test.js'
    },
    {
      name: 'ui', 
      use: { 
        baseURL: 'https://realworld.qa.guru'
      },
      testMatch: '**/ui/**/*.test.js'
    },
  ],
});