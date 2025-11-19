class TodoBuilder {
  constructor() {
    this.title = 'Default Todo';
    this.description = 'Default Description';
    this.doneStatus = false;
  }

  withTitle(title) {
    this.title = title;
    return this;
  }

  withDescription(description) {
    this.description = description;
    return this;
  }

  withDoneStatus(doneStatus) {
    this.doneStatus = doneStatus;
    return this;
  }

  build() {
    return {
      title: this.title,
      description: this.description,
      doneStatus: this.doneStatus
    };
  }

  // Статический метод для быстрого создания дефолтного туду
  static createDefault() {
    return new TodoBuilder()
      .withTitle('Test Todo')
      .withDescription('Test Description')
      .withDoneStatus(false)
      .build();
  }
}

module.exports = TodoBuilder;