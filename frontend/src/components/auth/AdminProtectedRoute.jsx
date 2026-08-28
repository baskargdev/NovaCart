import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
