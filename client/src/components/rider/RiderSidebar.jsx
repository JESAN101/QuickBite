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
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-[#111827] p-5 text-white shadow-xl lg:flex">
      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <h1 className="text-2xl font-extrabold text-orange-400">QuickBite</h1>
        <p className="mt-1 text-sm text-gray-400">Rider Delivery Hub</p>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        <NavLink to="/" className={linkClass}>
          <FaHome /> Storefront
        </NavLink>
        <NavLink to="/rider/dashboard" className={linkClass}>
          <FaChartPie /> Dashboard
        </NavLink>
        <NavLink to="/rider/orders" className={linkClass}>
          <FaMotorcycle /> Deliveries
        </NavLink>
        <NavLink to="/rider/profile" className={linkClass}>
          <FaUser /> My Profile
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-red-500/10 hover:text-red-300"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

export default RiderSidebar;
