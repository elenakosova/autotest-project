const { test, expect } = require('@playwright/test');
const ApiService = require('../../services/api.service');
const TodoBuilder = require('../../builders/todo.builder');

test.describe('API Challenges Tests', () => {
  let challengerToken;
  let apiService;

  test.beforeEach(async ({ request }) => {
    apiService = new ApiService(request);
    
    // Создаем нового challenger для каждого теста чтобы избежать конфликтов
    const response = await apiService.challenger.createChallenger();
    expect(response.status()).toBe(201);
    challengerToken = response.headers()['x-challenger'];
    console.log('Challenger Token:', challengerToken);
    expect(challengerToken).toBeDefined();
  });

  test('Challenge 03: GET /todos (200)', async () => {
    const response = await apiService.todos.getAllTodos({ 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.todos)).toBeTruthy();
  });

  test('Challenge 09: POST /todos (201) - create todo', async () => {
    const todoData = new TodoBuilder()
      .withTitle('Test Todo')
      .withDescription('Test Description')
      .withDoneStatus(false)
      .build();

    const response = await apiService.todos.createTodo(todoData, { 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(todoData.title);
    expect(body.description).toBe(todoData.description);
    expect(body.doneStatus).toBe(todoData.doneStatus);

    // Cleanup
    await apiService.todos.deleteTodo(body.id, { 'X-CHALLENGER': challengerToken });
  });

  test('Challenge 19: PUT /todos/{id} full (200) - update todo', async () => {
    // Сначала создаем todo
    const createData = new TodoBuilder()
      .withTitle('Original Title')
      .withDescription('Original Description')
      .withDoneStatus(false)
      .build();

    const createResponse = await apiService.todos.createTodo(createData, { 'X-CHALLENGER': challengerToken });
    expect(createResponse.status()).toBe(201);
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;

    // Обновляем todo
    const updateData = new TodoBuilder()
      .withTitle('Updated Title')
      .withDescription('Updated Description')
      .withDoneStatus(true)
      .build();
    
    const response = await apiService.todos.updateTodoPut(todoId, updateData, { 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe(updateData.title);
    expect(body.description).toBe(updateData.description);
    expect(body.doneStatus).toBe(updateData.doneStatus);

    // Cleanup
    await apiService.todos.deleteTodo(todoId, { 'X-CHALLENGER': challengerToken });
  });

  test('Challenge 23: DELETE /todos/{id} (200)', async () => {
    // Сначала создаем todo
    const todoData = new TodoBuilder()
      .withTitle('Todo to Delete')
      .withDescription('This todo will be deleted')
      .withDoneStatus(false)
      .build();

    const createResponse = await apiService.todos.createTodo(todoData, { 'X-CHALLENGER': challengerToken });
    expect(createResponse.status()).toBe(201);
    const createdTodo = await createResponse.json();
    const todoId = createdTodo.id;

    // Удаляем todo
    const response = await apiService.todos.deleteTodo(todoId, { 'X-CHALLENGER': challengerToken });
    
    expect(response.status()).toBe(200);

    // Проверяем что todo удален
    const getResponse = await apiService.todos.getTodo(todoId, { 'X-CHALLENGER': challengerToken });
    expect(getResponse.status()).toBe(404);
  });

  test('Challenge 24: OPTIONS /todos (200)', async () => {
    const response = await apiService.todos.optionsTodos({ 'X-CHALLENGER': challengerToken });
    
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