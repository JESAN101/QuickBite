import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protects restaurant-owner pages.
// - Not logged in     -> redirect to /login
// - Not a restaurant  -> redirect to home
// - Restaurant owner  -> render the page
const RestaurantRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "restaurant") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RestaurantRoute;
