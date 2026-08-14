import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";

const MobileNav = ({ links, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111827] p-5 text-white shadow-2xl transition-transform duration-300 lg:hidden">
        <div className="flex items-center justify-between">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <h1 className="text-xl font-extrabold text-orange-400">QuickBite</h1>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </>
  );
};

export default MobileNav;
