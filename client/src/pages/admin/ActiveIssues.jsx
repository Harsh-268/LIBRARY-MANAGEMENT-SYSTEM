import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import IssueService from "../../services/issue.service";
import IssueBookModal from "../../components/common/IssueBooksModal.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ActiveIssues = () => {
  const [issues, setIssues] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [actionState, setActionState] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchIssues = useCallback(
    async (guardRef = { current: false }) => {
      setIsLoading(true);
      setFailed(false);
      try {
        const { issues: fetchedIssues, metadata: fetchedMeta } =
          await IssueService.getActiveIssues(page, 10);
        if (!guardRef.current) {
          setIssues(fetchedIssues);
          setMetadata(fetchedMeta);
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
    fetchIssues(guard);
    return () => {
      guard.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleRenew = async (issue) => {
    setActionState((prev) => ({ ...prev, [issue._id]: "renewing" }));
    try {
      await IssueService.renewBook(issue._id);
      toast.success(`Renewed "${issue.bookTitle}" for ${issue.studentName}`);
      fetchIssues();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to renew. Please try again.";
      toast.error(message);
    } finally {
      setActionState((prev) => {
        const next = { ...prev };
        delete next[issue._id];
        return next;
      });
    }
  };

  const handleConfirmReturn = async () => {
    if (!confirmTarget) return;
    const issue = confirmTarget;
    setActionState((prev) => ({ ...prev, [issue._id]: "returning" }));
    try {
      const result = await IssueService.returnBook(issue._id);
      const fine = result.issue?.fine || 0;
      toast.success(
        fine > 0
          ? `Returned. Fine of ₹${fine} recorded.`
          : `"${issue.bookTitle}" returned successfully`
      );
      fetchIssues();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to return. Please try again.";
      toast.error(message);
    } finally {
      setActionState((prev) => {
        const next = { ...prev };
        delete next[issue._id];
        return next;
      });
      setConfirmTarget(null);
    }
  };

  // Renew / Return buttons, shared by the table row and the mobile card.
  // `block` makes them stretch to fill the card width on mobile.
  const renderActions = (issue, block = false) => {
    const busy = actionState[issue._id];
    const size = block ? "flex-1 py-2" : "py-1.5";
    return (
      <>
        <button
          onClick={() => handleRenew(issue)}
          disabled={!!busy || issue.renewalCount >= 2 || issue.isOverDue}
          title={
            issue.isOverDue
              ? "Cannot renew an overdue book"
              : issue.renewalCount >= 2
              ? "Renewal limit reached"
              : ""
          }
          className={`${size} px-3 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {busy === "renewing" ? "Renewing..." : "Renew"}
        </button>
        <button
          onClick={() => setConfirmTarget(issue)}
          disabled={!!busy}
          className={`${size} px-3 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {busy === "returning" ? "Returning..." : "Return"}
        </button>
      </>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Active Issues</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Books currently checked out across the library.
          </p>
        </div>
        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="w-full sm:w-auto bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
        >
          + Issue New Book
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 sm:py-16 text-gray-400 dark:text-gray-500">Loading...</div>
      ) : failed ? (
        <div className="text-center py-12 sm:py-16 text-red-500 dark:text-red-400">
          Unable to load active issues.
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-gray-400 dark:text-gray-500">
          No books are currently issued.
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
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Due</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Renewals</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800">
                {issues.map((issue) => (
                  <tr key={issue._id} className={issue.isOverDue ? "bg-red-50 dark:bg-red-950/40" : ""}>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{issue.bookTitle}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 dark:text-gray-100">{issue.studentName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{issue.studentEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(issue.issueDate)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={issue.isOverDue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-500 dark:text-gray-400"}>
                        {formatDate(issue.dueDate)}
                      </span>
                      {issue.isOverDue && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs rounded">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{issue.renewalCount}/2</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                      {renderActions(issue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className={`rounded-xl border p-4 ${
                  issue.isOverDue
                    ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100 break-words min-w-0">
                    {issue.bookTitle}
                  </p>
                  {issue.isOverDue && (
                    <span className="shrink-0 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs rounded">
                      Overdue
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 truncate">{issue.studentName}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{issue.studentEmail}</p>

                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-gray-400 dark:text-gray-500">Issued</dt>
                    <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{formatDate(issue.issueDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 dark:text-gray-500">Due</dt>
                    <dd className={`mt-0.5 ${issue.isOverDue ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}>
                      {formatDate(issue.dueDate)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 dark:text-gray-500">Renewals</dt>
                    <dd className="mt-0.5 text-gray-700 dark:text-gray-300">{issue.renewalCount}/2</dd>
                  </div>
                </dl>

                <div className="mt-4 flex gap-2">{renderActions(issue, true)}</div>
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

      {isIssueModalOpen && (
        <IssueBookModal
          onClose={() => setIsIssueModalOpen(false)}
          onSuccess={fetchIssues}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          onClose={() => setConfirmTarget(null)}
          onConfirm={handleConfirmReturn}
          title="Confirm Return"
          message={
            confirmTarget?.isOverDue
              ? `"${confirmTarget?.bookTitle}" is overdue. A fine will be applied based on days late. Continue?`
              : `Mark "${confirmTarget?.bookTitle}" as returned by ${confirmTarget?.studentName}?`
          }
          confirmLabel="Return Book"
        />
      )}
    </div>
  );
};

export default ActiveIssues;