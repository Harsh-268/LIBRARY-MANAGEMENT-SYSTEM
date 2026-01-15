import { useState, useEffect } from "react";
import { Clock, Book as BookIcon, RotateCcw, AlertCircle, History, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const StudentDashboard = () => {
  const [activeBooks, setActiveBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [activeRes, historyRes] = await Promise.all([
        api.get("/issues/my-active"),
        api.get("/issues/my-history")
      ]);
      setActiveBooks(activeRes.data.data);
      setHistory(historyRes.data.data);
    } catch (error) {
      toast.error("Failed to load your library data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRenew = async (issueId) => {
    try {
      await api.patch(`/issues/renew/${issueId}`);
      toast.success("Book renewed for 7 more days!");
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Renewal failed");
    }
  };

  if (loading) return <div className="p-10 text-center font-medium">Loading your library...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Active Borrowings Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Currently Borrowed</h2>
        </div>

        {activeBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBooks.map((issue) => {
              const isOverdue = new Date() > new Date(issue.dueDate);
              return (
                <div key={issue._id} className={`bg-white rounded-2xl border p-5 flex gap-5 shadow-sm transition-all ${isOverdue ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                  <img 
                    src={issue.book?.thumbnail} 
                    alt={issue.book?.title} 
                    className="w-24 h-32 object-cover rounded-xl shadow-sm"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{issue.book?.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">Due on: {new Date(issue.dueDate).toLocaleDateString()}</p>
                      
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-red-600 text-xs font-bold mb-2">
                          <AlertCircle size={14} /> Overdue - Fine: ₹{issue.fine || 0}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-bold uppercase tracking-wider">
                        Renewed: {issue.renewalCount}/2
                      </span>
                      <button 
                        onClick={() => handleRenew(issue._id)}
                        disabled={isOverdue || issue.renewalCount >= 2}
                        className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                      >
                        <RotateCcw size={14} /> Renew
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
            <BookIcon className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500 font-medium">You don't have any books issued right now.</p>
          </div>
        )}
      </section>

      {/* Borrowing History Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <History className="text-gray-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Past History</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Book</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Returned Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fine Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={record.book?.thumbnail} className="w-8 h-10 object-cover rounded shadow-sm" />
                      <span className="font-semibold text-gray-700">{record.book?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={14} /> {new Date(record.returnDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">₹{record.fine || 0}</span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;