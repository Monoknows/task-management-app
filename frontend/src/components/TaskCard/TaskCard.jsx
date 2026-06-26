import React from "react";

export default function TaskCard({ task, onToggleComplete, onDelete, onEdit }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span
          style={task.is_completed ? styles.badgeCompleted : styles.badgeActive}
        >
          {task.is_completed ? "Completed" : "Active"}
        </span>
        <div style={styles.cardActions}>
          <button
            onClick={() => onEdit(task)}
            style={styles.iconButton}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={styles.iconButton}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <h3
        style={{
          ...styles.cardTitle,
          textDecoration: task.is_completed ? "line-through" : "none",
          color: task.is_completed ? "#9CA3AF" : "#1F2937",
        }}
      >
        {task.title}
      </h3>
      <p style={styles.cardDescription}>
        {task.description || "No description provided."}
      </p>

      <div style={styles.cardFooter}>
        <button
          onClick={() => onToggleComplete(task)}
          style={
            task.is_completed
              ? styles.secondaryActionBtn
              : styles.successActionBtn
          }
        >
          {task.is_completed ? "↺ Reopen" : "✓ Mark Done"}
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
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  badgeActive: {
    backgroundColor: "#EEF2F6",
    color: "#4F46E5",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  badgeCompleted: {
    backgroundColor: "#ECFDF5",
    color: "#10B981",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  cardActions: { display: "flex", gap: "8px" },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  cardTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1.4",
  },
  cardDescription: {
    margin: "0 0 20px 0",
    color: "#6B7280",
    fontSize: "14px",
    lineHeight: "1.5",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    borderTop: "1px solid #F3F4F6",
    paddingTop: "14px",
    justifyContent: "flex-end",
  },
  successActionBtn: {
    background: "none",
    border: "none",
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  secondaryActionBtn: {
    background: "none",
    border: "none",
    color: "#6B7280",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
};
