import { Link } from "react-router-dom";
import {
  getMostIssuedBooks,
  getRecentlyAddedBooks,
} from "../services/book.service";
import { useState, useEffect } from "react";
import BookCard from "../components/cards/Bookcards.jsx";

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [trendingBooks, recentBooks] = await Promise.all([
          getMostIssuedBooks(),
          getRecentlyAddedBooks(),
        ]);
        setTrending(trendingBooks);
        setRecent(recentBooks);
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* --- HERO SECTION --- */}
      <section className="w-full bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover Your Next <span className="text-blue-500">Great Read</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Explore thousands of books across all genres. From thrilling
            mysteries to heartwarming romance, your digital library awaits.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/get-books"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg shadow-lg"
            >
              Browse Library
            </Link>
            <Link
              to="/register"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
            >
              Join for Free
            </Link>
          </div>
        </div>
      </section>

      {/* --- RECENTLY ADDED BOOKS --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Latest Collection
          </h2>
          <p className="text-gray-500 mb-10">
            Check out our newest additions to the library!
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {loading ? (
              <p className="text-gray-400 italic">Loading...</p>
            ) : recent.length === 0 ? (
              <p className="text-gray-400 italic">No books yet.</p>
            ) : (
              recent?.map((book) => <BookCard key={book._id} book={book} />)
            )}
          </div>

          <div className="mt-12">
            <Link
              to="/get-books"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              View all books &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURED CATEGORIES --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Popular Genres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Fiction", "Sci-Fi", "Mystery", "Biography"].map(
              (genre, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group"
                >
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {genre}
                  </h3>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* --- TRENDING BOOKS PREVIEW --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trending This Week
          </h2>
          <p className="text-gray-500 mb-10">
            Our community's current favorites.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {loading ? (
              <p className="text-gray-400 italic">Loading...</p>
            ) : trending.length === 0 ? (
              <p className="text-gray-400 italic">No books yet.</p>
            ) : (
              trending?.map((book) => <BookCard key={book._id} book={book} />)
            )}
          </div>

          <div className="mt-12">
            <Link
              to="/get-books"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              View all books &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
