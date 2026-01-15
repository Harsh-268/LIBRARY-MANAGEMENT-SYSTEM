import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AddBookModal = ({ onClose, onRefresh }) => {
  const [isbn, setIsbn] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits your backend route: router.post("/add-by-isbn", addBookByISBN)
      await api.post("/books/add-by-isbn", { isbn, totalCopies });
      toast.success("Book added successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not find book with this ISBN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Add via ISBN</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Enter 10 or 13 Digit ISBN</label>
            <input 
              required
              type="text"
              placeholder="e.g. 9780132350884"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Total Copies</label>
            <input 
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Fetch & Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;