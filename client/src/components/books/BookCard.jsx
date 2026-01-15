import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={book.thumbnail || 'https://via.placeholder.com/300x400?text=No+Cover'} 
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            book.availableCopies > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {book.availableCopies > 0 ? 'Available' : 'Out of Stock'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <div className="mt-2 space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <User size={14} />
            <span className="truncate">{book.authors?.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Calendar size={14} />
            <span>{book.publishedDate?.split("-")[0] || "N/A"}</span>
          </div>
        </div>

        <Link 
          to={`/book/${book._id}`}
          className="mt-4 w-full py-2 bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
        >
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default BookCard;