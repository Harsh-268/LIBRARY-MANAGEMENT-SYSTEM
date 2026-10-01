import React, { useEffect, useState } from "react";
import BookCard from "../../components/cards/Bookcards.jsx";
import { useSearchParams } from "react-router-dom";
import {
  searchLibraryBooks,
  getAllBooks,
  getBooksByCategory,
} from "../../services/book.service.js";

const BookCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-36 sm:h-56 bg-gray-200 dark:bg-gray-700" />
    <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  </div>
);

const Getbooks = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const getBooks = async () => {
      setIsLoading(true);
      setFailed(false);
      try {
        const { books: rawBooks } = category
          ? await getBooksByCategory(category)
          : query
            ? await searchLibraryBooks(query)
            : await getAllBooks();

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
  }, [query, category]);

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {query ? (
              <>
                Search results for{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  "{query}"
                </span>
              </>
            ) : category ? (
              <>
                Books in{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  "{category}"
                </span>
              </>
            ) : (
              <>
                Browse the{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Library
                </span>
              </>
            )}
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Loading the collection..."
              : `${books.length} book${books.length === 1 ? "" : "s"} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {failed ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Unable to load books
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Something went wrong while fetching the library. Please try again
              shortly.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {" "}
            {books.map((singleBook) => (
              <BookCard key={singleBook._id} book={singleBook} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No books found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {query
                ? `No results for "${query}". Try a different search.`
                : "The library doesn't have any books yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Getbooks;
