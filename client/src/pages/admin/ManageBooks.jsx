import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Book as BookIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AddBookModal from "../../pages/admin/AddBookModal"; // We will make this next

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/books");
      setBooks(data.data);
    } catch (error) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success("Book deleted");
      fetchBooks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Inventory</h1>
          <p className="text-gray-500 text-sm">Add, update, or remove books from your collection.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all font-semibold"
        >
          <Plus size={20} /> Add New Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Search by title or ISBN..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Book Details</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ISBN</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredBooks.map((book) => (
              <tr key={book._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={book.thumbnail} alt={book.title} className="w-10 h-14 object-cover rounded bg-gray-100" />
                    <div>
                      <div className="font-bold text-gray-800">{book.title}</div>
                      <div className="text-xs text-gray-500">{book.authors?.join(", ")}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{book.isbn}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.availableCopies} / {book.totalCopies} Available
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={18} /></button>
                  <button 
                    onClick={() => handleDelete(book._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  ><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <AddBookModal onClose={() => setShowModal(false)} onRefresh={fetchBooks} />}
    </div>
  );
};

export default ManageBooks;