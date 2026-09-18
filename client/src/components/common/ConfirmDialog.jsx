import React from "react";
import Modal from "./Modal.jsx";

/**
 * Reusable yes/no confirmation dialog, built on top of Modal.
 *
 * <ConfirmDialog
 *   isOpen={!!deletingBook}
 *   onClose={() => setDeletingBook(null)}
 *   onConfirm={handleDeleteConfirm}
 *   title="Delete this book?"
 *   message="This can't be undone."
 *   confirmLabel="Delete"
 *   danger
 *   isLoading={isDeleting}
 * />
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal title={title} onClose={onClose} maxWidth="sm">
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium text-white rounded-md disabled:opacity-60 ${
            danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Please wait..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;