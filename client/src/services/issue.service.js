import api from "../api/axios";

  // Active issues (book + user populated, isOverDue computed server-side)
 const getActiveIssues = async (page = 1, limit = 10) => {
    const response = await api.get("/dashboard/active-issues", {
      params: { page, limit },
    });
    return response.data.data; // { issues, metadata }
  }

 const issueBook = async ({ bookId, userId }) => {
    const response = await api.post("/issues/issue-book", { bookId, userId });
    return response.data.data; // { issueRecord, updatedBook, updatedUser }
  }

  const returnBook = async (issueId) => {
    const response = await api.patch(`/issues/return-book/${issueId}`);
    return response.data.data; // { issue, updatedBook, updatedUser }
  }

  const renewBook = async (issueId) => {
    const response = await api.patch(`/issues/renew-book/${issueId}`);
    return response.data.data; // { issue }
  }

  const updateFineStatus = async ({ issueId, status }) => {
    const response = await api.patch("/issues/update-fine-status", {
      issueId,
      status,
    });
    return response.data.data; // updated issue
  }

  const getAllTransactions = async (page = 1, limit = 10) => {
    const response = await api.get("/dashboard/transactions", {
      params: { page, limit },
    });
    return response.data.data; // { transactions, metadata }
  }

  const getOverdueBooks = async (page = 1, limit = 10) => {
    const response = await api.get("/issues/overdue-books", {
      params: { page, limit },
    });
    return response.data.data; // { overdueIssues, metadata }
  }

  // Helpers for the "Issue New Book" modal
  const searchBooks = async (q) => {
    if (!q || q.trim() === "") return [];
    const response = await api.get("/books/search", { params: { q } });
    return response.data.data.books;
  }

  // NOTE: no dedicated user-search endpoint exists yet.
  // This pulls a page of students and lets the modal filter client-side.
  // Fine for small-to-medium rosters; add a real search route if this grows.
  const getStudents = async (limit = 100) => {
    const response = await api.get("/users/all-users", {
      params: { page: 1, limit },
    });
    return response.data.data.users.filter((u) => u.role === "STUDENT");
  }

  export const getMyActiveIssues = async () => {
  const response = await api.get("/issues/my-active-issues");
  return response.data.data; // array of issue records
};

export const getMyHistory = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/issues/my-history", {
    params: { page, limit },
  });
  return response.data.data; // { history, metadata }
};


export default {
  getActiveIssues,
  issueBook,
  returnBook,
  renewBook,
  updateFineStatus,
  getAllTransactions,
  getOverdueBooks,
  searchBooks,
  getStudents,
  getMyActiveIssues,
  getMyHistory,
};