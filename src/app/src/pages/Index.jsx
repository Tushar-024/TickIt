import React, { useState, useEffect } from "react";
import TodoList from "../components/TodoList";
import AddTodoForm from "../components/AddTodoForm";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/todoApi";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (err) {
        setError("Failed to load todos");
      } finally {
        setIsLoading(false);
      }
    };
    loadTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    try {
      const addedTodo = await addTodo(newTodo);
      setTodos([...todos, addedTodo]);
    } catch (err) {
      throw new Error("Failed to add todo");
    }
  };

  const handleUpdateTodo = async (updatedTodo) => {
    try {
      console.log("updatedTodo in index", updatedTodo);
      const updated = await updateTodo(updatedTodo);

      if (updated.status === 200) {
        setTodos(
          todos.map((todo) => {
            if (todo._id === updatedTodo._id) {
              return updatedTodo;
            }
            return todo;
          })
        );
      }

      console.log("updated", updated);

      // Update the todo in the local state
    } catch (err) {
      throw new Error("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (_id) => {
    try {
      console.log("id", _id);
      const response = await deleteTodo(_id);

      if (response.status === 200) {
        setTodos(todos.filter((todo) => todo._id !== _id));
      }

      // setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      throw new Error("Failed to delete todo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Todo Application
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div>
            <AddTodoForm onAddTodo={handleAddTodo} />
          </div>

          <div>
            <TodoList
              todos={todos}
              isLoading={isLoading}
              error={error}
              onUpdateTodo={handleUpdateTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        </div>
      </div>
      {/* <Toaster /> */}
    </div>
  );
};

export default Index;
