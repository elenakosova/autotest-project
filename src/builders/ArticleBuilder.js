const { faker } = require('@faker-js/faker');

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

  reset() {
    this.article = {
      title: `Test Article ${Date.now()}`,
      description: `Test description ${Date.now()}`,
      content: `Test content ${Date.now()}`,
      tags: ['test', 'automation']
    };
    return this;
  }

  withTitle(title = null) {
    this.article.title = title || `Test Title ${Date.now()}`;
    return this;
  }

  withDescription(description = null) {
    this.article.description = description || `Test Desc ${Date.now()}`;
    return this;
  }

  withContent(content = null) {
    this.article.content = content || `Test Content ${Date.now()}`;
    return this;
  }

  withTags(tags) {
    this.article.tags = Array.isArray(tags) ? tags : [tags];
    return this;
  }

  addTag(tag) {
    this.article.tags.push(tag);
    return this;
  }

  withLongTitle() {
    this.article.title = 'A'.repeat(50);
    return this;
  }

  withLongDescription() {
    this.article.description = 'B'.repeat(100);
    return this;
  }

  withLongContent() {
    this.article.content = 'C'.repeat(500);
    return this;
  }

  withMarkdownContent() {
    this.article.content = "Test Markdown Bold and italic text Item 1 Item 2";
    return this;
  }

  withMultipleTags() {
    this.article.tags = ['tag1', 'tag2', 'tag3'];
    return this;
  }

  build() {
    const result = { ...this.article };
    this.reset();
    return result;
  }

  static createDefault() {
    return new ArticleBuilder().build();
  }

  static createWithLongTitle() {
    return new ArticleBuilder().withLongTitle().build();
  }

  static createWithMarkdown() {
    return new ArticleBuilder().withMarkdownContent().build();
  }

  static createWithMultipleTags() {
    return new ArticleBuilder().withMultipleTags().build();
  }
}

module.exports = ArticleBuilder;