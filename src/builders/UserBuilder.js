// Константы для тестовых данных
const TEST_DATA = {
  DEFAULT_PASSWORD: `TestPass${Date.now()}!`,
  SHORT_PASSWORD: '12345'
};

class UserBuilder {
  constructor() {
    this.user = {
      username: '',
      email: '',
      password: '',
      bio: ''
    };
    this.reset();
  }

  /**
   * Сброс к базовым значениям
   */
  reset() {
    this.user = {
      username: `testuser_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      email: `test_${Date.now()}@example.com`,
      password: TEST_DATA.DEFAULT_PASSWORD,
      bio: 'Test bio for automated testing'
    };
    return this;
  }

  /**
   * Установка имени пользователя
   */
  withUsername(username) {
    this.user.username = username;
    return this;
  }

  /**
   * Установка email
   */
  withEmail(email) {
    this.user.email = email;
    return this;
  }

  /**
   * Установка пароля
   */
  withPassword(password) {
    this.user.password = password;
    return this;
  }

  /**
   * Установка био
   */
  withBio(bio) {
    this.user.bio = bio;
    return this;
  }

  /**
   * Генерация пользователя с длинным именем (для тестов валидации)
   */
  withLongUsername() {
    this.user.username = 'a'.repeat(50);
    return this;
  }

  /**
   * Генерация пользователя с длинным био (для тестов валидации)
   */
  withLongBio() {
    this.user.bio = 'b'.repeat(500);
    return this;
  }

  /**
   * Генерация пользователя с невалидным email
   */
  withInvalidEmail() {
    this.user.email = 'invalid-email';
    return this;
  }

  /**
   * Генерация пользователя с коротким паролем
   */
  withShortPassword() {
    this.user.password = TEST_DATA.SHORT_PASSWORD;
    return this;
  }

  /**
   * Создание пользователя для регистрации
   */
  build() {
    const result = { ...this.user };
    this.reset(); // Автоматический сброс после сборки
    return result;
  }

  /**
   * Статический метод для быстрого создания пользователя по умолчанию
   */
  static createDefault() {
    return new UserBuilder().build();
  }

  /**
   * Статический метод для создания пользователя с длинным именем
   */
  static createWithLongUsername() {
    return new UserBuilder().withLongUsername().build();
  }

  /**
   * Статический метод для создания пользователя с длинным био
   */
  static createWithLongBio() {
    return new UserBuilder().withLongBio().build();
  }

  /**
   * Статический метод для создания пользователя с невалидным email
   */
  static createWithInvalidEmail() {
    return new UserBuilder().withInvalidEmail().build();
  }

  /**
   * Статический метод для создания пользователя с коротким паролем
   */
  static createWithShortPassword() {
    return new UserBuilder().withShortPassword().build();
  }
}

module.exports = UserBuilder;