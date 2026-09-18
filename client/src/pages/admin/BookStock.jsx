import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  searchLibraryBooks,
  getAllBooks,
  updateBookStock,
  deleteBookFromLibrary,
} from "../../services/book.service.js";
import EditBookModal from "../admin/EditBookModal.jsx";
import StockAdjustModal from "../admin/StockAdjustModal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import AddBookModal from "../../components/admin/AddBookModal.jsx";

const BookStock = () => {
  const [books, setBooks] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [stockBook, setStockBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce the search box before it drives a fetch
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setQuery(searchInput.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      setLoading(true);
      setError(false);
      try {
        const result = query
          ? await searchLibraryBooks(query, { page, limit: 10 })
          : await getAllBooks({ page, limit: 10 });

        if (!ignore) {
          setBooks(result.books);
          setMetadata(result.metadata);
        }
      } catch (err) {
        console.error("Failed to fetch books", err);
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchBooks();
    return () => {
      ignore = true;
    };
  }, [page, query]);

  const handleBookAdded = () => {
    setSearchInput("");
    setQuery("");
    setPage(1);
  };

  const patchBookInState = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) =>
        b._id === updatedBook._id ? { ...b, ...updatedBook } : b,
      ),
    );
  };

  // const adjustStock = async (book, delta) => {
  //   try {
  //     const updated = await updateBookStock(book._id, delta);
  //     patchBookInState(updated);
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Failed to adjust stock");
  //   }
  // };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    setIsDeleting(true);
    try {
      await deleteBookFromLibrary(deletingBook._id);
      toast.success("Book deleted");
      setBooks((prev) => prev.filter((b) => b._id !== deletingBook._id));
      setDeletingBook(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Stock</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Add Book
        </button>
      </div>

      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by title, author, or ISBN..."
        className="w-full max-w-md mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-3">Book</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">ISBN</th>
              <th className="text-left px-5 py-3">Stock</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                  Loading books...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-red-500">
                  Unable to load books.
                </td>
              </tr>
            )}
            {!loading && !error && books.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-gray-400">
                  No books found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              books.map((book) => (
                <tr key={book._id} className="border-t border-gray-100">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          book.thumbnail ||
                          "https://via.placeholder.com/40x56?text=—"
                        }
                        alt=""
                        className="w-8 h-11 object-cover rounded-sm bg-gray-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {(book.authors || []).join(", ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {book.category || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                    {book.isbn}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">
                        {book.availableCopies}/{book.totalCopies}
                      </span>
                      <button
                        onClick={() => setStockBook(book)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Edit Stock
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Edit book"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487 18.55 2.8a2.06 2.06 0 1 1 2.914 2.914l-1.688 1.688m-3.914-1.913L4.72 16.63a2 2 0 0 0-.53.96l-.77 3.36a.5.5 0 0 0 .6.6l3.36-.77a2 2 0 0 0 .96-.53L19.487 8.401m-3.914-1.913 3.914 1.913"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingBook(book)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete book"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 7h12M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2m-8 0 .8 12a2 2 0 0 0 2 1.9h4.4a2 2 0 0 0 2-1.9L18 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {metadata && metadata.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>
              Page {metadata.currentPage} of {metadata.totalPages} (
              {metadata.totalItems} books)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!metadata.hasPrevPage}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!metadata.hasNextPage}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <EditBookModal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        book={editingBook}
        onUpdated={patchBookInState}
      />
      <StockAdjustModal
        isOpen={!!stockBook}
        onClose={() => setStockBook(null)}
        book={stockBook}
        onUpdated={patchBookInState}
      />
      <ConfirmDialog
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this book?"
        message={`"${deletingBook?.title}" will be permanently removed. This can't be undone, and it'll fail if any copies are currently issued.`}
        confirmLabel="Delete"
        danger
        isLoading={isDeleting}
      />
      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={handleBookAdded}
      />
    </div>
  );
};

export default BookStock;
