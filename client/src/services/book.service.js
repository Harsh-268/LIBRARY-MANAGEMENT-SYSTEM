import axios from "axios";
import api from "../api/axios.js";

/**
 * Fetch a paginated list of all books in the library.
 * Returns the raw data from the API: { books, metadata }
 * Field selection/shaping for a specific view belongs in the component,
 * not here — this keeps the service reusable across different consumers.
 */
export const getAllBooks = async ({ page, limit } = {}) => {
  const response = await api.get("/books/all-books", {
    params: { page, limit },
  });
  return response.data.data; // { books, metadata }
};

/**
 * Fetch a single book by its ID.
 * Returns the raw book document from the API.
 */
export const getBookById = async (bookId) => {
  const response = await api.get(`/books/book/${bookId}`);
  return response.data.data; // book object
};

/**
 * Search books by title or author.
 * Returns the raw data from the API: { books, metadata }
 */
export const searchLibraryBooks = async (query, { page, limit } = {}) => {
  const response = await api.get("/books/search", {
    params: { q: query, page, limit },
  });
  return response.data.data; // { books, metadata }
};

/**
 * Fetch books filtered by category.
 * Returns the raw data from the API: { books, metadata }
 */
export const getBooksByCategory = async (category, { page, limit } = {}) => {
  const response = await api.get(`/books/category/${encodeURIComponent(category)}`, {
    params: { page, limit },
  });
  return response.data.data; // { books, metadata }
};







// ADMIN BOOK SERVICES


// Search books by ISBN (for admin use)
export const searchBooksByISBN = async (isbn) => {
  const response = await api.get(`/books/search/${isbn}`);
  return response.data.data; // book object
}

//Add book to library (for admin use)
export const addBookToLibrary = async (bookData) => {
  const response = await api.post("/books/add", bookData);
  return response.data.data; // newly added book object
}

//Update book details (for admin use)
export const updateBookDetails = async (bookId, updatedData) => {
  const response = await api.patch(`/books/update/${bookId}`, updatedData);
  return response.data.data; // updated book object
}

//Delete book from library (for admin use)
export const deleteBookFromLibrary = async (bookId) => {
  const response = await api.delete(`/books/delete/${bookId}`);
  return response.data.data; // deleted book object
}

//Update book stock (for admin use)
export const updateBookStock = async (bookId, changeInCopies) => {
  const response = await api.patch(`/books/update-stock/${bookId}`, {changeInCopies });
  return response.data.data; // updated book object
}



//Public book services

//Get most issued books
export const getMostIssuedBooks = async () => {
  const response = await api.get("/books/most-issued");
  return response.data.data; // array of most issued books
}

//Get recently added books
export const getRecentlyAddedBooks = async () => {
  const response = await api.get("/books/recently-added");
  return response.data.data; // array of recently added books
}