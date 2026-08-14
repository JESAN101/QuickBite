import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../utils/auth";

// Protects restaurant-owner pages.
// - Not logged in     -> redirect to /login
// - Not a restaurant  -> redirect to home
// - Restaurant owner  -> render the page
const RestaurantRoute = ({ children }) => {
  const user = getUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "restaurant") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RestaurantRoute;
