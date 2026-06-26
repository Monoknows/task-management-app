import React, { useState, useEffect } from "react";

export default function TaskModal({ task, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (val.trim() && val.length < 5) {
      setTitleError("Title must be at least 5 characters long.");
    } else {
      setTitleError("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || title.length < 5) {
      setTitleError("Title must be at least 5 characters long.");
      return;
    }
    onSubmit({ title, description });
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBody}>
        <div style={styles.modalHeader}>
          <h2 style={{ margin: 0 }}>
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose} style={styles.closeModalBtn}>
            ✕
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Task Title</label>
            <input
              type="text"
              placeholder="e.g., Complete Q3 System Architecture Audit"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={titleError ? styles.inputInvalid : styles.inputField}
            />
            {titleError && <div style={styles.errorText}>⚠️ {titleError}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Add some details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              style={styles.textareaField}
            />
          </div>

          <div style={styles.modalFooterActions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!titleError || !title.trim()}
              style={styles.saveBtn}
            >
              {task ? "Save Changes" : "Save Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(17, 24, 39, 0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBody: {
    backgroundColor: "#FFFFFF",
    width: "500px",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  closeModalBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#9CA3AF",
  },
  formGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
  },
  inputField: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    boxSizing: "border-box",
    outline: "none",
  },
  inputInvalid: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #EF4444",
    boxSizing: "border-box",
    backgroundColor: "#FEF2F2",
  },
  textareaField: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #D1D5DB",
    boxSizing: "border-box",
    resize: "vertical",
    outline: "none",
  },
  errorText: {
    color: "#EF4444",
    fontSize: "12px",
    marginTop: "6px",
    fontWeight: "500",
  },
  modalFooterActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "28px",
  },
  cancelBtn: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #D1D5DB",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    color: "#374151",
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
  },
};
