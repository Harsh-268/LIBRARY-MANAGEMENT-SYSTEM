import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Infrastructure
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookDetails from "./pages/student/BookDetails"; // Added
import ManageBooks from "./pages/admin/ManageBooks"; // Added
import ReturnPortal from "./pages/admin/ReturnPortal"; // Added

// Layout
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext"; // Added

function App() {
  return (
    <AuthProvider> {/* WRAP EVERYTHING HERE */}
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Routes */}
              <Route path="/" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute role="STUDENT"><BookDetails /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/books" element={<ProtectedRoute role="ADMIN"><ManageBooks /></ProtectedRoute>} />
              <Route path="/admin/return" element={<ProtectedRoute role="ADMIN"><ReturnPortal /></ProtectedRoute>} />

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;