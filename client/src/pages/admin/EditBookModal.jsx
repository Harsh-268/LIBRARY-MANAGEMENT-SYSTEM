import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "../../components/common/Modal.jsx";
import {updateBookDetails,}from "../../services/book.service.js";

const EditBookModal = ({ isOpen, onClose, book, onUpdated }) => {
  const [form, setForm] = useState({ title: "", authors: "", description: "", thumbnail: "", category: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Re-sync from the book prop each time the modal opens (or a different
  // row is clicked) — same pattern as other modal inputs in the app.
  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        authors: (book.authors || []).join(", "),
        description: book.description || "",
        thumbnail: book.thumbnail || "",
        category: book.category || "",
      });
    }
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await updateBookDetails(book._id, {
        title: form.title,
        authors: form.authors.split(",").map((a) => a.trim()).filter(Boolean),
        description: form.description,
        thumbnail: form.thumbnail,
        category: form.category,
      });
      toast.success("Book updated successfully");
      onUpdated(updated);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update book");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Authors (comma separated)</label>
          <input name="authors" value={form.authors} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail URL</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBookModal;