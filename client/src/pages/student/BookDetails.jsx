import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, User, Globe, Hash, CheckCircle, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setBook(data.data);
      } catch (error) {
        toast.error("Book not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id, navigate]);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      // Calling your backend issueBook controller
      // Passing current book ID and logged-in student ID
      await api.post("/issues/issuebook", { 
        bookId: book._id, 
        userId: user._id 
      });
      
      toast.success("Book borrowed successfully! Check 'My Books'.");
      navigate("/"); // Redirect to dashboard to see the active issue
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not borrow book");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium"
      >
        <ArrowLeft size={20} /> Back to Library
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Left: Book Cover */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <img 
              src={book.thumbnail} 
              alt={book.title} 
              className="w-full rounded-2xl shadow-2xl border border-gray-100 object-cover"
            />
            
            {/* Action Card */}
            <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {book.availableCopies > 0 ? 'In Stock' : 'Unavailable'}
                  </span>
               </div>
               
               <button
                onClick={handleBorrow}
                disabled={book.availableCopies === 0 || borrowing}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
               >
                {borrowing ? <Loader2 className="animate-spin" /> : <CheckCircle size={20} />}
                {book.availableCopies > 0 ? 'Borrow Book' : 'Out of Stock'}
               </button>
               <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">14-Day Lending Period</p>
            </div>
          </div>
        </div>

        {/* Right: Book Details */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {book.category || "General"}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-800 mt-4 leading-tight">
              {book.title}
            </h1>
            <div className="flex items-center gap-2 text-xl text-gray-500 mt-2">
              <User size={20} />
              <span>{book.authors?.join(", ")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Hash size={14} /> ISBN
              </div>
              <p className="font-mono text-gray-700">{book.isbn}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Globe size={14} /> Language
              </div>
              <p className="text-gray-700 capitalize">{book.language || "English"}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen size={14} /> Pages
              </div>
              <p className="text-gray-700">{book.pageCount || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {book.description || "No description available for this book."}
            </p>
          </div>

          {/* Warning for Students */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-4">
            <AlertTriangle className="text-amber-600 shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-bold">Library Policy</p>
              <p>Late returns incur a fine of ₹50 per day. You can renew this book up to 2 times if it's not already overdue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;