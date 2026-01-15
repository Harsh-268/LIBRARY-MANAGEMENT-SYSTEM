import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertCircle, User, Book as BookIcon, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ReturnPortal = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/issues/all");
      // Filter only currently ISSUED books
      const active = data.data.filter(issue => issue.status === "ISSUED");
      setIssuedBooks(active);
    } catch (error) {
      toast.error("Failed to load issued books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const handleReturn = async (issueId) => {
    if (!window.confirm("Mark this book as returned?")) return;
    
    try {
      const { data } = await api.patch(`/issues/return/${issueId}`);
      const fineAmount = data.data.issue.fine;
      
      if (fineAmount > 0) {
        toast.success(`Book returned! Fine calculated: ₹${fineAmount}`, { icon: '💰', duration: 5000 });
      } else {
        toast.success("Book returned successfully!");
      }
      
      fetchIssuedBooks(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Return failed");
    }
  };

  const filteredIssues = issuedBooks.filter(issue => 
    issue.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.book?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading active issues...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Return Processing</h1>
        <p className="text-gray-500 text-sm">Scan or search for issued books to process returns.</p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Search student or book title..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Book</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredIssues.map((issue) => {
              const isOverdue = new Date() > new Date(issue.dueDate);
              return (
                <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {issue.user?.fullName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">{issue.user?.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={issue.book?.thumbnail} className="w-8 h-10 object-cover rounded shadow-sm" />
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">{issue.book?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                      {isOverdue && <AlertCircle size={14} />}
                      {new Date(issue.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleReturn(issue._id)}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100"
                    >
                      <CheckCircle size={16} /> Return
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredIssues.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">No active issues found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnPortal;