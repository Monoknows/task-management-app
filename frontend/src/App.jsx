import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./Components/Sidebar/Sidebar";
import TaskHeader from "./Components/TaskHeader/TaskHeader";
import TaskCard from "./Components/TaskCard/TaskCard";
import TaskModal from "./Components/TaskModal/TaskModal";
import Auth from "./Components/Auth/Auth";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [user, setUser] = useState(() => {
    // Persist login across page refresh
    try {
      const saved = localStorage.getItem("tm_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Auth ────────────────────────────────────────────────────────────────────
  // Auth.jsx calls onLoginSuccess({ fullName, email, password })
  const handleLoginSuccess = async (credentials) => {
    setApiError("");
    try {
      const response = await fetch(`${API_URL}/auth/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: credentials.fullName,
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Authentication failed");
      }

      // Backend returns: { id, full_name, email }
      const dbUser = await response.json();
      const normalizedUser = {
        id: dbUser.id,
        fullName: dbUser.full_name,
        email: dbUser.email,
        workspace: "Pro Workspace",
      };
      localStorage.setItem("tm_user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
    } catch (err) {
      setApiError(err.message);
    }
  };

  // ── Fetch tasks ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      setApiError("");
      try {
        const queryParams = new URLSearchParams({ status });
        if (search.trim()) queryParams.append("search", search.trim());

        const response = await fetch(`${API_URL}/tasks?${queryParams}`, {
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(user.id),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [search, status, user]);

  // ── Create / Edit task ───────────────────────────────────────────────────────
  const handleModalSubmit = async (formData) => {
    setApiError("");
    try {
      if (selectedTask) {
        // Edit
        const response = await fetch(`${API_URL}/tasks/${selectedTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(user.id),
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
          }),
        });
        if (!response.ok) throw new Error("Failed to update task");
        const updated = await response.json();
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedTask.id ? updated : t)),
        );
      } else {
        // Create
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(user.id),
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
          }),
        });
        if (!response.ok) throw new Error("Failed to create task");
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
      }
      closeModal();
    } catch (error) {
      setApiError(error.message);
    }
  };

  // ── Toggle complete ──────────────────────────────────────────────────────────
  const handleToggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(user.id),
        },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });
      if (!response.ok) throw new Error("Failed to update task");
      const updated = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (error) {
      setApiError(error.message);
    }
  };

  // ── Delete task ──────────────────────────────────────────────────────────────
  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: { "X-User-Id": String(user.id) },
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      setApiError(error.message);
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
    localStorage.removeItem("tm_user");
    setUser(null);
    setTasks([]);
    setApiError("");
  };

  // ── Not logged in ────────────────────────────────────────────────────────────
  if (!user) {
    return <Auth onLoginSuccess={handleLoginSuccess} apiError={apiError} />;
  }

  // ── App shell ────────────────────────────────────────────────────────────────
  return (
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <div style={styles.appContainer}>
              <Sidebar user={user} onLogout={handleLogout} />

              <main style={styles.mainContent}>
                {/* Global error banner */}
                {apiError && (
                  <div style={styles.errorBanner}>
                    ⚠️ {apiError}
                    <button
                      onClick={() => setApiError("")}
                      style={styles.errorClose}
                    >
                      ✕
                    </button>
                  </div>
                )}

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
                        fontWeight: "800",
                        color: "#111827",
                      }}
                    >
                      My Tasks
                    </h1>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        color: "#6B7280",
                        fontSize: "14px",
                      }}
                    >
                      {tasks.length} task{tasks.length !== 1 ? "s" : ""} for{" "}
                      <strong>{user.fullName}</strong>
                    </p>
                  </div>

                  <div style={styles.filterPills}>
                    {["All", "Active", "Inactive"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setStatus(f)}
                        style={
                          status === f ? styles.pillActive : styles.pillInactive
                        }
                      >
                        {f === "Inactive" ? "Completed" : f}
                      </button>
                    ))}
                  </div>
                </section>

                <section style={styles.cardGrid}>
                  {isLoading ? (
                    <div style={styles.emptyState}>Loading tasks…</div>
                  ) : tasks.length === 0 ? (
                    <div style={styles.emptyState}>
                      {search
                        ? `No tasks match "${search}"`
                        : status !== "All"
                          ? `No ${status.toLowerCase()} tasks.`
                          : "No tasks yet — click Add Task to create one."}
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
    </Router>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#F9FAFB",
    fontFamily: '"Inter", -apple-system, sans-serif',
  },
  mainContent: {
    flex: 1,
    padding: "32px 48px",
    overflowY: "auto",
    boxSizing: "border-box",
  },
  errorBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#B91C1C",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: "500",
  },
  errorClose: {
    background: "none",
    border: "none",
    color: "#B91C1C",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
  titleSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
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
    fontSize: "14px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  pillInactive: {
    backgroundColor: "transparent",
    color: "#4B5563",
    border: "none",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  emptyState: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "60px 40px",
    color: "#9CA3AF",
    fontSize: "15px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px dashed #E5E7EB",
  },
};
