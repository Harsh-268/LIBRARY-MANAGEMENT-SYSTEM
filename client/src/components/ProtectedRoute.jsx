import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center font-bold">Loading...</div>;

    if (!user) {
        // Not logged in -> Go to Login
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        // Logged in but wrong role -> Go to Home
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;