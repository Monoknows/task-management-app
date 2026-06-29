// Props from App.jsx:
//   user        — { id, fullName, email, workspace, accentColor, avatarUrl }
//   activeView  — "dashboard" | "tasks" | "settings"
//   onNavigate  — (view) => void
//   onLogout    — clears state and localStorage

export default function Sidebar({ user, activeView, onNavigate, onLogout }) {
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

  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "tasks", icon: "✓", label: "My Tasks" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>Task Manager</div>

      {/* Nav */}
      <nav style={styles.nav}>
        {navItems.map(({ id, icon, label }) => {
          const isActive = activeView === id;
          return (
            <div
              key={id}
              onClick={() => onNavigate(id)}
              style={isActive ? styles.navItemActive : styles.navItem}
            >
              <span style={styles.navIcon}>{icon}</span>
              {label}
            </div>
          );
        })}
      </nav>

      {/* Real user info */}
      <div style={styles.userBlock}>
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" style={styles.avatarImg} />
        ) : (
          <div style={styles.avatar}>{getInitials(user?.fullName)}</div>
        )}
        <div style={styles.userInfo}>
          <div style={styles.userName} title={user?.fullName}>
            {user?.fullName || "—"}
          </div>
          <div style={styles.userEmail} title={user?.email}>
            {user?.email || "—"}
          </div>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn} title="Sign out">
          ⏻️
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
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    minHeight: "100vh",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "800",
    color: "var(--accent)",
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
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    color: "#6B7280",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  navItemActive: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
    color: "var(--accent)",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  navIcon: {
    fontSize: "14px",
    width: "16px",
    textAlign: "center",
  },
  userBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingTop: "16px",
    borderTop: "1px solid #E5E7EB",
    marginTop: "16px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
    flexShrink: 0,
  },
  avatarImg: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
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
