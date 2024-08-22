import axios from "axios";

// const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const API_URL = "http://localhost:8000/todos";

export const fetchTodos = async () => {
  const response = await axios.get(API_URL);
  return response.data.slice(0, 10); // Limit to 10 todos for demo purposes
};

export const addTodo = async (todo) => {
  const response = await axios.post(API_URL, {
    ...todo,
    completed: false,
  });
  return response.data;
};

export const updateTodo = async (todo) => {
  const response = await axios.put(`${API_URL}/${todo._id}`, todo);

  console.log('response', response);
  return response;
};

export const deleteTodo = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response ;
};
