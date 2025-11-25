const { test: base, expect } = require('@playwright/test'); // ✅ Добавляем expect
const ApiService = require('../services/api.service');

const test = base.extend({
    api: async ({ request }, use, testInfo) => {
        const baseURL = testInfo.project.use.baseURL;
        const api = new ApiService(request, baseURL);
        await use(api);
    },
});

module.exports = { test, expect };