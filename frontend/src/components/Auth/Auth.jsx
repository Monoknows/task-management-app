import { useState } from "react";

// Props:
//   onLoginSuccess({ fullName, email, password }) — called with raw form data
//   App.jsx handles the actual /auth/sync fetch and sets user state
//   apiError — any backend error string passed down from App.jsx
export default function Auth({ onLoginSuccess, apiError }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successName, setSuccessName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email.trim() || !password.trim()) {
      setLocalError("Email and password are required.");
      return;
    }
    if (isSignUp && !fullName.trim()) {
      setLocalError("Full name is required.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    if (isSignUp) {
      // For sign-up: call backend, then show success popup before switching to sign-in
      const result = await onLoginSuccess({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password,
        isSignUp: true,
      });
      setIsSubmitting(false);

      // If no error returned (success), show the popup
      if (!result?.error) {
        setSuccessName(fullName.trim().split(" ")[0]);
        setShowSuccessPopup(true);
      }
    } else {
      await onLoginSuccess({
        fullName: email.split("@")[0],
        email: email.trim(),
        password: password,
        isSignUp: false,
      });
      setIsSubmitting(false);
    }
  };

  const handlePopupContinue = () => {
    setShowSuccessPopup(false);
    setIsSignUp(false);
    setLocalError("");
    setFullName("");
    setPassword("");
  };

  const switchMode = () => {
    setIsSignUp((prev) => !prev);
    setLocalError("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  const displayError = localError || apiError;

  return (
    <div style={styles.page}>
      {showSuccessPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <div style={styles.popupIcon}>Congratulations!</div>
            <h2 style={styles.popupTitle}>Account created!</h2>
            <p style={styles.popupBody}>
              Welcome, <strong>{successName}</strong>! Your account has been
              successfully created. Sign in to start managing your tasks.
            </p>
            <button onClick={handlePopupContinue} style={styles.popupBtn}>
              Continue to sign in
            </button>
          </div>
        </div>
      )}

      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>Task Manager</div>
        <h2 style={styles.heading}>
          {isSignUp ? "Create an account" : "Welcome back"}
        </h2>
        <p style={styles.subheading}>
          {isSignUp
            ? "Sign up to start managing your tasks."
            : "Sign in to access your task dashboard."}
        </p>

        {displayError && <div style={styles.errorBox}>{displayError}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                placeholder="Juan Dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.input}
                autoComplete="name"
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              type="email"
              placeholder="juan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          <button
            type="submit"
            style={{ ...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1 }}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait…"
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p style={styles.toggle}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={switchMode} style={styles.toggleLink}>
            {isSignUp ? "Sign in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Inter", -apple-system, sans-serif',
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: "420px",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },
  brand: {
    fontSize: "22px",
    fontWeight: "800",
    color: "var(--accent)",
    textAlign: "center",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  },
  heading: {
    margin: "0 0 6px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  subheading: {
    margin: "0 0 24px 0",
    fontSize: "14px",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: "1.5",
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#B91C1C",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
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
    transition: "border-color 0.15s",
  },
  submitBtn: {
    backgroundColor: "var(--accent)",
    color: "#FFFFFF",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "4px",
    transition: "background-color 0.15s",
  },
  toggle: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6B7280",
  },
  toggleLink: {
    color: "var(--accent)",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },

  popupOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(17,24,39,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "16px",
  },
  popup: {
    backgroundColor: "#FFFFFF",
    borderRadius: "20px",
    padding: "40px 36px",
    maxWidth: "380px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
    animation: "fadeInUp 0.3s ease",
  },
  popupIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    display: "block",
  },
  popupTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 12px 0",
  },
  popupBody: {
    fontSize: "15px",
    color: "#6B7280",
    lineHeight: "1.6",
    margin: "0 0 28px 0",
  },
  popupBtn: {
    backgroundColor: "var(--accent)",
    color: "#FFFFFF",
    border: "none",
    padding: "13px 28px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    width: "100%",
  },
};
