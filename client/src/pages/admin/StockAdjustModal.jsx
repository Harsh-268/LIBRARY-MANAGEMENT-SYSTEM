import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal.jsx";
import { updateBookStock } from "../../services/book.service.js";

const StockAdjustModal = ({ isOpen, onClose, book, onUpdated }) => {
  const [newTotal, setNewTotal] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (book) setNewTotal(String(book.totalCopies));
  }, [book]);

  if (!isOpen || !book) return null;

  const issuedCopies = book.totalCopies - book.availableCopies;
  const parsedTotal = Number(newTotal);
  const delta = parsedTotal - book.totalCopies;

  const isValid =
    newTotal !== "" &&
    Number.isInteger(parsedTotal) &&
    parsedTotal >= issuedCopies;

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!isValid || delta === 0) return;
    setIsSaving(true);
    try {
      const updated = await updateBookStock(book._id, delta);
      toast.success("Stock updated");
      onUpdated(updated);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update stock");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Update Stock"
      subtitle={book.title}
      onClose={handleClose}
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Currently <span className="font-medium text-gray-900 dark:text-gray-100">{book.availableCopies}</span> of{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">{book.totalCopies}</span> copies available
          {issuedCopies > 0 && (
            <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {issuedCopies} {issuedCopies === 1 ? "copy is" : "copies are"} currently issued out
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            New total copies
          </label>
          <input
            type="number"
            min={issuedCopies}
            value={newTotal}
            onChange={(e) => setNewTotal(e.target.value)}
            disabled={isSaving}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-800"
            autoFocus
          />
          {!isValid && newTotal !== "" && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Can't go below {issuedCopies} — that many copies are currently issued out.
            </p>
          )}
          {isValid && delta !== 0 && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {delta > 0 ? `+${delta}` : delta} compared to current stock
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSaving || !isValid || delta === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-md disabled:opacity-60"
          >
            {isSaving ? "Updating..." : "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StockAdjustModal;