import React from "react";

export default function DashboardOverview({
  user,
  tasks = [],
  dbStatus,
  onViewTasks,
  onViewTask,
}) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Most recent 3 incomplete tasks
  const upcomingTasks = tasks.filter((t) => !t.is_completed).slice(0, 3);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const dbLabel =
    {
      connected: "● Connected",
      connecting: "⏳ Connecting…",
      error: "⚠️ Connection failed",
    }[dbStatus] || "⏳ Connecting…";

  const dbColors = {
    connected: { bg: "#ECFDF5", text: "#065F46" },
    connecting: { bg: "#FFFBEB", text: "#92400E" },
    error: { bg: "#FEF2F2", text: "#991B1B" },
  }[dbStatus] || { bg: "#FFFBEB", text: "#92400E" };

  return (
    <div style={styles.container}>
      {/* ── Header ── */}
      <header style={styles.headerRow}>
        <div>
          <h1 style={styles.welcomeText}>
            {greeting()}, {user?.fullName?.split(" ")[0] || "there"} 👋
          </h1>
          <p style={styles.subtext}>
            {pendingTasks > 0
              ? `You have ${pendingTasks} task${pendingTasks !== 1 ? "s" : ""} remaining.`
              : totalTasks > 0
                ? "All tasks complete — great work!"
                : "No tasks yet. Add one to get started."}
          </p>
        </div>
        <div
          style={{
            ...styles.dbBadge,
            backgroundColor: dbColors.bg,
            color: dbColors.text,
          }}
        >
          {dbLabel}
        </div>
      </header>

      {/* ── Stat cards ── */}
      <section style={styles.statsRow}>
        {[
          { icon: "📋", label: "Total", value: totalTasks },
          { icon: "✅", label: "Completed", value: completedTasks },
          { icon: "⏳", label: "Pending", value: pendingTasks },
          {
            icon: "⚡",
            label: "Done rate",
            value: `${completionRate}%`,
          },
        ].map(({ icon, label, value }) => (
          <div key={label} style={styles.statCard}>
            <div style={styles.statLabel}>
              {icon} {label}
            </div>
            <div style={styles.statNumber}>{value}</div>
          </div>
        ))}
      </section>

      {/* ── Upcoming + progress ── */}
      <section style={styles.splitGrid}>
        {/* Upcoming tasks */}
        <div style={styles.columnLeft}>
          <div style={styles.sectionTitleRow}>
            <h2 style={styles.sectionTitle}>Upcoming tasks</h2>
            <button onClick={onViewTasks} style={styles.viewAllBtn}>
              View all →
            </button>
          </div>

          <div style={styles.listContainer}>
            {upcomingTasks.length === 0 ? (
              <div style={styles.emptyState}>
                {totalTasks === 0
                  ? "Add your first task to get started."
                  : "🎉 All tasks are complete!"}
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onViewTask(task)}
                  style={styles.taskRow}
                >
                  <div style={styles.taskRowLeft}>
                    <div style={styles.taskDot} />
                    <div>
                      <div style={styles.taskRowTitle}>{task.title}</div>
                      {task.description && (
                        <div style={styles.taskRowSub}>
                          {task.description.slice(0, 60)}
                          {task.description.length > 60 ? "…" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                  <span style={styles.arrowIcon}>→</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progress ring */}
        <div style={styles.columnRight}>
          <h2 style={styles.sectionTitle}>Progress</h2>
          <div style={styles.progressCard}>
            <div style={styles.ringWrap}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#EEF2FF"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionRate / 100)}`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div style={styles.ringLabel}>
                <span style={styles.ringPercent}>{completionRate}%</span>
                <span style={styles.ringSubtext}>done</span>
              </div>
            </div>
            <div style={styles.progressStats}>
              <div style={styles.progressStat}>
                <span style={styles.progressStatDot("completed")} />
                <span>{completedTasks} completed</span>
              </div>
              <div style={styles.progressStat}>
                <span style={styles.progressStatDot("pending")} />
                <span>{pendingTasks} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    boxSizing: "border-box",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  welcomeText: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  subtext: { color: "#6B7280", margin: 0, fontSize: "15px" },
  dbBadge: {
    padding: "7px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },
  statsRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  statCard: {
    flex: 1,
    minWidth: "140px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "20px",
  },
  statLabel: {
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  statNumber: { fontSize: "30px", fontWeight: "800", color: "#111827" },
  splitGrid: { display: "flex", gap: "24px", width: "100%", flexWrap: "wrap" },
  columnLeft: {
    flex: 1.8,
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  columnRight: {
    flex: 1,
    minWidth: "220px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#4F46E5",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  listContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  taskRow: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "border-color 0.15s",
  },
  taskRowLeft: { display: "flex", alignItems: "center", gap: "14px" },
  taskDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#4F46E5",
    flexShrink: 0,
  },
  taskRowTitle: { fontWeight: "600", color: "#111827", fontSize: "14px" },
  taskRowSub: { fontSize: "12px", color: "#9CA3AF", marginTop: "2px" },
  arrowIcon: { color: "#D1D5DB", fontWeight: "bold" },
  emptyState: {
    padding: "32px",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    border: "1px dashed #D1D5DB",
    borderRadius: "10px",
    color: "#9CA3AF",
    fontSize: "14px",
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  ringWrap: { position: "relative", display: "inline-flex" },
  ringLabel: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },
  ringPercent: { fontSize: "22px", fontWeight: "800", color: "#111827" },
  ringSubtext: { fontSize: "11px", color: "#9CA3AF", fontWeight: "500" },
  progressStats: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  progressStat: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#6B7280",
  },
  progressStatDot: (type) => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: type === "completed" ? "#4F46E5" : "#E5E7EB",
    flexShrink: 0,
  }),
};
