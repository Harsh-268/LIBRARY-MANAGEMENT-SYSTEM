import React, { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import StatCard from '../../components/admin/StateCard.jsx';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        if (!ignore) setStats(response.data.data);
      } catch (error) {
        console.error('Unable to fetch dashboard stats', error);
        if (!ignore) setFailed(true);
      }
    };

    fetchStats();
    return () => { ignore = true; };
  }, []);

  if (failed) return <div className="text-gray-500">Unable to load dashboard stats.</div>;
  if (!stats) return <div className="text-gray-500">Loading dashboard...</div>;

  const { counts, revenue, inventory } = stats;

  // Backend still returns full inventory — sorting/slicing here until
  // getAdminStats is trimmed to low-stock-only server-side.
  const lowStock = [...inventory]
    .sort((a, b) => a.availableCopies - b.availableCopies)
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Books" value={counts.totalBooks} />
        <StatCard label="Total Students" value={counts.totalStudents} />
        <StatCard label="Active Issues" value={counts.activeIssues} to="/admin/issues" accent="blue" />
        <StatCard label="Overdue Issues" value={counts.overdueIssues} to="/admin/issues?filter=overdue" accent="red" />
        <StatCard label="Total Fine Amount" value={revenue.totalFineAmount} accent="green" />
        <StatCard label="Fine Collected" value={revenue.totalPaid} accent="green" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Books Running Low</h2>
          <a href="/admin/books" className="text-xs text-blue-600 hover:underline">Manage stock &rarr;</a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-5 py-2">Title</th>
              <th className="text-left px-5 py-2">Available</th>
              <th className="text-left px-5 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((book) => (
              <tr key={book.bookId} className="border-t border-gray-100">
                <td className="px-5 py-3 text-gray-800">{book.title}</td>
                <td className={`px-5 py-3 font-medium ${book.availableCopies === 0 ? 'text-red-600' : 'text-gray-800'}`}>
                  {book.availableCopies}
                </td>
                <td className="px-5 py-3 text-gray-500">{book.totalCopies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Overview;