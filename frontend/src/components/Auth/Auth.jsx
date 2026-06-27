import React, { useState } from "react";

// 1. Destructured onloginSuccess prop so the component can actually use it
export default function Auth({ onloginSuccess }) {
  // Set default to true so it opens up directly into the Create Account view
  const [isSignUp, setIsSignUp] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation rules checking inputs cleanly
    if (!email.trim() || !password.trim() || (isSignUp && !fullName.trim())) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      // 2. Direct connection network payload pointing to your FastAPI backend
      const response = await fetch("http://localhost:8000/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          full_name: isSignUp ? fullName.trim() : email.split("@")[0], // Maps to Python's snake_case schema requirement
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Authentication synchronization failed.",
        );
      }

      const backendUser = await response.json();

      // Pass the fully authenticated database entity up to the core application state
      if (onloginSuccess) {
        onloginSuccess(backendUser);
      }
    } catch (err) {
      setError(err.message || "Something went wrong connecting to the server.");
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.authCard}>
        <div style={styles.brandTitle}>Task Manager</div>
        <h2 style={styles.formHeading}>
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p style={styles.formSubheading}>
          {isSignUp
            ? "Sign up to manage your daily tasks"
            : "Sign in to access your task dashboard"}
        </p>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* 3. Conditional Input field for Full Name block built out safely */}
          {isSignUp && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={styles.inputField}
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputField}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputField}
            />
          </div>
          <button type="submit" style={styles.submitButton}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div style={styles.toggleFooter}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}{" "}
          <span
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setFullName("");
            }}
            style={styles.toggleLink}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  authContainer: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Inter", sans-serif',
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 2000,
  },
  authCard: {
    backgroundColor: "#FFFFFF",
    width: "400px",
    borderRadius: "16px",
    padding: "40px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  brandTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#4F46E5",
    textAlign: "center",
    marginBottom: "24px",
    letterSpacing: "-0.5px",
  },
  formHeading: {
    margin: "0 0 8px 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  formSubheading: {
    margin: "0 0 24px 0",
    fontSize: "14px",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: "1.5",
  },
  errorMessage: {
    backgroundColor: "#FEF2F2",
    border: "1px solid #FCA5A5",
    color: "#B91C1C",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    fontWeight: "500",
  },
  formGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "13px",
    color: "#374151",
  },
  inputField: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "14px",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  toggleFooter: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#4B5563",
  },
  toggleLink: {
    color: "#4F46E5",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
