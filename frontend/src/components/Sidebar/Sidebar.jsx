// Props from App.jsx:
//   user  — { id, fullName, email, workspace } — real data from backend
//   onLogout — clears state and localStorage

export default function Sidebar({ user, onLogout }) {
  // Build initials from the real user.fullName
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>Task Manager</div>

      {/* Nav — single-page app, navigation is handled in App.jsx */}
      <nav style={styles.nav}>
        <div style={styles.navItemActive}>
          <span style={styles.navIcon}>✓</span> Tasks
        </div>
      </nav>

      {/* Real user info from backend */}
      <div style={styles.userBlock}>
        <div style={styles.avatar}>{getInitials(user?.fullName)}</div>
        <div style={styles.userInfo}>
          {/* user.fullName comes from backend's full_name field */}
          <div style={styles.userName} title={user?.fullName}>
            {user?.fullName || "—"}
          </div>
          {/* user.email comes directly from the backend response */}
          <div style={styles.userEmail} title={user?.email}>
            {user?.email || "—"}
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn} title="Sign out">
          ⎋
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    flexShrink: 0,
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #E5E7EB",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    height: "100vh",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: "32px",
    padding: "0 8px",
    letterSpacing: "-0.4px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
  },
  navItemActive: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "default",
  },
  navIcon: {
    fontSize: "14px",
    width: "16px",
    textAlign: "center",
  },
  // ── Real user block ──────────────────────────────────────────────────────────
  userBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingTop: "16px",
    borderTop: "1px solid #E5E7EB",
    marginTop: "auto",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
    flexShrink: 0,
    // Color is derived from user initials — always reflects real name
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontWeight: "600",
    fontSize: "13px",
    color: "#111827",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userEmail: {
    fontSize: "11px",
    color: "#9CA3AF",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginTop: "1px",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#9CA3AF",
    padding: "4px",
    flexShrink: 0,
    lineHeight: 1,
  },
};
