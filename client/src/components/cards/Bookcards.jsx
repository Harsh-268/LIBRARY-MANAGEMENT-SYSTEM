import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  // Destructure the book object with safe fallback values
  const {
    title = "Unknown Title",
    thumbnail = "https://via.placeholder.com/300x400?text=No+Cover",
    description = "No description available for this book.",
    authors = ["Unknown Author"],
    category = "Uncategorized",
  } = book;

  return (
    <div className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Thumbnail Section */}
      <div className="relative h-56 bg-gray-50 overflow-hidden">
        <img
          src={thumbnail}
          alt={`Cover of ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur text-blue-600 text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
          {category}
        </span>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h2 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">
          {title}
        </h2>

        {/* Authors */}
        <p className="mt-1 text-xs text-gray-500 italic line-clamp-1">
          By {authors.join(", ")}
        </p>

        {/* Description (Truncated to 3 lines using line-clamp) */}
        <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
          {description}
        </p>

        {/* Action Button */}
        <Link
          to={`/books/${book._id}`}
          className="mt-5 w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-100 text-center"
>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
