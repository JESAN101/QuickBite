import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

// Single source of truth for logging out anywhere in the app.
const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useCallback(() => {
    logout();
    navigate("/login", { replace: true });
    toast.success("Logged out successfully.");
  }, [logout, navigate]);
};

export default useLogout;
