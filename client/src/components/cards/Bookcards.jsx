import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const {
    title = "Unknown Title",
    thumbnail = "https://via.placeholder.com/300x400?text=No+Cover",
    description = "No description available for this book.",
    authors = ["Unknown Author"],
    category = "Uncategorized",
  } = book;

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg sm:hover:-translate-y-0.5 transition-all duration-300">
      {/* Thumbnail Section */}
      <div className="relative h-36 sm:h-56 bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <img
          src={thumbnail}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category Badge */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 max-w-[calc(100%-1rem)] truncate px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white/90 dark:bg-gray-900/80 backdrop-blur text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
          {category}
        </span>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 min-w-0 p-3 sm:p-5">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 break-words">
          {title}
        </h2>

        <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 italic line-clamp-1">
          By {authors.join(", ")}
        </p>

        {/* Description: visible on all screens, 2 lines on mobile, 3 on desktop */}
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3 break-words flex-1">
          {description}
        </p>

        <Link
          to={`/books/${book._id}`}
          className="mt-3 sm:mt-5 w-full bg-gray-900 dark:bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;