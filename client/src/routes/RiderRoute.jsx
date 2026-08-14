import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/auth";

// Protects rider pages.
// - Not logged in  -> redirect to /login
// - Not a rider    -> redirect to home
// - Rider          -> render the page
const RiderRoute = ({ children }) => {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "rider") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RiderRoute;
