const { expect } = require('@playwright/test');

class ApiService {
  constructor(request) {
    this.request = request;
    this.baseURL = 'https://apichallenges.herokuapp.com';
  }

  // Challenger endpoints
  challenger = {
    createChallenger: () => this.request.post(`${this.baseURL}/challenger`),
    getChallenger: (guid) => this.request.get(`${this.baseURL}/challenger/${guid}`),
    restoreChallenger: (guid, data) => this.request.put(`${this.baseURL}/challenger/${guid}`, { data }),
  };

  // Todos endpoints
  todos = {
    getAllTodos: (headers = {}) => this.request.get(`${this.baseURL}/todos`, { headers }),
    getTodo: (id, headers = {}) => this.request.get(`${this.baseURL}/todos/${id}`, { headers }),
    createTodo: (data, headers = {}) => this.request.post(`${this.baseURL}/todos`, { data, headers }),
    updateTodoPut: (id, data, headers = {}) => this.request.put(`${this.baseURL}/todos/${id}`, { data, headers }),
    updateTodoPost: (id, data, headers = {}) => this.request.post(`${this.baseURL}/todos/${id}`, { data, headers }),
    deleteTodo: (id, headers = {}) => this.request.delete(`${this.baseURL}/todos/${id}`, { headers }),
    optionsTodos: (headers = {}) => this.request.fetch(`${this.baseURL}/todos`, { 
      method: 'OPTIONS', 
      headers 
    }),
    getTodosWithFilter: (filter, headers = {}) => this.request.get(`${this.baseURL}/todos?${filter}`, { headers }),
  };

  // Secret endpoints (for authentication challenges)
  secret = {
    getToken: (authHeader) => this.request.post(`${this.baseURL}/secret/token`, {
      headers: { 'Authorization': authHeader }
    }),
    getNote: (authToken) => this.request.get(`${this.baseURL}/secret/note`, {
      headers: { 'X-AUTH-TOKEN': authToken }
    }),
    createNote: (data, authToken) => this.request.post(`${this.baseURL}/secret/note`, {
      data,
      headers: { 'X-AUTH-TOKEN': authToken }
    }),
  };
}

module.exports = ApiService;