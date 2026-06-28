// Props from App.jsx:
//   task               — full task object { id, title, description, is_completed, owner_id }
//   onToggleComplete(task)
//   onDelete(id)
//   onEdit(task)

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={() => onToggleComplete(task)}
            style={styles.checkbox}
          />
        </label>

        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: task.is_completed ? "#ECFDF5" : "#EEF2FF",
            color: task.is_completed ? "#059669" : "#4F46E5",
          }}
        >
          {task.is_completed ? "✓ Completed" : "● Active"}
        </span>
      </div>

      <h3
        style={{
          ...styles.title,
          textDecoration: task.is_completed ? "line-through" : "none",
          color: task.is_completed ? "#9CA3AF" : "#111827",
        }}
      >
        {task.title}
      </h3>

      <p style={styles.description}>
        {task.description || "No description added."}
      </p>

      <div style={styles.footer}>
        <button onClick={() => onEdit(task)} style={styles.editBtn}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(task.id)} style={styles.deleteBtn}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxLabel: { display: "flex", alignItems: "center" },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#4F46E5",
    cursor: "pointer",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    lineHeight: "1.3",
  },
  description: {
    margin: 0,
    fontSize: "13px",
    color: "#6B7280",
    lineHeight: "1.5",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
  },
  footer: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
    paddingTop: "12px",
    borderTop: "1px solid #F3F4F6",
  },
  editBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
    border: "1px solid #FECACA",
    padding: "8px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
};
