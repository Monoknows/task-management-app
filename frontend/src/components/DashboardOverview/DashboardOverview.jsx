import React, { useState, useEffect } from "react";

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

  const upcomingTasks = tasks.filter((t) => !t.is_completed).slice(0, 3);

  const recentActivity = [...tasks].sort((a, b) => b.id - a.id).slice(0, 4);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const dbLabel =
    {
      connected: " Connected",
      connecting: " Connecting…",
      error: " Connection failed",
    }[dbStatus] || " Connecting…";

  const dbColors = {
    connected: { bg: "#ECFDF5", text: "#065F46" },
    connecting: { bg: "#FFFBEB", text: "#92400E" },
    error: { bg: "#FEF2F2", text: "#991B1B" },
  }[dbStatus] || { bg: "#FFFBEB", text: "#92400E" };

  const activityIcon = (task) => {
    if (task.is_completed)
      return { icon: "✓", bg: "var(--accent)", color: "#fff" };
    return {
      icon: "●",
      bg: "color-mix(in srgb, var(--accent) 12%, white)",
      color: "var(--accent)",
    };
  };

  const activityLabel = (task) => {
    if (task.is_completed) return `Task completed`;
    return `Task added`;
  };

  return (
    <div style={styles.container}>
      <header style={styles.headerRow}>
        <div>
          <h1 style={styles.welcomeText}>
            {greeting()}, {user?.fullName?.split(" ")[0] || "there!"}
          </h1>
          <p style={styles.subtext}>
            {pendingTasks > 0
              ? `You have ${pendingTasks} task${pendingTasks !== 1 ? "s" : ""} pending.`
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
      <section style={styles.statsRow}>
        {[
          { icon: "📋", label: "Total Tasks", value: totalTasks, trend: null },
          {
            icon: "✅",
            label: "Completed",
            value: completedTasks,
            trendUp: true,
          },
          {
            icon: "⏳",
            label: "Pending",
            value: pendingTasks,
            trendUp: false,
          },
          {
            icon: "⚡",
            label: "Done Rate",
            value: `${completionRate}%`,
            trend: null,
          },
        ].map(({ icon, label, value, trend, trendUp }) => (
          <div key={label} style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statIconWrap}>{icon}</div>
              {trend && (
                <span
                  style={{
                    ...styles.trendBadge,
                    color: trendUp ? "#059669" : "#DC2626",
                  }}
                >
                  {trendUp ? "↑" : "↓"} {trend}
                </span>
              )}
            </div>
            <div style={styles.statLabel}>{label}</div>
            <div style={styles.statNumber}>{value}</div>
          </div>
        ))}
      </section>

      <section style={styles.splitGrid}>
        <div style={styles.columnLeft}>
          <div style={styles.sectionTitleRow}>
            <h2 style={styles.sectionTitle}>Upcoming Tasks</h2>
            <button onClick={onViewTasks} style={styles.viewAllBtn}>
              View all →
            </button>
          </div>

          <div style={styles.listContainer}>
            {upcomingTasks.length === 0 ? (
              <div style={styles.emptyState}>
                {totalTasks === 0
                  ? "Add your first task to get started."
                  : " All tasks are complete!"}
              </div>
            ) : (
              upcomingTasks.map((task, idx) => (
                <div
                  key={task.id}
                  onClick={() => onViewTask(task)}
                  style={styles.taskRow}
                >
                  <div style={styles.taskRowLeft}>
                    <div style={styles.dragHandle}>⠿</div>
                    <div>
                      <div style={styles.taskRowTitle}>{task.title}</div>
                      {task.description && (
                        <div style={styles.taskRowSub}>
                          {task.description.slice(0, 55)}
                          {task.description.length > 55 ? "…" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={styles.taskRowRight}>
                    <span style={styles.activeBadge}>Active</span>
                    <span style={styles.arrowIcon}>→</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Progress banner */}
          <div style={styles.progressBanner}>
            <div style={styles.progressBannerLeft}>
              <div style={styles.progressBannerTitle}>Overall Progress</div>
              <div style={styles.progressBannerSub}>
                {completedTasks} of {totalTasks} tasks completed
              </div>
              <div style={styles.progressBarTrack}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    width: `${completionRate}%`,
                  }}
                />
              </div>
            </div>
            <div style={styles.progressBannerPercent}>{completionRate}%</div>
          </div>
        </div>

        {/* Right: Recent Activity + Progress ring */}
        <div style={styles.columnRight}>
          {/* Progress Ring */}
          <div style={styles.ringCard}>
            <h2 style={styles.sectionTitle}>Completion</h2>
            <div style={styles.ringWrap}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  fill="none"
                  stroke="color-mix(in srgb, var(--accent) 12%, white)"
                  strokeWidth="11"
                />
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  strokeDashoffset={`${2 * Math.PI * 46 * (1 - completionRate / 100)}`}
                  transform="rotate(-90 55 55)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div style={styles.ringLabel}>
                <span style={styles.ringPercent}>{completionRate}%</span>
                <span style={styles.ringSubtext}>done</span>
              </div>
            </div>
            <div style={styles.ringStats}>
              <div style={styles.ringStat}>
                <span
                  style={{
                    ...styles.ringDot,
                    backgroundColor: "var(--accent)",
                  }}
                />
                <span style={styles.ringStatText}>{completedTasks} done</span>
              </div>
              <div style={styles.ringStat}>
                <span
                  style={{ ...styles.ringDot, backgroundColor: "#E5E7EB" }}
                />
                <span style={styles.ringStatText}>{pendingTasks} left</span>
              </div>
            </div>
          </div>

          <div style={styles.activityCard}>
            <h2 style={styles.sectionTitle}>Recent Activity</h2>
            <div style={styles.activityList}>
              {recentActivity.length === 0 ? (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#9CA3AF",
                    padding: "12px 0",
                  }}
                >
                  No activity yet.
                </div>
              ) : (
                recentActivity.map((task) => {
                  const { icon, bg, color } = activityIcon(task);
                  return (
                    <div key={task.id} style={styles.activityRow}>
                      <div
                        style={{
                          ...styles.activityDot,
                          backgroundColor: bg,
                          color,
                        }}
                      >
                        {icon}
                      </div>
                      <div style={styles.activityContent}>
                        <div style={styles.activityLabel}>
                          <strong>{activityLabel(task)}</strong>
                        </div>
                        <div style={styles.activityTitle}>{task.title}</div>
                      </div>
                    </div>
                  );
                })
              )}
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
    gap: "28px",
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
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  statIconWrap: {
    fontSize: "22px",
    width: "40px",
    height: "40px",
    backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  trendBadge: {
    fontSize: "11px",
    fontWeight: "700",
  },
  statLabel: {
    fontSize: "12px",
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  statNumber: { fontSize: "30px", fontWeight: "800", color: "#111827" },
  // Main grid
  splitGrid: { display: "flex", gap: "24px", width: "100%", flexWrap: "wrap" },
  columnLeft: {
    flex: 1.7,
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  columnRight: {
    flex: 1,
    minWidth: "230px",
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
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
  },
  listContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  taskRow: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  taskRowLeft: { display: "flex", alignItems: "center", gap: "12px" },
  dragHandle: {
    color: "#D1D5DB",
    fontSize: "16px",
    cursor: "grab",
    userSelect: "none",
  },
  taskRowTitle: { fontWeight: "600", color: "#111827", fontSize: "14px" },
  taskRowSub: { fontSize: "12px", color: "#9CA3AF", marginTop: "2px" },
  taskRowRight: { display: "flex", alignItems: "center", gap: "10px" },
  activeBadge: {
    backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
    color: "var(--accent)",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "20px",
  },
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
  // Progress banner
  progressBanner: {
    backgroundColor: "var(--accent)",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },
  progressBannerLeft: { flex: 1 },
  progressBannerTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    marginBottom: "4px",
  },
  progressBannerSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: "13px",
    marginBottom: "12px",
  },
  progressBarTrack: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: "99px",
    height: "6px",
    overflow: "hidden",
  },
  progressBarFill: {
    backgroundColor: "#fff",
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.6s ease",
  },
  progressBannerPercent: {
    color: "#fff",
    fontSize: "36px",
    fontWeight: "800",
    flexShrink: 0,
  },
  // Ring card
  ringCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
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
  ringPercent: { fontSize: "20px", fontWeight: "800", color: "#111827" },
  ringSubtext: { fontSize: "11px", color: "#9CA3AF", fontWeight: "500" },
  ringStats: { display: "flex", gap: "16px" },
  ringStat: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
  },
  ringDot: { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0 },
  ringStatText: { color: "#6B7280" },
  // Activity card
  activityCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  activityList: { display: "flex", flexDirection: "column", gap: "12px" },
  activityRow: { display: "flex", alignItems: "flex-start", gap: "12px" },
  activityDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  activityContent: { flex: 1 },
  activityLabel: { fontSize: "12px", color: "#6B7280", marginBottom: "2px" },
  activityTitle: { fontSize: "13px", fontWeight: "600", color: "#111827" },
};
