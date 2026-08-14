import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/auth";

// Protects admin-only pages on the frontend.
// - Not logged in  -> redirect to /login
// - Not an admin   -> redirect to home page
// - Admin          -> render the page
const AdminRoute = ({ children }) => {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
