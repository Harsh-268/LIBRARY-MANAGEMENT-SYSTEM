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
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium rounded-md text-white disabled:opacity-50 ${
            danger
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-900 hover:bg-gray-800"
          }`}
        >
          {isLoading ? "Deleting..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;