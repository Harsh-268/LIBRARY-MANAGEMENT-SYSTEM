import React from 'react';

const BookCard = ({ book }) => {
  // Destructure the book object with safe fallback values
  const {
    title = "Unknown Title",
    thumbnail = "https://via.placeholder.com/150x220?text=No+Cover",
    description = "No description available for this book.",
    authors = ["Unknown Author"],
    category = "Uncategorized"
  } = book;

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-2xl border border-gray-100">
      
      {/* Thumbnail Section */}
      <div className="sm:w-1/3 flex-shrink-0 bg-gray-50 flex items-center justify-center">
        <img
          src={thumbnail}
          alt={`Cover of ${title}`}
          className="w-full h-56 sm:h-full object-cover"
        />
      </div>

      {/* Info Section */}
      <div className="p-6 flex flex-col justify-between sm:w-2/3">
        <div>
          {/* Category Badge */}
          <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-md mb-2">
            {category}
          </span>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">
            {title}
          </h2>

          {/* Authors */}
          <p className="text-sm text-gray-500 italic mb-4">
            By {authors.join(", ")}
          </p>

          {/* Description (Truncated to 3 lines using line-clamp) */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Optional Action Button */}
        <div className="mt-6">
          <button className="w-full sm:w-auto bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors focus:ring-4 focus:ring-gray-200">
            Read More
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default BookCard;