const { expect } = require('@playwright/test');

exports.MainPage = class MainPage {
  constructor(page) {
    this.page = page;
    this.signInLink = page.locator('a[href*="login"]');
    this.newArticleLink = page.locator('a[href*="editor"]');
  }

  async navigateTo() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSignIn() {
    await this.signInLink.click();
    await this.page.waitForURL(/.*login/);
  }

  async navigateToNewArticle() {
    await this.newArticleLink.click();
    await this.page.waitForURL(/.*editor/);
  }

  async navigateToProfile() {
    await this.page.goto('https://realworld.qa.guru/#/profile');
  }

  async navigateToHome() {
    await this.page.goto('https://realworld.qa.guru/');
  }

  async logout() {
    await this.page.goto('https://realworld.qa.guru/#/logout');
  }

  async checkArticleVisibility(articleTitle) {
    const articleLocator = this.page.locator('.article-preview h1', { hasText: articleTitle });
    return await articleLocator.isVisible();
  }

  async assertUserIsLoggedIn() {
    await expect(this.newArticleLink).toBeVisible();
  }
};