const { test, expect } = require('../../fixtures/ui.fixture');
const ArticleBuilder = require('../../builders/ArticleBuilder');

test.describe('UI Tests RealWorld - Page Objects', () => {
  test.beforeEach(async ({ page, app }) => {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    
    if (!email || !password) {
      throw new Error('Требуются тестовые учетные данные TEST_USER_EMAIL и TEST_USER_PASSWORD в .env файле');
    }

    await app.main.navigateTo();
    
    const needsLogin = await app.main.signInLink.isVisible().catch(() => true);
    
    if (needsLogin) {
      await app.main.navigateToSignIn();
      await app.auth.login(email, password);
    }
    
    await app.main.assertUserIsLoggedIn();
  });

  test('Создание новой статьи', async ({ app }) => {
    // Arrange
    const testArticle = ArticleBuilder.createDefault();
    
    // Act
    await app.main.navigateToNewArticle();
    await app.editArticle.assertFormIsLoaded();
    await app.editArticle.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    // Assert - проверяем только title и content
    await app.article.assertArticleIsLoaded();
    const actualTitle = await app.article.getArticleTitle();
    const actualContent = await app.article.getArticleContent();

    expect(actualTitle).toBe(testArticle.title);
    expect(actualContent).toContain(testArticle.content);
  });

  test('Редактирование статьи', async ({ app }) => {
    // Arrange
    const originalArticle = ArticleBuilder.createDefault();
    await app.main.navigateToNewArticle();
    await app.editArticle.createArticle(
      originalArticle.title,
      originalArticle.description,
      originalArticle.content
    );

    // Act
    await app.article.editArticle();
    await app.editArticle.assertIsEditPage();
    
    const updatedArticle = ArticleBuilder.createDefault();
    await app.editArticle.updateArticle(
      updatedArticle.title,
      updatedArticle.description,
      updatedArticle.content
    );

    // Assert - проверяем только title и content
    await app.article.assertArticleIsLoaded();
    const actualTitle = await app.article.getArticleTitle();
    const actualContent = await app.article.getArticleContent();

    expect(actualTitle).toBe(updatedArticle.title);
    expect(actualContent).toContain(updatedArticle.content);
  });

  test('Удаление статьи', async ({ app }) => {
    // Arrange
    const testArticle = ArticleBuilder.createDefault();
    await app.main.navigateToNewArticle();
    await app.editArticle.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    const articleTitle = await app.article.getArticleTitle();
    
    // Act
    await app.article.deleteArticle();

    // Assert
    await app.main.navigateToHome();
    const articleVisible = await app.main.checkArticleVisibility(articleTitle);
    expect(articleVisible).toBe(false);
  });

  test('Добавление комментария к статье', async ({ app }) => {
    // Arrange
    const testArticle = ArticleBuilder.createDefault();
    await app.main.navigateToNewArticle();
    await app.editArticle.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    const testComment = `Тестовый комментарий ${Date.now()}`;
    
    // Act
    await app.article.addComment(testComment);

    // Assert
    await app.article.assertCommentIsAdded(testComment);
    const commentsCount = await app.article.getCommentsCount();
    expect(commentsCount).toBeGreaterThan(0);
  });

  test('Создание статьи с Markdown', async ({ app }) => {
    // Arrange
    const testArticle = ArticleBuilder.createWithMarkdown();
    
    // Act
    await app.main.navigateToNewArticle();
    await app.editArticle.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    // Assert - проверяем только title и content
    await app.article.assertArticleIsLoaded();
    const actualTitle = await app.article.getArticleTitle();
    const actualContent = await app.article.getArticleContent();

    expect(actualTitle).toBe(testArticle.title);
    expect(actualContent).toContain(testArticle.content);
  });

  test.afterEach(async ({ app }) => {
    await app.main.logout();
  });
});