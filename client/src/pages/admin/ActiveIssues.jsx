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

  // action-in-flight state, keyed by issueId, so only the relevant row shows a spinner
  const [actionState, setActionState] = useState({}); // { [issueId]: "returning" | "renewing" }
  const [confirmTarget, setConfirmTarget] = useState(null); // issue object pending return confirmation

  // guardRef.current flips to true on unmount/param-change so an in-flight
  // request from a stale render can't overwrite fresher state
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Issues</h1>
          <p className="text-sm text-gray-500">
            Books currently checked out across the library.
          </p>
        </div>
        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Issue New Book
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : failed ? (
        <div className="text-center py-16 text-red-500">
          Unable to load active issues.
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No books are currently issued.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Book</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Issued</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Due</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Renewals</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {issues.map((issue) => {
                const busy = actionState[issue._id];
                return (
                  <tr key={issue._id} className={issue.isOverDue ? "bg-red-50" : ""}>
                    <td className="px-4 py-3 text-gray-900">{issue.bookTitle}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{issue.studentName}</p>
                      <p className="text-xs text-gray-400">{issue.studentEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(issue.issueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={issue.isOverDue ? "text-red-600 font-medium" : "text-gray-500"}>
                        {formatDate(issue.dueDate)}
                      </span>
                      {issue.isOverDue && (
                        <span className="ml-2 inline-block px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{issue.renewalCount}/2</td>
                    <td className="px-4 py-3 text-right space-x-2">
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
                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {busy === "renewing" ? "Renewing..." : "Renew"}
                      </button>
                      <button
                        onClick={() => setConfirmTarget(issue)}
                        disabled={!!busy}
                        className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {busy === "returning" ? "Returning..." : "Return"}
                      </button>
                    </td>
                  </tr>
                );
              })}
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