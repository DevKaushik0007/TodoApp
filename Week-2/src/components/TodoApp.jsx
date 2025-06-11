import React, { useState, useEffect, useRef } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  });

  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleAdd = () => {
    if (task.trim() === '') return;

    setTodos([...todos, { text: task.trim(), completed: false }]);
    setTask('');
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const toggleComplete = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const removeTask = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="todo-container">
      <h1>📝 To-Do List</h1>
      <div className="input-section">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(index)}>
              {todo.completed ? '✔️' : '⬜'} {todo.text}
            </span>
            <button className="delete-btn" onClick={() => removeTask(index)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
