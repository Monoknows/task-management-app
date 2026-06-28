// Props from App.jsx:
//   search      — string, controlled search value
//   setSearch   — setter
//   onOpenModal — opens the create-task modal

export default function TaskHeader({ search, setSearch, onOpenModal }) {
  return (
    <header style={styles.header}>
      {/* Search — filters tasks via backend ?search= query param */}
      <div style={styles.searchBox}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
          aria-label="Search tasks"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={styles.clearBtn}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Opens TaskModal in create mode */}
      <button onClick={onOpenModal} style={styles.addBtn}>
        + Add Task
      </button>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    gap: "16px",
    flexWrap: "wrap",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "9px 14px",
    flex: 1,
    maxWidth: "400px",
    minWidth: "200px",
  },
  searchIcon: { fontSize: "14px", color: "#9CA3AF", flexShrink: 0 },
  searchInput: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "transparent",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#9CA3AF",
    cursor: "pointer",
    fontSize: "12px",
    padding: "0",
    lineHeight: 1,
    flexShrink: 0,
  },
  addBtn: {
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
};
