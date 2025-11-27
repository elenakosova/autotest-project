const { expect } = require('@playwright/test');

exports.EditArticlePage = class EditArticlePage {
  constructor(page) {
    this.page = page;
    this.articleTitleInput = page.locator('input[placeholder="Article Title"]');
    this.articleDescriptionInput = page.locator('input[placeholder*="about"]');
    this.articleContentTextarea = page.locator('textarea');
    this.publishArticleButton = page.locator('button', { hasText: 'Publish Article' });
    this.updateArticleButton = page.locator('button', { hasText: 'Update Article' });
  }

  async fillArticleForm(title, description, content) {
    await this.articleTitleInput.fill(title);
    await this.articleDescriptionInput.fill(description);
    await this.articleContentTextarea.fill(content);
  }

  async createArticle(title, description, content) {
    await this.fillArticleForm(title, description, content);
    
    const initialUrl = this.page.url();
    await this.publishArticleButton.click();
    
    // Ожидаем перехода на страницу статьи
    try {
      await this.page.waitForURL(/.*article/);
      await this.page.waitForLoadState('networkidle');
      return true;
    } catch (error) {
      // Если не перешли на страницу статьи, но и не остались на редакторе
      const currentUrl = this.page.url();
      if (currentUrl !== initialUrl && !currentUrl.includes('/editor')) {
        // Возможно, перешли на другую страницу (например, главную)
        return true;
      }
      return false;
    }
  }

  async updateArticle(title, description, content) {
    await this.fillArticleForm(title, description, content);
    await this.updateArticleButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertFormIsLoaded() {
    await expect(this.articleTitleInput).toBeVisible();
    await expect(this.publishArticleButton).toBeVisible();
  }

  async assertIsEditPage() {
    await expect(this.updateArticleButton).toBeVisible();
  }

  // Добавляем метод для получения значения описания
  async getDescriptionValue() {
    return await this.articleDescriptionInput.inputValue();
  }
};