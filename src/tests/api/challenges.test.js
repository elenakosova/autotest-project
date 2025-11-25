const { test, expect } = require('../../fixtures/api.fixture'); // ✅ Используем кастомную фикстуру
const TodoBuilder = require('../../builders/todo.builder');

test.describe('API Challenges Tests', () => {
  let challengerToken;

  test.beforeEach(async ({ api }) => { // ✅ Получаем api из фикстуры
    // Создаем нового challenger для каждого теста чтобы избежать конфликтов
    const response = await api.challenger.createChallenger();
    expect(response.status()).toBe(201);
    challengerToken = response.headers()['x-challenger'];
    // ✅ Убрали console.log
    expect(challengerToken).toBeDefined();
  });

  test('Challenge 03: GET /todos (200)', async ({ api }) => { // ✅ Используем api из фикстуры
    const response = await api.todos.getAllTodos({ 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.todos)).toBeTruthy();
  });

  test('Challenge 09: POST /todos (201) - create todo', async ({ api }) => {
    const todoData = new TodoBuilder()
      .withTitle() // Сгенерируется случайный
      .withDescription() // Сгенерируется случайный
      .withDoneStatus(false)
      .build();

    const response = await api.todos.createTodo(todoData, { 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(todoData.title);
    expect(body.description).toBe(todoData.description);
    expect(body.doneStatus).toBe(todoData.doneStatus);

    // Cleanup
    await api.todos.deleteTodo(body.id, { 'X-CHALLENGER': challengerToken });
  });

  test('Challenge 19: PUT /todos/{id} full (200) - update todo', async ({ api }) => {
    // Сначала создаем todo
    const createData = new TodoBuilder()
      .withTitle('Original Title')
      .withDescription('Original Description')
      .withDoneStatus(false)
      .build();

    const createResponse = await api.todos.createTodo(createData, { 'X-CHALLENGER': challengerToken });
    expect(createResponse.status()).toBe(201);
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;

    // Обновляем todo
    const updateData = new TodoBuilder()
      .withTitle('Updated Title')
      .withDescription('Updated Description')
      .withDoneStatus(true)
      .build();
    
    const response = await api.todos.updateTodoPut(todoId, updateData, { 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe(updateData.title);
    expect(body.description).toBe(updateData.description);
    expect(body.doneStatus).toBe(updateData.doneStatus);

    // Cleanup
    await api.todos.deleteTodo(todoId, { 'X-CHALLENGER': challengerToken });
  });

  test('Challenge 23: DELETE /todos/{id} (200)', async ({ api }) => {
    // Сначала создаем todo
    const todoData = new TodoBuilder()
      .withTitle('Todo to Delete')
      .withDescription('This todo will be deleted')
      .withDoneStatus(false)
      .build();

    const createResponse = await api.todos.createTodo(todoData, { 'X-CHALLENGER': challengerToken });
    expect(createResponse.status()).toBe(201);
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;

    // Удаляем todo
    const response = await api.todos.deleteTodo(todoId, { 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);

    // Проверяем что todo удален
    const getResponse = await api.todos.getTodo(todoId, { 'X-CHALLENGER': challengerToken });
    expect(getResponse.status()).toBe(404);
  });

  test('Challenge 24: OPTIONS /todos (200)', async ({ api }) => {
    const response = await api.todos.optionsTodos({ 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);
    const allowHeader = response.headers()['allow'];
    expect(allowHeader).toBeDefined();
    
    // Проверяем доступные методы
    const methods = allowHeader.split(', ').map(method => method.trim());
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('OPTIONS');
  });
});