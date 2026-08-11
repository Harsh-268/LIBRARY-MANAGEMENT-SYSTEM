import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Getbooks from "./pages/books/Getbooks.jsx";
import BookDetails from "./pages/books/BookDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoutes.jsx";
// import MyBooks from "./pages/books/MyBooks.jsx";
// import Profile from "./pages/Profile.jsx";
// import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Paths with standard Header and Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Protected Routes for logged-in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="get-books" element={<Getbooks />} />
          <Route path="books/:bookId" element={<BookDetails />} />
          {/* <Route path="my-books" element={<MyBooks />} /> */}
          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          {/* <Route path="admin-dashboard" element={<AdminDashboard />} /> */}
        </Route>
      </Route>

      {/* Paths without Header and Footer */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
