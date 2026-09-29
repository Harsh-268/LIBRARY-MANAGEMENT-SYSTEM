import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import IssueService from "../../services/issue.service";

const IssueBookModal = ({ onClose, onSuccess }) => {
  const [bookQuery, setBookQuery] = useState("");
  const [bookResults, setBookResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingBooks, setIsSearchingBooks] = useState(false);

  useEffect(() => {
    IssueService.getStudents()
      .then(setStudents)
      .catch(() => toast.error("Failed to load student list"));
  }, []);

  useEffect(() => {
    if (!bookQuery.trim()) {
      setBookResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setIsSearchingBooks(true);
      try {
        const results = await IssueService.searchBooks(bookQuery);
        setBookResults(results);
      } catch {
        // silent - search-as-you-type shouldn't toast on every keystroke miss
      } finally {
        setIsSearchingBooks(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [bookQuery]);

  const filteredStudents = studentQuery.trim()
    ? students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(studentQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(studentQuery.toLowerCase())
      )
    : students;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedStudent) {
      toast.error("Please select both a book and a student");
      return;
    }
    if (selectedBook.availableCopies <= 0) {
      toast.error("This book has no available copies");
      return;
    }

    setIsSubmitting(true);
    try {
      await IssueService.issueBook({
        bookId: selectedBook._id,
        userId: selectedStudent._id,
      });
      toast.success(`"${selectedBook.title}" issued to ${selectedStudent.fullName}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to issue book. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Issue a Book" maxWidth="md">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Book search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Book
          </label>
          {selectedBook ? (
            <div className="flex items-center justify-between border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedBook.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedBook.availableCopies} available
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={bookQuery}
                onChange={(e) => setBookQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(bookResults.length > 0 || isSearchingBooks) && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {isSearchingBooks && (
                    <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">Searching...</div>
                  )}
                  {bookResults.map((book) => (
                    <button
                      type="button"
                      key={book._id}
                      onClick={() => {
                        setSelectedBook(book);
                        setBookResults([]);
                        setBookQuery("");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between"
                    >
                      <span>{book.title}</span>
                      <span
                        className={
                          book.availableCopies > 0
                            ? "text-green-600 dark:text-green-400 text-xs"
                            : "text-red-500 dark:text-red-400 text-xs"
                        }
                      >
                        {book.availableCopies} left
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Student search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Student
          </label>
          {selectedStudent ? (
            <div className="flex items-center justify-between border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedStudent.fullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedStudent.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {studentQuery.trim() && filteredStudents.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <button
                      type="button"
                      key={student._id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setStudentQuery("");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <p>{student.fullName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{student.email}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedBook || !selectedStudent}
            className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Issuing..." : "Issue Book"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default IssueBookModal;