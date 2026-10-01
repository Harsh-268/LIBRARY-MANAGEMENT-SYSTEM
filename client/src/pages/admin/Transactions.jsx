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
    ISSUED: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
    RETURNED: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400",
    OVERDUE: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}>
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

  // Mark Paid / Mark Unpaid button, shared by the table row and the mobile card.
  // `block` makes it stretch to fill the card width on mobile.
  const renderFineButton = (t, block = false) => (
    <button
      onClick={() => handleToggleFineStatus(t)}
      disabled={updatingId === t._id}
      className={`${block ? "w-full py-2" : "py-1.5"} px-3 text-xs font-medium rounded-md disabled:opacity-40 whitespace-nowrap ${
        t.fineStatus === "PAID"
          ? "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          : "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900"
      }`}
    >
      {updatingId === t._id
        ? "Updating..."
        : t.fineStatus === "PAID"
        ? "Mark Unpaid"
        : "Mark Paid"}
    </button>
  );

  const fineClass = (t) =>
    t.fineStatus === "PAID"
      ? "text-green-600 dark:text-green-400 font-medium"
      : "text-red-600 dark:text-red-400 font-medium";

  return (
    <div>
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Full issue history, including returned books and outstanding fines.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 sm:py-16 text-gray-400 dark:text-gray-500">Loading...</div>
      ) : failed ? (
        <div className="text-center py-12 sm:py-16 text-red-500 dark:text-red-400">
          Unable to load transactions.
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-400 dark:text-gray-500">
          No transactions recorded yet.
        </div>
      ) : (
        <>
          {/* Desktop / tablet: table */}
          <div className="hidden md:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Book</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Student</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Issued</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Returned</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Fine</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {t.book?.title || "Unknown book"}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 dark:text-gray-100">{t.user?.fullName || "Unknown"}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{t.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(t.issueDate)}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(t.returnDate)}</td>
                    <td className="px-4 py-3">{statusBadge(t.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {t.fine > 0 ? (
                        <span className={fineClass(t)}>
                          ₹{t.fine} · {t.fineStatus}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {t.fine > 0 && renderFineButton(t)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 break-words min-w-0">
                    {t.book?.title || "Unknown book"}
                  </p>
                  <span className="shrink-0">{statusBadge(t.status)}</span>
                </div>

                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {t.user?.fullName || "Unknown"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{t.user?.email}</p>

                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-gray-400 dark:text-gray-500">Issued</dt>
                    <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{formatDate(t.issueDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 dark:text-gray-500">Returned</dt>
                    <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{formatDate(t.returnDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 dark:text-gray-500">Fine</dt>
                    <dd className="mt-0.5">
                      {t.fine > 0 ? (
                        <span className={fineClass(t)}>
                          ₹{t.fine} · {t.fineStatus}
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </dd>
                  </div>
                </dl>

                {t.fine > 0 && <div className="mt-4">{renderFineButton(t, true)}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {metadata && metadata.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!metadata.hasPrevPage}
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {metadata.currentPage} of {metadata.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!metadata.hasNextPage}
            className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;