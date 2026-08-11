import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookById } from "../../services/book.service.js";

const BookDetailsSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="md:col-span-1">
        <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg" />
      </div>
      <div className="md:col-span-2 space-y-4">
        <div className="h-3 w-20 bg-gray-200 rounded-full" />
        <div className="h-7 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-2/3 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getBookById(bookId);
        setBook(data);
      } catch (err) {
        setError(err.message || "Unable to load this book.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50">
        <BookDetailsSkeleton />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
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
              Book not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error || "We couldn't find the book you're looking for."}
            </p>
            <Link
              to="/get-books"
              className="mt-6 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              &larr; Back to library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const {
    title = "Unknown Title",
    thumbnail = "https://via.placeholder.com/400x600?text=No+Cover",
    description = "No description available for this book.",
    authors = ["Unknown Author"],
    category = "Uncategorized",
    pageCount,
    isbn,
    availableCopies,
  } = book;

  const isAvailable = Number(availableCopies) > 0;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          to="/get-books"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to library
        </Link>

        {/* Details card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6 md:p-8">
          {/* Thumbnail */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
              <img
                src={thumbnail}
                alt={`Cover of ${title}`}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-block w-fit px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-md">
                {category}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 w-fit px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                  isAvailable
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {isAvailable ? "Available" : "Currently Unavailable"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="mt-2 text-sm text-gray-500 italic">
              By {authors.join(", ")}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm border-y border-gray-100 py-4">
              {pageCount ? (
                <div>
                  <span className="block text-gray-400 text-xs uppercase tracking-wide">
                    Pages
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {pageCount}
                  </span>
                </div>
              ) : null}

              {isbn ? (
                <div>
                  <span className="block text-gray-400 text-xs uppercase tracking-wide">
                    ISBN
                  </span>
                  <span className="text-gray-900 font-semibold">{isbn}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Description
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;