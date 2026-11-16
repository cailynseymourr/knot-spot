import { useEffect, useRef } from "react";

// A purple in-app replacement for the browser's "localhost:3000 says" popup.
// Usage: <ConfirmDialog open={...} title="..." message="..." onConfirm={...} onCancel={...} />
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel
}) {
  const cancelButton = useRef(null);
  const cancelHandler = useRef(onCancel);
  cancelHandler.current = onCancel;

  // When it opens: focus the safe button, and let Escape close it
  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") cancelHandler.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="dialog-title">{title}</h2>
        <p id="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button
            ref={cancelButton}
            className="btn btn-secondary btn-small"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="btn btn-danger btn-small" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;