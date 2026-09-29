import React from "react";
import Modal from "../common/Modal";

const ConfirmDialog = ({
  isOpen=true,
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
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium rounded-md text-white disabled:opacity-50 ${
            danger
              ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
          }`}
        >
          {isLoading ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;