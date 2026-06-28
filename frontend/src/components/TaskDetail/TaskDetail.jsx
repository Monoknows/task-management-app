import React from "react";

export default function TaskDetail({
  task,
  onBack,
  onToggleComplete,
  onDelete,
  onEdit,
}) {
  if (!task) {
    return (
      <button onClick={onBack} style={styles.backBtn}>
        ← Back to Tasks
      </button>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>
        ← Back to Tasks
      </button>

      <div style={styles.mainLayout}>
        {/* ── Left: Task content ── */}
        <div style={styles.leftColumn}>
          <div style={styles.card}>
            <div style={styles.metaRow}>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: task.is_completed ? "#ECFDF5" : "#EEF2FF",
                  color: task.is_completed ? "#059669" : "#4F46E5",
                }}
              >
                {task.is_completed ? "✓ Completed" : "● Active"}
              </span>
              <span style={styles.taskIdLabel}>Task #{task.id}</span>
            </div>

            <h1
              style={{
                ...styles.taskTitle,
                textDecoration: task.is_completed ? "line-through" : "none",
                color: task.is_completed ? "#9CA3AF" : "#111827",
              }}
            >
              {task.title}
            </h1>

            <p style={styles.taskDescription}>
              {task.description ||
                "No description has been added for this task."}
            </p>

            <div style={styles.divider} />

            <div style={styles.checklistSection}>
              <h3 style={styles.sectionHeading}>Completion</h3>
              <label style={styles.checklistRow}>
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => onToggleComplete(task)}
                  style={styles.checkbox}
                />
                <span
                  style={{
                    color: task.is_completed ? "#9CA3AF" : "#111827",
                    textDecoration: task.is_completed ? "line-through" : "none",
                    fontSize: "14px",
                  }}
                >
                  Mark this task as complete
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right: Actions + Metadata ── */}
        <div style={styles.rightColumn}>
          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Actions</h3>
            <button
              onClick={() => onToggleComplete(task)}
              style={styles.primaryBtn}
            >
              {task.is_completed ? "⟲ Reopen Task" : "✓ Mark Complete"}
            </button>
            <button onClick={() => onEdit(task)} style={styles.secondaryBtn}>
              ✏️ Edit Task
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this task?")
                ) {
                  onDelete(task.id);
                  onBack();
                }
              }}
              style={styles.dangerBtn}
            >
              🗑️ Delete Task
            </button>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardHeading}>Details</h3>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>ID</span>
              <strong style={styles.detailValue}>#{task.id}</strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Status</span>
              <strong style={styles.detailValue}>
                {task.is_completed ? "Completed" : "Active"}
              </strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Owner ID</span>
              <strong style={styles.detailValue}>{task.owner_id}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "100%", textAlign: "left" },
  backBtn: {
    background: "none",
    border: "none",
    color: "#4F46E5",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "24px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  mainLayout: {
    display: "flex",
    gap: "24px",
    width: "100%",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  leftColumn: {
    flex: 2,
    minWidth: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rightColumn: {
    flex: 1,
    minWidth: "240px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #E5E7EB",
    padding: "28px",
    boxSizing: "border-box",
    width: "100%",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  taskIdLabel: { color: "#D1D5DB", fontSize: "13px", fontWeight: "600" },
  taskTitle: {
    fontSize: "28px",
    fontWeight: "800",
    margin: "0 0 16px 0",
    lineHeight: "1.3",
  },
  taskDescription: {
    color: "#4B5563",
    fontSize: "15px",
    lineHeight: "1.7",
    margin: 0,
  },
  divider: {
    height: "1px",
    backgroundColor: "#F3F4F6",
    margin: "24px 0",
  },
  checklistSection: {},
  sectionHeading: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    margin: "0 0 12px 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  checklistRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    accentColor: "#4F46E5",
    cursor: "pointer",
    flexShrink: 0,
  },
  cardHeading: {
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    color: "#111827",
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    padding: "11px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "8px",
  },
  secondaryBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "11px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginBottom: "8px",
  },
  dangerBtn: {
    width: "100%",
    backgroundColor: "#FEF2F2",
    color: "#B91C1C",
    border: "1px solid #FECACA",
    padding: "11px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #F9FAFB",
    fontSize: "14px",
  },
  detailLabel: { color: "#9CA3AF", fontWeight: "500" },
  detailValue: { color: "#111827", fontWeight: "600" },
};
