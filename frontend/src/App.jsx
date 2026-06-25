import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const API_URL = "http://127.0.0.1:8000/tasks";

  // Fetch tasks whenever search or status filter changes (Combined Search & Filter)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const queryParams = new URLSearchParams({ status });
        if (search) queryParams.append("search", search);

        const response = await fetch(`${API_URL}?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [search, status]);

  // Create a new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Task title is required");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Toggle complete / incomplete status
  const handleToggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      if (response.ok) {
        const updated = await response.json();
        // Update local state or let useEffect re-fetch depending on active status
        setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
      }
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing mode
  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  // Save edited task details
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      if (response.ok) {
        const updated = await response.json();
        setTasks(tasks.map((t) => (t.id === editingTaskId ? updated : t)));
        setEditingTaskId(null);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Task Management System</h1>

      {/* SEARCH AND FILTER BAR */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="All">All Tasks</option>
          <option value="Active">Active</option>
          <option value="Inactive">Completed (Inactive)</option>
        </select>
      </div>

      {/* ADD / EDIT TASK FORM */}
      {editingTaskId ? (
        <form
          onSubmit={handleUpdateTask}
          style={{
            background: "#f4f4f4",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>Edit Task</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              display: "block",
            }}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              display: "block",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              background: "#2196F3",
              color: "white",
              border: "none",
              marginRight: "5px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditingTaskId(null)}
            style={{
              padding: "8px 12px",
              background: "#aaa",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleCreateTask}
          style={{
            background: "#eef2f3",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px",
          }}
        >
          <h3>Add New Task</h3>
          <input
            type="text"
            placeholder="Task Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              display: "block",
            }}
          />
          <textarea
            placeholder="Task Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              display: "block",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 15px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Task
          </button>
        </form>
      )}

      {/* TASK RENDERING LIST */}
      <div>
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            No tasks found matching criteria.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                padding: "10px 0",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: "0 0 5px 0",
                    textDecoration: task.is_completed ? "line-through" : "none",
                    color: task.is_completed ? "#888" : "#000",
                  }}
                >
                  {task.title}
                </h4>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                  {task.description}
                </p>
              </div>
              <div style={{ display: "flex", gap: "5px" }}>
                <button
                  onClick={() => handleToggleComplete(task)}
                  style={{
                    padding: "5px 10px",
                    background: task.is_completed ? "#ff9800" : "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {task.is_completed ? "Mark Active" : "Complete"}
                </button>
                <button
                  onClick={() => startEdit(task)}
                  style={{
                    padding: "5px 10px",
                    background: "#2196F3",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  style={{
                    padding: "5px 10px",
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
