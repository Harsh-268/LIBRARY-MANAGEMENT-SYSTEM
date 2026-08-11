import React, { useEffect, useState } from "react";
import BookCard from "../../components/cards/Bookcards.jsx";
import { getAllBooks } from "../../services/book.service.js";

const BookCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-16 bg-gray-200 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
    </div>
  </div>
);

const Getbooks = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      setIsLoading(true);
      setFailed(false);
      try {
        const {books:rawBooks} = await getAllBooks();

        const bookStats = rawBooks.map((book) => ({
          _id: book._id,
          title: book.title,
          description: book.description,
          authors: book.authors,
          thumbnail: book.thumbnail,
          category: book.category,
        }));
        setBooks(bookStats);
      } catch (error) {
        console.error("Unable to get books,", error);
        setFailed(true);
      } finally {
        setIsLoading(false);
      }
    };
    getBooks();
  }, []);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Browse the <span className="text-blue-600">Library</span>
          </h1>
          <p className="mt-2 text-gray-500">
            {isLoading
              ? "Loading the collection..."
              : `${books.length} book${books.length === 1 ? "" : "s"} available to explore`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {failed ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Unable to load books
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Something went wrong while fetching the library. Please try
              again shortly.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((singleBook) => (
              <BookCard key={singleBook._id} book={singleBook} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              No books found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The library doesn't have any books yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Getbooks;