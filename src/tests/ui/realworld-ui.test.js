const { test, expect } = require('@playwright/test');
const { MainPage } = require('../../pages/MainPage');
const { AuthPage } = require('../../pages/AuthPage');
const { EditArticlePage } = require('../../pages/EditArticlePage');
const { ArticlePage } = require('../../pages/ArticlePage');
const ArticleBuilder = require('../../builders/ArticleBuilder');

test.describe('UI Tests RealWorld - Page Objects', () => {
  let mainPage;
  let authPage;
  let editArticlePage;
  let articlePage;

  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    authPage = new AuthPage(page);
    editArticlePage = new EditArticlePage(page);
    articlePage = new ArticlePage(page);

    await mainPage.navigateTo();
    
    const needsLogin = await mainPage.signInLink.isVisible().catch(() => true);
    
    if (needsLogin) {
      await mainPage.navigateToSignIn();
      
      const email = process.env.TEST_USER_EMAIL;
      const password = process.env.TEST_USER_PASSWORD;
      
      if (!email || !password) {
        test.skip(true, 'Требуются тестовые учетные данные');
      }
      
      await authPage.login(email, password);
    }
    
    await mainPage.assertUserIsLoggedIn();
  });

  test('Создание новой статьи', async ({ page }) => {
    const testArticle = ArticleBuilder.createDefault();
    
    await mainPage.navigateToNewArticle();
    await editArticlePage.assertFormIsLoaded();

    await editArticlePage.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    // Вместо проверки возвращаемого значения, проверяем что статья загрузилась
    await articlePage.assertArticleIsLoaded();
    
    const actualTitle = await articlePage.getArticleTitle();
    expect(actualTitle).toBe(testArticle.title);
  });

  test('Редактирование статьи', async ({ page }) => {
    const originalArticle = ArticleBuilder.createDefault();
    await mainPage.navigateToNewArticle();
    await editArticlePage.createArticle(
      originalArticle.title,
      originalArticle.description,
      originalArticle.content
    );

    await articlePage.editArticle();
    await editArticlePage.assertIsEditPage();
    
    const updatedArticle = ArticleBuilder.createDefault();
    await editArticlePage.updateArticle(
      updatedArticle.title,
      updatedArticle.description,
      updatedArticle.content
    );

    await articlePage.assertArticleIsLoaded();
    const actualTitle = await articlePage.getArticleTitle();
    expect(actualTitle).toBe(updatedArticle.title);
  });

  test('Удаление статьи', async ({ page }) => {
    const testArticle = ArticleBuilder.createDefault();
    await mainPage.navigateToNewArticle();
    await editArticlePage.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    const articleTitle = await articlePage.getArticleTitle();
    await articlePage.deleteArticle();

    await mainPage.navigateToHome();
    const articleVisible = await mainPage.checkArticleVisibility(articleTitle);
    expect(articleVisible).toBe(false);
  });

  test('Добавление комментария к статье', async ({ page }) => {
    const testArticle = ArticleBuilder.createDefault();
    await mainPage.navigateToNewArticle();
    await editArticlePage.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    const testComment = `Тестовый комментарий ${Date.now()}`;
    await articlePage.addComment(testComment);

    await articlePage.assertCommentIsAdded(testComment);
    const commentsCount = await articlePage.getCommentsCount();
    expect(commentsCount).toBeGreaterThan(0);
  });

  test('Создание статьи с Markdown', async ({ page }) => {
    const testArticle = ArticleBuilder.createWithMarkdown();
    
    await mainPage.navigateToNewArticle();
    await editArticlePage.createArticle(
      testArticle.title,
      testArticle.description,
      testArticle.content
    );

    await articlePage.assertArticleIsLoaded();
    const actualTitle = await articlePage.getArticleTitle();
    expect(actualTitle).toBe(testArticle.title);
  });

  test.afterEach(async () => {
    await mainPage.logout();
  });
});