import React, { useState } from "react";

export default function SettingsView({ user }) {
  const [fullName, setFullName] = useState(user?.fullName || "Alex Rivera");
  const [email, setEmail] = useState(
    user?.email || "alex.rivera@taskmaster.pro",
  );
  const [workspace, setWorkspace] = useState(
    user?.workspace || "Pro Workspace",
  );
  const [saveStatus, setSaveStatus] = useState("");

  // Natively functional notification state switches
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [reminders, setReminders] = useState(false);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setSaveStatus("Saving data parameters...");
    setTimeout(() => {
      setSaveStatus("✅ Changes compiled and saved successfully local-side!");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 800);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtext}>
          Manage your account preferences and workspace configuration.
        </p>
      </header>

      {saveStatus && <div style={styles.statusToast}>{saveStatus}</div>}

      <div style={styles.settingsGrid}>
        {/* CARD 1: Profile Modifications */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👤 Profile Information</h2>
          <div style={styles.profileRow}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatarPlaceholder}>
                <span>
                  {fullName
                    ? fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveChanges} style={styles.formGroupFlex}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
              />

              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <button type="submit" style={styles.saveBtn}>
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* CARD 2: Workspace Selection */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏢 Workspace</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Workspace Name</label>
            <input
              type="text"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
              style={styles.input}
            />

            <label style={styles.label}>Brand Identity Color Selection</label>
            <div style={styles.colorRow}>
              <div
                style={{
                  ...styles.colorCircle,
                  backgroundColor: "#4F46E5",
                  border: "2px solid #111827",
                }}
              ></div>
              <div
                style={{ ...styles.colorCircle, backgroundColor: "#3B82F6" }}
              ></div>
              <div
                style={{ ...styles.colorCircle, backgroundColor: "#10B981" }}
              ></div>
              <div
                style={{ ...styles.colorCircle, backgroundColor: "#DC2626" }}
              ></div>
            </div>
          </div>
        </div>

        {/* CARD 3: Notification Checkboxes */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔔 Notifications</h2>
          <div style={styles.toggleRowList}>
            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>Email Alerts</div>
                <div style={styles.toggleSub}>
                  Get daily summaries of your tasks
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                style={styles.checkboxToggle}
              />
            </div>

            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>Push Notifications</div>
                <div style={styles.toggleSub}>
                  Real-time alerts on desktop & mobile
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushNotif}
                onChange={() => setPushNotif(!pushNotif)}
                style={styles.checkboxToggle}
              />
            </div>

            <div style={styles.toggleRow}>
              <div>
                <div style={styles.toggleLabel}>Task Reminders</div>
                <div style={styles.toggleSub}>
                  Remind me before a task is due
                </div>
              </div>
              <input
                type="checkbox"
                checked={reminders}
                onChange={() => setReminders(!reminders)}
                style={styles.checkboxToggle}
              />
            </div>
          </div>
        </div>

        {/* CARD 4: Security Management Actions */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔒 Security</h2>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              value="hiddenpasswords"
              readOnly
              style={{
                ...styles.input,
                backgroundColor: "#F3F4F6",
                color: "#9CA3AF",
              }}
            />

            <label style={styles.label}>New Password String</label>
            <input
              type="password"
              placeholder="Enter new validation sequence..."
              style={styles.input}
            />

            <button
              onClick={() =>
                alert(
                  "Password reset requires an active mock validation system setup.",
                )
              }
              style={styles.securityBtn}
            >
              Update Password
            </button>

            <div style={styles.dangerZone}>
              <div style={styles.dangerTitle}>Danger Zone</div>
              <button
                onClick={() => alert("Deactivation protocol halted safely.")}
                style={styles.deactivateBtn}
              >
                Deactivate Account Context
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    textAlign: "left",
    boxSizing: "border-box",
  },
  header: { display: "flex", flexDirection: "column", gap: "4px" },
  title: { fontSize: "32px", fontWeight: "800", color: "#111827", margin: 0 },
  subtext: { color: "#6B7280", margin: 0, fontSize: "15px" },
  statusToast: {
    backgroundColor: "#ECFDF5",
    color: "#065F46",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "1px solid #A7F3D0",
    fontWeight: "600",
  },
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    width: "100%",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 20px 0",
  },
  profileRow: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  avatarContainer: { width: "80px", height: "80px" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    backgroundColor: "#EEDCC5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#7C2D12",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  formGroupFlex: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
    minWidth: "250px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#4B5563",
    marginTop: "8px",
  },
  input: {
    padding: "10px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "16px",
    alignSelf: "flex-start",
  },
  colorRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "4px",
  },
  colorCircle: { width: "32px", height: "32px", borderRadius: "50%" },
  toggleRowList: { display: "flex", flexDirection: "column", gap: "16px" },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: "16px",
    borderRadius: "8px",
    border: "1px solid #F3F4F6",
  },
  toggleLabel: { fontWeight: "600", fontSize: "14px", color: "#111827" },
  toggleSub: { fontSize: "12px", color: "#6B7280", marginTop: "2px" },
  checkboxToggle: {
    width: "20px",
    height: "20px",
    accentColor: "#4F46E5",
    cursor: "pointer",
  },
  securityBtn: {
    backgroundColor: "#4B5563",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
    alignSelf: "flex-start",
  },
  dangerZone: {
    borderTop: "1px solid #E5E7EB",
    marginTop: "24px",
    paddingTop: "16px",
  },
  dangerTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: "8px",
  },
  deactivateBtn: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    border: "1px solid #FCA5A5",
    color: "#991B1B",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
