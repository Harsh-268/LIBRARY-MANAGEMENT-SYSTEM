import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getMyActiveIssues,
  getMyHistory,
} from "../../services/issue.service.js";

const FALLBACK_THUMB = "https://via.placeholder.com/80x110?text=No+Cover";

const getDueStatus = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"}`,
      color: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
    };
  }
  if (diffDays <= 3) {
    return {
      label:
        diffDays === 0
          ? "Due today"
          : `Due in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
      color: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    };
  }
  return {
    label: `Due ${due.toLocaleDateString()}`,
    color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
  };
};

const getFineBadge = (record) => {
  const fine = record.fine || 0;

  if (fine <= 0) {
    return { label: "No Fine", style: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" };
  }
  return { label: `₹${fine}`, style: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400" };
};

const getFineStatusBadge = (record) => {
  const status = record.fineStatus || "NONE";

  const styles = {
    PAID: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400",
    UNPAID: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400",
    NONE: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400",
  };

  const labels = {
    PAID: "Paid",
    UNPAID: "Unpaid",
    NONE: "—",
  };

  return { label: labels[status] || "—", style: styles[status] || styles.NONE };
};

const TABS = [
  { key: "active", label: "Active Issues" },
  { key: "history", label: "History" },
];

const MyBooks = () => {
  const [tab, setTab] = useState("active");

  const [activeIssues, setActiveIssues] = useState([]);
  const [activeLoading, setActiveLoading] = useState(true);
  const [activeError, setActiveError] = useState(false);

  const [history, setHistory] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchActive = useCallback(async () => {
    setActiveLoading(true);
    setActiveError(false);
    try {
      const data = await getMyActiveIssues();
      setActiveIssues(data || []);
    } catch (err) {
      console.error("Failed to load active issues:", err);
      setActiveError(true);
    } finally {
      setActiveLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (targetPage) => {
    setHistoryLoading(true);
    setHistoryError(false);
    try {
      const data = await getMyHistory({ page: targetPage, limit });
      setHistory(data?.history || []);
      setMetadata(data?.metadata || null);
    } catch (err) {
      console.error("Failed to load history:", err);
      setHistoryError(true);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  useEffect(() => {
    if (tab === "history") {
      fetchHistory(page);
    }
  }, [tab, page, fetchHistory]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Books</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Track what you've borrowed and your reading history.
      </p>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {t.label}
              {t.key === "active" && activeIssues.length > 0 && (
                <span className="ml-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {activeIssues.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {tab === "active" ? (
        <ActiveIssuesSection
          loading={activeLoading}
          error={activeError}
          issues={activeIssues}
        />
      ) : (
        <HistorySection
          loading={historyLoading}
          error={historyError}
          history={history}
          metadata={metadata}
          page={page}
          setPage={setPage}
        />
      )}
    </div>
  );
};

const ActiveIssuesSection = ({ loading, error, issues }) => {
  if (loading) {
    return (
      <div className="text-gray-400 dark:text-gray-500 py-12 text-center">
        Loading your active issues...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 py-12 text-center">
        Couldn't load your active issues. Please try again later.
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          You don't have any books checked out right now.
        </p>
        <Link
          to="/get-books"
          className="inline-block bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Browse the library
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {issues.map((issue) => {
        const due = getDueStatus(issue.dueDate);
        return (
          <div
            key={issue._id}
            className="flex gap-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 shadow-sm"
          >
            <img
              src={issue.book?.thumbnail || FALLBACK_THUMB}
              alt={issue.book?.title || "Book cover"}
              className="w-16 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {issue.book?.title || "Untitled"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                {issue.book?.authors?.join(", ") || "Unknown author"}
              </p>

              <span
                className={`inline-block text-xs font-medium px-2 py-1 rounded-md border ${due.color}`}
              >
                {due.label}
              </span>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Renewed {issue.renewalCount || 0}/2 time
                {issue.renewalCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const HistorySection = ({
  loading,
  error,
  history,
  metadata,
  page,
  setPage,
}) => {
  if (loading) {
    return (
      <div className="text-gray-400 dark:text-gray-500 py-12 text-center">
        Loading your history...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 py-12 text-center">
        Couldn't load your borrowing history. Please try again later.
      </div>
    );
  }
  if (history.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">You haven't returned any books yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Book
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Issued
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Returned
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Fine
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                Fine-Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800 bg-white dark:bg-gray-800">
            {history.map((record) => {
              const fineBadge = getFineBadge(record);
              const statusBadge = getFineStatusBadge(record);
              return (
                <tr key={record._id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={record.book?.thumbnail || FALLBACK_THUMB}
                        alt={record.book?.title || "Book cover"}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {record.book?.title || "Untitled"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {record.book?.authors?.join(", ")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {record.issueDate
                      ? new Date(record.issueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {record.returnDate
                      ? new Date(record.returnDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${fineBadge.style}`}
                    >
                      {fineBadge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${statusBadge.style}`}
                    >
                      {statusBadge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {metadata && metadata.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            disabled={!metadata.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {metadata.currentPage} of {metadata.totalPages}
          </span>
          <button
            disabled={!metadata.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
export default MyBooks;