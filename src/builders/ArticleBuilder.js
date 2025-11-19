class ArticleBuilder {
  constructor() {
    this.article = {
      title: '',
      description: '',
      content: '',
      tags: []
    };
    this.reset();
  }

  /**
   * Сброс к базовым значениям
   */
  reset() {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15); // Добавляем случайную строку
    this.article = {
      title: `Test Article ${timestamp} ${randomId}`,
      description: `This is a test article description ${timestamp}`,
      content: `This is the content of test article ${timestamp}. Created by automated tests.`,
      tags: ['test', 'automation']
    };
    return this;
  }

  /**
   * Установка заголовка
   */
  withTitle(title) {
    this.article.title = title;
    return this;
  }

  /**
   * Установка описания
   */
  withDescription(description) {
    this.article.description = description;
    return this;
  }

  /**
   * Установка содержания
   */
  withContent(content) {
    this.article.content = content;
    return this;
  }

  /**
   * Установка тегов
   */
  withTags(tags) {
    this.article.tags = Array.isArray(tags) ? tags : [tags];
    return this;
  }

  /**
   * Добавление тега
   */
  addTag(tag) {
    this.article.tags.push(tag);
    return this;
  }

  /**
   * Генерация статьи с длинным заголовком
   */
  withLongTitle() {
    this.article.title = 'A'.repeat(200);
    return this;
  }

  /**
   * Генерация статьи с длинным описанием
   */
  withLongDescription() {
    this.article.description = 'B'.repeat(300);
    return this;
  }

  /**
   * Генерация статьи с длинным содержанием
   */
  withLongContent() {
    this.article.content = 'C'.repeat(5000);
    return this;
  }

  /**
   * Генерация статьи с Markdown содержанием
   */
  withMarkdownContent() {
    this.article.content = `# Markdown Test Article
    
## This is a subtitle

This is **bold** text and this is *italic* text.

- List item 1
- List item 2
- List item 3

[This is a link](https://example.com)`;
    return this;
  }

  /**
   * Генерация статьи с множеством тегов
   */
  withMultipleTags() {
    this.article.tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
    return this;
  }

  /**
   * Создание статьи
   */
  build() {
    const result = { ...this.article };
    this.reset(); // Автоматический сброс после сборки
    return result;
  }

  /**
   * Статический метод для быстрого создания статьи по умолчанию
   */
  static createDefault() {
    return new ArticleBuilder().build();
  }

  /**
   * Статический метод для создания статьи с длинным заголовком
   */
  static createWithLongTitle() {
    return new ArticleBuilder().withLongTitle().build();
  }

  /**
   * Статический метод для создания статьи с Markdown
   */
  static createWithMarkdown() {
    return new ArticleBuilder().withMarkdownContent().build();
  }

  /**
   * Статический метод для создания статьи с множеством тегов
   */
  static createWithMultipleTags() {
    return new ArticleBuilder().withMultipleTags().build();
  }
}

module.exports = ArticleBuilder;