import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Custom Modular Components
import Sidebar from "./Components/Sidebar/Sidebar";
import TaskHeader from "./Components/TaskHeader/TaskHeader";
import TaskCard from "./Components/TaskCard/TaskCard";
import TaskModal from "./Components/TaskModal/TaskModal";
import Auth from "./Components/Auth/Auth";

export default function App() {
  const [user, setUser] = useState(null); // High-level User Authentication Context
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const API_URL = "http://127.0.0.1:8000/tasks";

  // Fetch Logic (Combined Search & Filter)
  useEffect(() => {
    if (!user) return; // Only fetch if user is authorized

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
  }, [search, status, user]);

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedTask) {
        const response = await fetch(`${API_URL}/${selectedTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const updated = await response.json();
          setTasks(tasks.map((t) => (t.id === selectedTask.id ? updated : t)));
        }
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
        }
      }
      closeModal();
    } catch (error) {
      console.error("Error processing task save:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      if (response.ok) {
        const updated = await response.json();
        setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
      }
    } catch (error) {
      console.error("Error toggling completion status:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  return (
    <Router>
      {/* Route Interceptor: If no active session, show Sign In/Up view */}
      {!user ? (
        <Auth onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <div style={styles.appContainer}>
                <Sidebar user={user} onLogout={handleLogout} />

                <main style={styles.mainContent}>
                  <TaskHeader
                    search={search}
                    setSearch={setSearch}
                    onOpenModal={() => setIsModalOpen(true)}
                  />

                  <section style={styles.titleSection}>
                    <div>
                      <h1
                        style={{
                          margin: 0,
                          fontSize: "28px",
                          color: "#111827",
                        }}
                      >
                        My Tasks
                      </h1>
                      <p style={{ margin: "4px 0 0 0", color: "#6B7280" }}>
                        Manage and track your active projects and daily goals.
                      </p>
                    </div>

                    <div style={styles.filterPills}>
                      {["All", "Active", "Inactive"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setStatus(f)}
                          style={
                            status === f
                              ? styles.pillActive
                              : styles.pillInactive
                          }
                        >
                          {f === "Inactive" ? "Completed" : f}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section style={styles.cardGrid}>
                    {tasks.length === 0 ? (
                      <div style={styles.emptyState}>
                        No tasks found matching your criteria.
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                          onEdit={openEditModal}
                        />
                      ))
                    )}
                  </section>
                </main>

                {isModalOpen && (
                  <TaskModal
                    task={selectedTask}
                    onClose={closeModal}
                    onSubmit={handleModalSubmit}
                  />
                )}
              </div>
            }
          />
        </Routes>
      )}
    </Router>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#F9FAFB",
    fontFamily: '"Inter", sans-serif',
  },
  mainContent: { flex: 1, padding: "32px 48px", overflowY: "auto" },
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "28px",
  },
  filterPills: {
    display: "flex",
    backgroundColor: "#E5E7EB",
    padding: "4px",
    borderRadius: "8px",
    gap: "4px",
  },
  pillActive: {
    backgroundColor: "#FFFFFF",
    color: "#1F2937",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  pillInactive: {
    backgroundColor: "transparent",
    color: "#4B5563",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#6B7280",
  },
};
