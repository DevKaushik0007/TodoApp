// src/components/TodoApp.jsx
import React, { useState, useEffect, useRef } from "react";
import "./TodoApp.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority,
      dueDate,
    };
    setTasks([newEntry, ...tasks]);
    setNewTask("");
    setDueDate("");
    setPriority("medium");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.priority === filter;
  });

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className={`todo-container ${darkMode ? "dark" : ""}`}>
      <div className="todo-app">
        <div className="header">
          <h2>✅ Modern To-Do List</h2>
          <label className="dark-toggle">
  <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
</label>

        </div>

        <div className="form">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">🔥 High</option>
            <option value="medium">⏳ Medium</option>
            <option value="low">🧊 Low</option>
          </select>
          <button onClick={addTask}>➕</button>
        </div>

        <div className="filter-bar">
          <span>Filter:</span>
          {["all", "high", "medium", "low"].map(p => (
            <button key={p} onClick={() => setFilter(p)} className={filter === p ? "active" : ""}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${(completedCount / tasks.length) * 100 || 0}%` }} />
        </div>

        <div className="task-list">
          {filteredTasks.map(task => (
            <div key={task.id} className={`task ${task.completed ? "completed" : ""}`}>
              <div className="task-left" onClick={() => toggleComplete(task.id)}>
                <div className={`circle ${task.completed ? "checked" : ""}`}></div>
                <div>
                  <p>{task.text}</p>
                  {task.dueDate && <small>Due: {task.dueDate}</small>}
                </div>
              </div>
              <div className={`priority-tag ${task.priority}`}>{task.priority}</div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>🗑️</button>

            </div>
          ))}
          {filteredTasks.length === 0 && <p className="no-tasks">No tasks to show.</p>}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
