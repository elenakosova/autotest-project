const { faker } = require('@faker-js/faker');

class TodoBuilder {
  constructor() {
    this.title = null;
    this.description = null;
    this.doneStatus = false;
  }

  withTitle(title = null) {
    this.title = title || `Todo ${Date.now()}`;
    return this;
  }

  withDescription(description = null) {
    this.description = description || `Description ${Date.now()}`;
    return this;
  }

  withDoneStatus(doneStatus = false) {
    this.doneStatus = doneStatus;
    return this;
  }

  build() {
    if (!this.title) this.withTitle();
    if (!this.description) this.withDescription();
    
    return {
      title: this.title,
      description: this.description,
      doneStatus: this.doneStatus
    };
  }

  static createDefault() {
    return new TodoBuilder()
      .withTitle()
      .withDescription()
      .withDoneStatus(false)
      .build();
  }
}

module.exports = TodoBuilder;