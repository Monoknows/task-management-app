import { useState, useEffect } from "react";

// Props from App.jsx:
//   task     — null (create mode) or full task object (edit mode)
//   onClose  — closes modal
//   onSubmit({ title, description }) — App.jsx does the POST or PUT

export default function TaskModal({ task, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when editing a real task
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
    setTitleError("");
  }, [task]);

  const validateTitle = (val) => {
    if (!val.trim()) return "Title is required.";
    if (val.trim().length < 3) return "Title must be at least 3 characters.";
    return "";
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (titleError) setTitleError(validateTitle(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateTitle(title);
    if (err) {
      setTitleError(err);
      return;
    }

    setIsSubmitting(true);
    // Sends { title, description } to App.jsx which does the actual fetch
    await onSubmit({ title: title.trim(), description: description.trim() });
    setIsSubmitting(false);
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{task ? "Edit task" : "New task"}</h2>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Editing indicator — shows the real task id */}
        {task && <p style={styles.editingNote}>Editing task #{task.id}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Title */}
          <div style={styles.field}>
            <label style={styles.label}>Title *</label>
            <input
              type="text"
              placeholder="e.g. Review project proposal"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={titleError ? styles.inputError : styles.input}
              autoFocus
            />
            {titleError && <span style={styles.errorText}>{titleError}</span>}
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>
              Description <span style={styles.optional}>(optional)</span>
            </label>
            <textarea
              placeholder="Add details about this task…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={styles.textarea}
            />
          </div>

          {/* Footer actions */}
          <div style={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.saveBtn,
                opacity: isSubmitting || !title.trim() ? 0.6 : 1,
                cursor:
                  isSubmitting || !title.trim() ? "not-allowed" : "pointer",
              }}
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(17,24,39,0.45)",
    backdropFilter: "blur(3px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#111827",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#9CA3AF",
    padding: "4px",
    lineHeight: 1,
  },
  editingNote: {
    margin: "0 0 20px 0",
    fontSize: "12px",
    color: "#9CA3AF",
    fontFamily: "monospace",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "24px",
  },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  optional: { fontWeight: "400", color: "#9CA3AF" },
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
  inputError: {
    padding: "10px 14px",
    border: "1px solid #EF4444",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    backgroundColor: "#FEF2F2",
    boxSizing: "border-box",
    width: "100%",
  },
  errorText: {
    fontSize: "12px",
    color: "#EF4444",
    fontWeight: "500",
  },
  textarea: {
    padding: "10px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
    width: "100%",
    minHeight: "100px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "8px",
  },
  cancelBtn: {
    backgroundColor: "#FFFFFF",
    color: "#374151",
    border: "1px solid #D1D5DB",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "opacity 0.15s",
  },
};
