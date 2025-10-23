import React, { useState, useEffect } from "react";
import "./App.css";
import { FaTrash } from "react-icons/fa";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [taskText, setTaskText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
  const saved = localStorage.getItem("darkMode");
  return saved ? JSON.parse(saved) : false;
});
useEffect(() => {
  localStorage.setItem("darkMode", JSON.stringify(darkMode));
  document.body.className = darkMode ? "dark-mode" : "";
}, [darkMode]);


  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    tasks.forEach((task) => {
      if (task.dueDate && !task.completed) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // today midnight
        const due = new Date(task.dueDate);
        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()); // due date midnight

        if (dueDay < today) {
          new Notification("⚠️ Overdue Task", {
            body: `The task "${task.text}" was due on ${task.dueDate}.`,
          });
        } else if (dueDay.getTime() === today.getTime()) {
          new Notification("📅 Task Due Today", {
            body: `The task "${task.text}" is due today.`,
          });
        }
      }
    });
  }, [tasks]);

  // ➕ Add a new task
  const addTask = () => {
    if (!taskText.trim()) return;

    const newTask = {
      text: taskText,
      completed: false,
      dueDate,
      priority,
      category,
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setDueDate("");
    setPriority("Medium");
    setCategory("");
  };

  // ✅ Toggle completion
  const toggleTaskCompletion = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  // 🗑️ Delete task
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <div className="app-container">
      <h1>My To-Do List</h1>

<button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="text"
          placeholder="Category (Work, Personal...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task, index) => {
          // Compute task due class
          let dueClass = "";
          if (task.dueDate) {
            const today = new Date();
            const due = new Date(task.dueDate);
            const diffDays = Math.ceil(
              (due - today) / (1000 * 60 * 60 * 24)
            );

            if (diffDays < 0) dueClass = "overdue";
            else if (diffDays <= 1) dueClass = "due-soon";
            else dueClass = "on-time";
          }

          return (
       <li key={index + task.text} className="task-item">


              <div className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(index)}
                />
                <span className={task.completed ? "completed" : ""}>
                  {task.text}
                </span>
              </div>

              <div className="task-details">
                {task.dueDate && (
                  <p className={`due-date ${dueClass}`}>🗓️ {task.dueDate}</p>
                )}
                {task.priority && <p>⭐ {task.priority}</p>}
                {task.category && <p>🏷️ {task.category}</p>}
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteTask(index)}
                title="Delete Task"
              >
                <FaTrash />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
