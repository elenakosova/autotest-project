const { expect } = require('@playwright/test');

exports.ArticlePage = class ArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitle = page.locator('.banner h1');
    this.articleContent = page.locator('.article-content');
    this.editArticleButton = page.locator('a:has-text("Edit Article")').first();
    this.deleteArticleButton = page.locator('button:has-text("Delete Article")').first();
    this.commentInput = page.locator('textarea[placeholder="Write a comment..."]');
    this.postCommentButton = page.locator('button', { hasText: 'Post Comment' });
    this.commentList = page.locator('.card');
  }

  async getArticleTitle() {
    return await this.articleTitle.textContent();
  }

  async getArticleContent() {
    return await this.articleContent.textContent();
  }

  async editArticle() {
    await this.editArticleButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteArticle() {
    await this.deleteArticleButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addComment(commentText) {
    await this.commentInput.fill(commentText);
    await this.postCommentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getCommentsCount() {
    return await this.commentList.count();
  }

  async assertArticleIsLoaded() {
    await expect(this.articleTitle).toBeVisible();
    await expect(this.articleContent).toBeVisible();
  }

  async assertCanEditArticle() {
    await expect(this.editArticleButton).toBeVisible();
  }

  async assertCommentIsAdded(commentText) {
    const commentLocator = this.page.locator('.card-text', { hasText: commentText });
    await expect(commentLocator).toBeVisible();
  }
};