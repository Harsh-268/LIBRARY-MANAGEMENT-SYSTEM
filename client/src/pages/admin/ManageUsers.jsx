import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAllUsers, searchStudents, updateUserRole } from "../../services/user.service.js";
import { normalizeApiError } from "../../utils/zod.error.util.js";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const PAGE_SIZE = 10;

const ManageUsers = () => {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [metadata, setMetadata] = useState(null); // null while searching (search isn't paginated)
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // user pending a role-change confirmation
  const [pendingRoleChange, setPendingRoleChange] = useState(null); // { _id, fullName, role }
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // --- Fetch the paginated list (default view, no search term) ---
  useEffect(() => {
    if (searchTerm.trim()) return; // search effect below takes over

    let ignore = false;
    setIsLoading(true);

    getAllUsers({ page, limit: PAGE_SIZE })
      .then(({ users, metadata }) => {
        if (ignore) return;
        setUsers(users);
        setMetadata(metadata);
      })
      .catch((err) => {
        if (ignore) return;
        toast.error(normalizeApiError(err));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, searchTerm]);

  // --- Debounced search ---
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setIsSearching(false);
      return;
    }

    let ignore = false;
    setIsSearching(true);

    const timeoutId = setTimeout(() => {
      searchStudents(term)
        .then((students) => {
          if (ignore) return;
          setUsers(students);
          setMetadata(null); // search results aren't paginated
        })
        .catch((err) => {
          if (ignore) return;
          toast.error(normalizeApiError(err));
        })
        .finally(() => {
          if (!ignore) setIsSearching(false);
        });
    }, 350);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleRoleChangeConfirm = async () => {
    if (!pendingRoleChange) return;
    const nextRole = pendingRoleChange.role === "ADMIN" ? "STUDENT" : "ADMIN";

    setIsUpdatingRole(true);
    try {
      const updated = await updateUserRole({ userId: pendingRoleChange._id, role: nextRole });
      setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
      toast.success(`${updated.fullName} is now ${updated.role === "ADMIN" ? "an Admin" : "a Student"}.`);
      setPendingRoleChange(null);
    } catch (err) {
      toast.error(normalizeApiError(err));
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const isLoadingAny = isLoading || isSearching;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Users</h1>
        <p className="text-gray-500">View all accounts and promote or demote between Student and Admin.</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          placeholder="Search students by name or email…"
          className="w-full max-w-md px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm.trim() && (
          <p className="text-xs text-gray-400 mt-2">
            Search only looks at students, and shows up to 10 matches. Clear the box to see everyone, paginated.
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingAny && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            )}

            {!isLoadingAny && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            )}

            {!isLoadingAny &&
              users.map((u) => {
                const isSelf = u._id === currentAdmin?._id;
                return (
                  <tr key={u._id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3 text-gray-900 font-medium">{u.fullName}</td>
                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.role === "ADMIN" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        disabled={isSelf}
                        title={isSelf ? "You can't change your own role" : undefined}
                        onClick={() => setPendingRoleChange(u)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        {u.role === "ADMIN" ? "Demote to Student" : "Promote to Admin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination — hidden while a search term is active */}
      {!searchTerm.trim() && metadata && metadata.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!metadata.hasPrevPage}
            className="px-3 py-1.5 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span>
            Page {metadata.currentPage} of {metadata.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!metadata.hasNextPage}
            className="px-3 py-1.5 rounded-md border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!pendingRoleChange}
        onClose={() => setPendingRoleChange(null)}
        onConfirm={handleRoleChangeConfirm}
        isLoading={isUpdatingRole}
        danger={pendingRoleChange?.role === "ADMIN"}
        title={pendingRoleChange?.role === "ADMIN" ? "Demote to Student?" : "Promote to Admin?"}
        message={
          pendingRoleChange?.role === "ADMIN"
            ? `${pendingRoleChange?.fullName} will lose admin access and become a regular Student.`
            : `${pendingRoleChange?.fullName} will gain full Admin access — they'll be able to manage books, issues, users, and other admins.`
        }
        confirmLabel={pendingRoleChange?.role === "ADMIN" ? "Demote" : "Promote"}
      />
    </div>
  );
};

export default ManageUsers;