const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // Настройки для запуска в разных окружениях
  use: {
    baseURL: 'https://realworld.qa.guru',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Настройки репортеров
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }]
  ],

  // Проекты для разных типов тестов
  projects: [
    {
      name: 'api',
      use: { 
        baseURL: 'https://apichallenges.herokuapp.com'
      },
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