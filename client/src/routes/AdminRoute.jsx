import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects admin-only pages on the frontend.
// - Not logged in  -> redirect to /login
// - Not an admin   -> redirect to home page
// - Admin          -> render the page
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
