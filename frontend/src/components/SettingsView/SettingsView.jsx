import { useState, useRef } from "react";

// Props from App.jsx:
//   user                — { id, fullName, email, workspace, accentColor, avatarUrl }
//   onUpdatePreferences — async ({ accent_color?, avatar_url?, full_name? }) => { success } | { error }

const API_URL = "http://127.0.0.1:8000";

const ACCENT_OPTIONS = [
  { label: "Indigo", value: "#4F46E5" },
  { label: "Emerald", value: "#059669" },
  { label: "Rose", value: "#E11D48" },
  { label: "Amber", value: "#D97706" },
  { label: "Sky", value: "#0284C7" },
  { label: "Violet", value: "#7C3AED" },
];

const MAX_AVATAR_BYTES = 1_500_000; // ~1.5MB before base64 inflation

export default function SettingsView({ user, onUpdatePreferences }) {
  // ── Draft state for appearance — only committed to the account on Save ──────
  const [draftAccent, setDraftAccent] = useState(
    user?.accentColor || "#4F46E5",
  );
  const [draftAvatar, setDraftAvatar] = useState(user?.avatarUrl || null);
  const [avatarError, setAvatarError] = useState("");
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState("");
  const fileInputRef = useRef(null);

  const hasUnsavedChanges =
    draftAccent !== (user?.accentColor || "#4F46E5") ||
    draftAvatar !== (user?.avatarUrl || null);

  // ── Password form ────────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [isSubmittingPw, setIsSubmittingPw] = useState(false);

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

  // ── Avatar file -> base64 ────────────────────────────────────────────────────
  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Image is too large. Please choose one under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setDraftAvatar(reader.result);
    reader.onerror = () =>
      setAvatarError("Couldn't read that file. Try another image.");
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setDraftAvatar(null);
    setAvatarError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save appearance (accent + avatar) ────────────────────────────────────────
  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    setPrefsSuccess("");
    const result = await onUpdatePreferences({
      accent_color: draftAccent,
      avatar_url: draftAvatar,
    });
    setIsSavingPrefs(false);
    if (!result?.error) {
      setPrefsSuccess("Preferences saved.");
    }
  };

  const handleDiscardChanges = () => {
    setDraftAccent(user?.accentColor || "#4F46E5");
    setDraftAvatar(user?.avatarUrl || null);
    setAvatarError("");
    setPrefsSuccess("");
  };

  // ── Password change ──────────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    setIsSubmittingPw(true);
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(user.id),
        },
        body: JSON.stringify({
          email: user.email,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to update password");
      }

      setPwSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPwError(error.message);
    } finally {
      setIsSubmittingPw(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.headerRow}>
        <h1 style={styles.pageTitle}>Settings</h1>
        <p style={styles.pageSubtitle}>
          Manage your account and personalize the app.
        </p>
      </header>

      <div style={styles.grid}>
        {/* ── Account info ── */}
        <section style={styles.card}>
          <h2 style={styles.cardHeading}>Account</h2>
          <div style={styles.profileRow}>
            {draftAvatar ? (
              <img src={draftAvatar} alt="" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatar}>{getInitials(user?.fullName)}</div>
            )}
            <div>
              <div style={styles.profileName}>{user?.fullName || "—"}</div>
              <div style={styles.profileEmail}>{user?.email || "—"}</div>
            </div>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>User ID</span>
            <strong style={styles.detailValue}>#{user?.id}</strong>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Workspace</span>
            <strong style={styles.detailValue}>{user?.workspace || "—"}</strong>
          </div>
        </section>

        {/* ── Appearance ── */}
        <section style={styles.card}>
          <h2 style={styles.cardHeading}>Appearance</h2>

          <p style={styles.fieldGroupLabel}>Profile picture</p>
          <div style={styles.avatarUploadRow}>
            {draftAvatar ? (
              <img src={draftAvatar} alt="" style={styles.avatarImgLarge} />
            ) : (
              <div style={styles.avatarLarge}>
                {getInitials(user?.fullName)}
              </div>
            )}
            <div style={styles.avatarUploadActions}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={styles.secondaryBtn}
              >
                {draftAvatar ? "Change photo" : "Upload photo"}
              </button>
              {draftAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  style={styles.linkBtn}
                >
                  Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarPick}
                style={{ display: "none" }}
              />
            </div>
          </div>
          {avatarError && (
            <div style={styles.errorTextSmall}>{avatarError}</div>
          )}

          <p style={{ ...styles.fieldGroupLabel, marginTop: "20px" }}>
            Accent color
          </p>
          <div style={styles.swatchRow}>
            {ACCENT_OPTIONS.map(({ label, value }) => {
              const isSelected = draftAccent === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDraftAccent(value)}
                  title={label}
                  style={{
                    ...styles.swatch,
                    backgroundColor: value,
                    boxShadow: isSelected
                      ? `0 0 0 3px #FFFFFF, 0 0 0 5px ${value}`
                      : "none",
                  }}
                  aria-label={`Use ${label} accent color`}
                />
              );
            })}
          </div>

          {/* Save / Discard — only commits to the account on click */}
          <div style={styles.saveRow}>
            {prefsSuccess && !hasUnsavedChanges && (
              <span style={styles.successInline}>{prefsSuccess}</span>
            )}
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                style={styles.cancelBtn}
                disabled={isSavingPrefs}
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={!hasUnsavedChanges || isSavingPrefs}
              style={{
                ...styles.saveBtn,
                backgroundColor: draftAccent,
                opacity: !hasUnsavedChanges || isSavingPrefs ? 0.5 : 1,
                cursor:
                  !hasUnsavedChanges || isSavingPrefs
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isSavingPrefs ? "Saving…" : "Save changes"}
            </button>
          </div>
        </section>

        {/* ── Change password ── */}
        <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
          <h2 style={styles.cardHeading}>Change password</h2>

          {pwError && <div style={styles.errorBox}>{pwError}</div>}
          {pwSuccess && <div style={styles.successBox}>{pwSuccess}</div>}

          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
            </div>
            <div style={styles.fieldRow}>
              <div style={styles.field}>
                <label style={styles.label}>New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  autoComplete="new-password"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingPw}
              style={{
                ...styles.saveBtn,
                alignSelf: "flex-start",
                opacity: isSubmittingPw ? 0.7 : 1,
              }}
            >
              {isSubmittingPw ? "Saving…" : "Update password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  headerRow: { marginBottom: "4px" },
  pageTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
  },
  pageSubtitle: { margin: "4px 0 0 0", color: "#6B7280", fontSize: "14px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    padding: "24px",
    boxSizing: "border-box",
  },
  cardHeading: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
  },
  fieldGroupLabel: {
    margin: "0 0 10px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "16px",
    flexShrink: 0,
  },
  avatarImg: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarLarge: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "color-mix(in srgb, var(--accent) 12%, white)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px",
    flexShrink: 0,
  },
  avatarImgLarge: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarUploadRow: { display: "flex", alignItems: "center", gap: "16px" },
  avatarUploadActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  profileName: { fontWeight: "700", fontSize: "15px", color: "#111827" },
  profileEmail: { fontSize: "13px", color: "#6B7280", marginTop: "2px" },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderTop: "1px solid #F3F4F6",
    fontSize: "14px",
  },
  detailLabel: { color: "#9CA3AF", fontWeight: "500" },
  detailValue: { color: "#111827", fontWeight: "600" },
  swatchRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  swatch: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    transition: "box-shadow 0.15s",
  },
  saveRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #F3F4F6",
  },
  successInline: {
    fontSize: "13px",
    color: "#059669",
    fontWeight: "600",
    marginRight: "auto",
  },
  errorTextSmall: { fontSize: "12px", color: "#EF4444", marginTop: "8px" },
  errorBox: {
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#B91C1C",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  successBox: {
    backgroundColor: "#ECFDF5",
    border: "1px solid #A7F3D0",
    color: "#065F46",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
    minWidth: "200px",
  },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  input: {
    padding: "10px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  saveBtn: {
    color: "#FFFFFF",
    backgroundColor: "var(--accent)",
    border: "none",
    padding: "10px 22px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  cancelBtn: {
    backgroundColor: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  secondaryBtn: {
    backgroundColor: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#B91C1C",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    padding: 0,
  },
};
