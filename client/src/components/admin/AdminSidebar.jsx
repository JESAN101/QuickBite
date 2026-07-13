import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaChartPie,
  FaUsers,
  FaHamburger,
  FaStore,
  FaClipboardList,
  FaSignOutAlt,
  FaTags,
} from "react-icons/fa";

const AdminSidebar = () => {
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

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">

      {/* Logo */}

      <div className="p-6 border-b border-gray-700">

        <h1 className="text-2xl font-bold text-orange-500">
          QuickBite
        </h1>

        <p className="text-gray-400 text-sm">
          Admin Panel
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 mt-6">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
              isActive ? "bg-orange-500" : ""
            }`
          }
        >
          <FaHome />
          Home
        </NavLink>

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
              isActive ? "bg-orange-500" : ""
            }`
          }
        >
          <FaChartPie />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
              isActive ? "bg-orange-500" : ""
            }`
          }
        >
          <FaUsers />
          Users
        </NavLink>

        <NavLink
          to="/admin/foods"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
              isActive ? "bg-orange-500" : ""
            }`
          }
        >
          <FaHamburger />
          Foods
        </NavLink>

        <NavLink
  to="/admin/categories"
  className={({ isActive }) =>
    `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
      isActive ? "bg-orange-500" : ""
    }`
  }
>
  <FaTags />
  Categories
</NavLink>

        <NavLink
          to="/admin/restaurants"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
              isActive ? "bg-orange-500" : ""
            }`
          }
        >
          <FaStore />
          Restaurants
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-4 hover:bg-gray-800 ${
              isActive ? "bg-orange-500" : ""
            }`
          }
        >
          <FaClipboardList />
          Orders
        </NavLink>

      </nav>

      {/* Logout */}

      <div className="border-t border-gray-700">

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;