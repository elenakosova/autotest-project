const { test: base, expect } = require('@playwright/test'); // ✅ Добавляем expect
const { MainPage } = require('../pages/MainPage');
const { AuthPage } = require('../pages/AuthPage');
const { EditArticlePage } = require('../pages/EditArticlePage');
const { ArticlePage } = require('../pages/ArticlePage');

const test = base.extend({
    app: async ({ page }, use) => {
        const app = {
            main: new MainPage(page),
            auth: new AuthPage(page),
            editArticle: new EditArticlePage(page),
            article: new ArticlePage(page),
        };
        await use(app);
    },
});

module.exports = { test, expect };