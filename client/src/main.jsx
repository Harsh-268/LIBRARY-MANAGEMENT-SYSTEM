import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import Layout from "./components/layout/Layout.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";

// Route guards
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoutes.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";


// User pages (auth required)
import MyBooks from "./pages/user/MyBooks.jsx";
import Profile from "./pages/user/Profile.jsx";
import ForgetPassword from "./pages/user/ForgetPassword.jsx";
import ResetPassword from "./pages/user/ResetPassword.jsx";
import Getbooks from "./pages/books/Getbooks.jsx";
import BookDetails from "./pages/books/BookDetails.jsx";

// Company / legal pages
import Contact from "./pages/company/Contact.jsx";
import PrivacyPolicy from "./pages/company/Privacy.jsx";
import TermsOfService from "./pages/company/Terms.jsx";
import AboutUs from "./pages/company/About.jsx";

// Admin pages
import Overview from "./pages/admin/Overview.jsx";
import BookStock from "./pages/admin/BookStock.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import Transactions from "./pages/admin/Transactions.jsx";
import ActiveIssues from "./pages/admin/ActiveIssues.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public site — standard Header + Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books/:bookId" element={<BookDetails />} />

        {/* Requires login, but still uses the public Header/Footer */}
        <Route element={<ProtectedRoute />}>
          <Route path="my-books" element={<MyBooks />} />
          <Route path="get-books" element={<Getbooks />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin dashboard — own sidebar layout, no public Header/Footer */}
      <Route element={<AdminRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="overview" element={<Overview />} />
          <Route path="books" element={<BookStock />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="issues" element={<ActiveIssues />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Route>

      {/* Standalone pages — no Header/Footer, no layout */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgetPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="contact" element={<Contact />} />
      <Route path="privacy" element={<PrivacyPolicy />} />
      <Route path="terms" element={<TermsOfService />} />
      <Route path="about-us" element={<AboutUs />} />
    </Route>
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);