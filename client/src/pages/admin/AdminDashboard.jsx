import { useState, useEffect } from "react";
import { BookOpen, Users, AlertCircle, IndianRupee, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setStats(data.data);
      } catch (error) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center font-medium">Loading Dashboard...</div>;

  const statCards = [
    { 
      title: "Total Books", 
      value: stats?.counts?.totalBooks || 0, 
      icon: <BookOpen className="text-blue-600" />, 
      color: "bg-blue-50" 
    },
    { 
      title: "Active Students", 
      value: stats?.counts?.totalStudents || 0, 
      icon: <Users className="text-purple-600" />, 
      color: "bg-purple-50" 
    },
    { 
      title: "Books Issued", 
      value: stats?.counts?.activeIssues || 0, 
      icon: <TrendingUp className="text-green-600" />, 
      color: "bg-green-50" 
    },
    { 
      title: "Overdue Books", 
      value: stats?.counts?.overdueIssues || 0, 
      icon: <AlertCircle className="text-red-600" />, 
      color: "bg-red-50" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Librarian Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here is what's happening in the library today.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-xl ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Inventory Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fine Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <IndianRupee size={20} className="text-yellow-600" /> Fine Collection summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Fines Generated</span>
              <span className="font-bold text-gray-800">₹{stats?.revenue?.totalFineAmount}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-green-700">Fines Collected (Paid)</span>
              <span className="font-bold text-green-700">₹{stats?.revenue?.totalPaid}</span>
            </div>
          </div>
        </div>

        {/* Categories Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Inventory by Category</h3>
          <div className="space-y-3">
            {stats?.inventory?.map((cat, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(cat.count / stats.counts.totalBooks) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700 w-24 truncate">{cat._id || "Uncategorized"}</span>
                <span className="text-sm font-bold text-gray-500">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;