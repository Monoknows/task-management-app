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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
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
    // Pass real credentials up to App.jsx which POSTs to /auth/sync
    await onLoginSuccess({
      fullName: isSignUp ? fullName.trim() : email.split("@")[0],
      email: email.trim(),
      password: password,
    });
    setIsSubmitting(false);
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

        {/* Error */}
        {displayError && <div style={styles.errorBox}>{displayError}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                type="text"
                placeholder="Jane Smith"
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
              placeholder="jane@example.com"
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

        {/* Toggle */}
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
    color: "#4F46E5",
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
    backgroundColor: "#4F46E5",
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
    color: "#4F46E5",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
