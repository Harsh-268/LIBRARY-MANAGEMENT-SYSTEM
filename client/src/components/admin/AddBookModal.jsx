import React, { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal.jsx";
import {searchBooksByISBN,addBookToLibrary} from "../../services/book.service.js";

const emptyForm = {
  title: "", authors: "", isbn: "", description: "",
  thumbnail: "", category: "", pageCount: "", totalCopies: 1,
};

const AddBookModal = ({ isOpen, onClose, onAdded }) => {
  const [isbnInput, setIsbnInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [results, setResults] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setIsbnInput("");
    setIsSearching(false);
    setSearchError(null);
    setResults(null);
    setForm(emptyForm);
    setShowForm(false);
    setIsSaving(false);
    onClose();
  };

  const handleLookup = async () => {
    if (!isbnInput.trim()) {
      toast.error("Enter an ISBN to look up");
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setResults(null);
    try {
      const matches = await searchBooksByISBN(isbnInput.trim());
      setResults(matches);
    } catch (error) {
      setSearchError(error.response?.data?.message || "No book found for that ISBN");
    } finally {
      setIsSearching(false);
    }
  };

  const selectResult = (result) => {
    setForm({
      title: result.title || "",
      authors: (result.authors || []).join(", "),
      isbn: result.isbn || isbnInput.trim(),
      description: result.description || "",
      thumbnail: result.thumbnail || "",
      category: result.category || "",
      pageCount: result.pageCount ? String(result.pageCount) : "",
      totalCopies: 1,
    });
    setShowForm(true);
  };

  const enterManually = () => {
    setForm({ ...emptyForm, isbn: isbnInput.trim() });
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authorsArray = form.authors.split(",").map((a) => a.trim()).filter(Boolean);
    if (authorsArray.length === 0) {
      toast.error("At least one author is required");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        authors: authorsArray,
        isbn: form.isbn.trim(),
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim(),
        category: form.category.trim(),
        pageCount: Number(form.pageCount),
        totalCopies: Number(form.totalCopies),
      };
      const book = await addBookToLibrary(payload);
      toast.success("Book added to library");
      onAdded(book);
      resetAndClose();
    } catch (error) {
      // validate.middleware returns { message, errors: [{ field, message }] }
      const message = error.response?.data?.errors?.[0]?.message
        || error.response?.data?.message
        || "Failed to add book";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Add Book"
      subtitle={showForm ? "Review the details before saving" : "Look up by ISBN, or enter details manually"}
      onClose={resetAndClose}
      maxWidth="lg"
    >
      {!showForm && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={isbnInput}
              onChange={(e) => setIsbnInput(e.target.value)}
              placeholder="e.g. 9780132350884"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
            <button
              type="button"
              onClick={handleLookup}
              disabled={isSearching}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md disabled:opacity-60"
            >
              {isSearching ? "Searching..." : "Look Up"}
            </button>
          </div>

          {searchError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {searchError}
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectResult(result)}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 text-left transition-colors"
                >
                  <img
                    src={result.thumbnail || "https://via.placeholder.com/40x56?text=—"}
                    alt=""
                    className="w-10 h-14 object-cover rounded-sm bg-gray-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {(result.authors || []).join(", ") || "Unknown author"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="text-center pt-1">
            <button type="button" onClick={enterManually} className="text-xs text-blue-600 hover:underline">
              Skip lookup, enter details manually
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Authors (comma separated)</label>
              <input name="authors" value={form.authors} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <input name="category" value={form.category} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Page Count</label>
              <input type="number" min={1} name="pageCount" value={form.pageCount} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail URL</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Total Copies</label>
            <input type="number" min={1} name="totalCopies" value={form.totalCopies} onChange={handleFormChange} className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm" required />
            <p className="mt-1 text-xs text-gray-400">
              If this ISBN already exists in the library, this amount is added to its current stock instead of creating a duplicate.
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:underline">
              &larr; Back
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={resetAndClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60">
                {isSaving ? "Saving..." : "Add Book"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddBookModal;