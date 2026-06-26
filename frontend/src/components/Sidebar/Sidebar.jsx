import React from "react";

export default function Sidebar() {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>Task Manager</div>
      <nav style={styles.navMenu}>
        <div style={styles.navItemInactive}>Dashboard</div>
        <div style={styles.navItemActive}>Tasks</div>
        <div style={styles.navItemInactive}>Settings</div>
      </nav>
      <div style={styles.userProfile}>
        <div style={styles.userInitials}>{getInitials(user?.fullName)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.userName} title={user?.fullName}>
            {user?.fullName}
          </div>
          <div style={styles.userSub}>{user?.workspace || "Pro Workspace"}</div>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn} title="Sign Out">
          Logout
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #E5E7EB",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    boxSizing: "border-box",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: "32px",
    letterSpacing: "-0.5px",
  },
  navMenu: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  navItemActive: {
    padding: "12px 16px",
    backgroundColor: "#EEF2F6",
    color: "#4F46E5",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  navItemInactive: {
    padding: "12px 16px",
    color: "#4B5563",
    borderRadius: "8px",
    cursor: "pointer",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingTop: "16px",
    borderTop: "1px solid #E5E7EB",
    width: "100%",
  },
  userInitials: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#E0E7FF",
    color: "#4F46E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    flexShrink: 0,
  },
  userName: {
    fontWeight: "bold",
    fontSize: "14px",
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userSub: {
    fontSize: "12px",
    color: "#6B7280",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
    borderRadius: "4px",
    color: "#9CA3AF",
  },
};
