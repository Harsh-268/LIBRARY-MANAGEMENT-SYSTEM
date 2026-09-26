import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import IssueService from "../../services/issue.service";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const statusBadge = (status) => {
  const styles = {
    ISSUED: "bg-blue-50 text-blue-700",
    RETURNED: "bg-green-50 text-green-700",
    OVERDUE: "bg-red-50 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTransactions = useCallback(
    async (guardRef = { current: false }) => {
      setIsLoading(true);
      setFailed(false);
      try {
        const { transactions: fetched, metadata: meta } =
          await IssueService.getAllTransactions(page, 15);
        if (!guardRef.current) {
          setTransactions(fetched);
          setMetadata(meta);
        }
      } catch {
        if (!guardRef.current) setFailed(true);
      } finally {
        if (!guardRef.current) setIsLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    const guard = { current: false };
    fetchTransactions(guard);
    return () => {
      guard.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleToggleFineStatus = async (transaction) => {
    const nextStatus = transaction.fineStatus === "PAID" ? "UNPAID" : "PAID";
    setUpdatingId(transaction._id);
    try {
      await IssueService.updateFineStatus({
        issueId: transaction._id,
        status: nextStatus,
      });
      toast.success(`Fine marked as ${nextStatus.toLowerCase()}`);
      fetchTransactions();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update fine status.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-500">
          Full issue history, including returned books and outstanding fines.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : failed ? (
        <div className="text-center py-16 text-red-500">
          Unable to load transactions.
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No transactions recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Book</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Issued</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Returned</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Fine</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td className="px-4 py-3 text-gray-900">
                    {t.book?.title || "Unknown book"}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{t.user?.fullName || "Unknown"}</p>
                    <p className="text-xs text-gray-400">{t.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(t.issueDate)}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(t.returnDate)}</td>
                  <td className="px-4 py-3">{statusBadge(t.status)}</td>
                  <td className="px-4 py-3">
                    {t.fine > 0 ? (
                      <span
                        className={
                          t.fineStatus === "PAID"
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        ₹{t.fine} · {t.fineStatus}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.fine > 0 && (
                      <button
                        onClick={() => handleToggleFineStatus(t)}
                        disabled={updatingId === t._id}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md disabled:opacity-40 ${
                          t.fineStatus === "PAID"
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                            : "text-green-700 bg-green-50 hover:bg-green-100"
                        }`}
                      >
                        {updatingId === t._id
                          ? "Updating..."
                          : t.fineStatus === "PAID"
                          ? "Mark Unpaid"
                          : "Mark Paid"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {metadata && metadata.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!metadata.hasPrevPage}
            className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {metadata.currentPage} of {metadata.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!metadata.hasNextPage}
            className="px-3 py-1.5 border border-gray-200 rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;