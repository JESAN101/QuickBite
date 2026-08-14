import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaChartPie,
  FaMotorcycle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const RiderSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
      isActive ? "bg-orange-500" : ""
    }`;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">

      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-orange-500">
          QuickBite
        </h1>

        <p className="text-gray-400 text-sm">
          Rider Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <NavLink to="/" className={linkClass}>
          <FaHome />
          Storefront
        </NavLink>

        <NavLink to="/rider/dashboard" className={linkClass}>
          <FaChartPie />
          Dashboard
        </NavLink>

        <NavLink to="/rider/orders" className={linkClass}>
          <FaMotorcycle />
          Deliveries
        </NavLink>

        <NavLink to="/rider/profile" className={linkClass}>
          <FaUser />
          My Profile
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-800 text-gray-300"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default RiderSidebar;
