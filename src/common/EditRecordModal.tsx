import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "./EditRecordModal.css";

interface EditRecordModalProps {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  children: React.ReactNode;
}

export default function EditRecordModal({
  isOpen,
  title,
  onCancel,
  onSave,
  isSaving = false,
  children,
}: EditRecordModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="edit-modal-backdrop"
      role="presentation"
      data-testid="edit-modal-backdrop"
      onClick={onCancel}
    >
      <div
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-testid="edit-modal"
        onClick={event => event.stopPropagation()}
      >
        <div className="edit-modal-header">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="edit-modal-title-icon"
            aria-hidden="true"
          />
          <h2 className="edit-modal-title">{title}</h2>
        </div>
        <div className="edit-modal-content">{children}</div>
        <div className="edit-modal-actions">
          <button
            type="button"
            className="edit-modal-button cancel-button"
            onClick={onCancel}
            disabled={isSaving}
            data-testid="edit-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            className="edit-modal-button save-button"
            onClick={onSave}
            disabled={isSaving}
            data-testid="edit-save"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
