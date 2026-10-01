import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Library, CalendarDays, RefreshCw, Coins } from "lucide-react";
import {
  getMostIssuedBooks,
  getRecentlyAddedBooks,
} from "../services/book.service";
import BookCard from "../components/cards/Bookcards.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const GENRES = ["Fiction", "Sci-Fi", "Mystery", "Biography"];
const PREVIEW_COUNT = 4; // 2 cols on phones, 4 on md+ -> never an orphan row

const gridClass = "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8";

const btnPrimary =
  "px-4 py-2 rounded-md text-xs sm:text-sm font-medium bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 transition-colors";
const btnSecondary =
  "px-4 py-2 rounded-md text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 text-white bg-blue-950 dark:text-gray-100 hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors";

const SkeletonGrid = () => (
  <div className={gridClass} aria-hidden="true">
    {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
      <div key={i}>
        <div className="aspect-[2/3] rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="mt-3 h-3 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="mt-2 h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    ))}
  </div>
);

const BookSection = ({ title, books, loading }) => (
  <section className="max-w-6xl mx-auto w-full px-4 py-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <Link
        to="/get-books"
        aria-label="View all books"
        title="View all books"
        className="p-1.5 -mr-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ArrowRight size={16} />
      </Link>
    </div>

    {loading ? (
      <SkeletonGrid />
    ) : books.length === 0 ? (
      <p className="text-xs text-gray-400 dark:text-gray-500">No books yet.</p>
    ) : (
      <div className={gridClass}>
        {books.slice(0, PREVIEW_COUNT).map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    )}
  </section>
);

// Borrowing rules at a glance (matches the backend: 3 books, 14 days, 2 renewals of 7 days)
const INFO = [
  { icon: Library, title: "3 books", text: "at a time" },
  { icon: CalendarDays, title: "14 days", text: "per loan" },
  { icon: RefreshCw, title: "2 renewals", text: "7 days each" },
  { icon: Coins, title: "50 / day", text: "late fee" },
];

const LibraryInfo = () => (
  <section className="border-y border-gray-100 dark:border-gray-800 my-4 bg-gray-950">
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
      {INFO.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3">
          <Icon size={18} strokeWidth={1.5} className="shrink-0 text-gray-200 " />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-100">{title}</p>
            <p className="text-xs text-gray-400">{text}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let ignore = false;

    const loadHomeData = async () => {
      // allSettled: if one endpoint fails, the other section still renders
      const [trendingRes, recentRes] = await Promise.allSettled([
        getMostIssuedBooks(),
        getRecentlyAddedBooks(),
      ]);

      if (ignore) return;

      if (trendingRes.status === "fulfilled" && Array.isArray(trendingRes.value)) {
        setTrending(trendingRes.value);
      } else if (trendingRes.status === "rejected") {
        console.error("Failed to load trending books:", trendingRes.reason);
      }

      if (recentRes.status === "fulfilled" && Array.isArray(recentRes.value)) {
        setRecent(recentRes.value);
      } else if (recentRes.status === "rejected") {
        console.error("Failed to load recent books:", recentRes.reason);
      }

      setLoading(false);
    };

    loadHomeData();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className=" bg-gray-950 w-full">
      <section className="max-w-2xl mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-10 text-center">
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Discover Your Next <span className="text-blue-500">Great Read</span>
          </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-200 max-w-md mx-auto">
 Explore thousands of books across all genres. From thrilling
            mysteries to heartwarming romance, your digital library awaits.        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
          <Link to="/get-books" className={`${btnPrimary} text-center`}>
            Browse library
          </Link>
          {!user && (
            <Link to="/register" className={`${btnSecondary} text-center`}>
              Create account
            </Link>
          )}
        </div>
      </section>

      {/* Genres: small pills */}
      <section className="max-w-6xl mx-auto px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {GENRES.map((genre) => (
            <Link
              key={genre}
              to={`/get-books?category=${encodeURIComponent(genre)}`}
              className="px-2.5 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700 text-gray-200 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>
      </div>

      <BookSection title="Trending" books={trending} loading={loading} />
      <LibraryInfo />
      <BookSection title="New arrivals" books={recent} loading={loading} />
    </div>
  );
};

export default Home;