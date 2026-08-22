import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaMotorcycle,
  FaStore,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getInitials } from "../utils/format";
import Loader from "./Loader";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/orders", label: "Orders" },
  { to: "/favorites", label: "Favorites" },
];

// Role-based panel links appended to the main navigation
const getRoleLinks = (role) => {
  if (role === "restaurant") {
    return [{ to: "/restaurant/dashboard", label: "My Restaurant" }];
  }

  if (role === "admin") {
    return [{ to: "/admin/dashboard", label: "Admin" }];
  }

  if (role === "rider") {
    return [{ to: "/rider/dashboard", label: "Rider" }];
  }

  return [];
};

const Navbar = () => {  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const links = [...navLinks, ...getRoleLinks(user?.role)];
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { cartCount } = useCart();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Customers (and logged-out visitors) can apply for a role
  const canApply = !isAuthenticated || user?.role === "customer";

  const applyLinks = [
    { to: "/apply/rider", label: "Become a Rider", icon: FaMotorcycle },
    {
      to: "/apply/restaurant",
      label: "Register Your Restaurant",
      icon: FaStore,
    },
  ];

  const dropdownItemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#1D1512] transition hover:bg-[#F0A438]/15 hover:text-[#946022]";

  const requireLogin = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    toast.error("Please login first to continue.");
  };

  const closeMenu = () => setMenuOpen(false);

  const confirmLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      logout();
      navigate("/login");
      window.location.reload();
    }, 500);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#1D1512]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* wordmark */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0A438] text-sm font-bold text-[#1D1512]">
            QB
          </span>
          <span className="font-['Fraunces',serif] text-xl italic text-[#F7ECD9]">
            QuickBite
          </span>
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) =>
            isAuthPage ? (
              <button
                key={link.to}
                type="button"
                onClick={requireLogin}
                className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/75 transition hover:text-[#F0A438]"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/75 transition hover:text-[#F0A438]"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* right side: cart + auth + menu button */}
        <div className="flex items-center gap-4">
          {/* cart */}
          {isAuthPage ? (
            <button
              type="button"
              onClick={requireLogin}
              className="relative text-[#F7ECD9]/85 transition hover:text-[#F0A438]"
            >
              <FaShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#D64933] px-1 text-[10px] font-bold leading-none text-[#F7ECD9]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          ) : (
            <Link
              to="/cart"
              className="relative text-[#F7ECD9]/85 transition hover:text-[#F0A438]"
            >
              <FaShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#D64933] px-1 text-[10px] font-bold leading-none text-[#F7ECD9]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* auth (desktop only) */}
          <div className="hidden items-center gap-5 md:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/75 hover:text-[#F0A438]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-[#F0A438] px-4 py-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#1D1512] transition hover:bg-[#F7ECD9]"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  title={user?.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0A438] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1D1512] transition hover:ring-2 hover:ring-[#F7ECD9]/30"
                >
                  {getInitials(user?.name)}
                </Link>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded-lg border border-[#F7ECD9]/20 px-4 py-2 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#F7ECD9] transition hover:border-[#D64933] hover:text-[#D64933]"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* three-line menu button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#F7ECD9]/20 text-[#F7ECD9] transition hover:border-[#F0A438] hover:text-[#F0A438]"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* dropdown menu */}
      {menuOpen && (
        <div className="absolute right-6 top-20 z-[150] w-72 overflow-hidden rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] shadow-2xl">
          {isAuthenticated && (
            <div className="flex items-center gap-3 border-b border-[#EADFC8] bg-[#1D1512] px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0A438] font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1D1512]">
                {getInitials(user?.name)}
              </span>

              <div className="min-w-0">
                <p className="truncate font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#F7ECD9]">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-[#F7ECD9]/50">
                  {user?.email}
                </p>
              </div>
            </div>
          )}

          <div className="p-2">
            {/* apply for a role */}
            {canApply && (
              <>
                <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#3A2A20]/45">
                  Join QuickBite
                </p>

                {applyLinks.map((link) => {
                  const Icon = link.icon;

                  return isAuthPage ? (
                    <button
                      key={link.to}
                      type="button"
                      onClick={requireLogin}
                      className={dropdownItemClass}
                    >
                      <Icon className="text-[#D64933]" />
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={dropdownItemClass}
                    >
                      <Icon className="text-[#D64933]" />
                      {link.label}
                    </Link>
                  );
                })}
              </>
            )}

            {/* main navigation */}
            {links.map((link) =>
              isAuthPage ? (
                <button
                  key={link.to}
                  type="button"
                  onClick={requireLogin}
                  className={dropdownItemClass}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={dropdownItemClass}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* logged in: profile + logout */}
            {isAuthenticated && (
              <>
                <div className="my-1 border-t border-[#EADFC8]" />

                {isAuthPage ? (
                  <button
                    type="button"
                    onClick={requireLogin}
                    className={dropdownItemClass}
                  >
                    Profile
                  </button>
                ) : (
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className={dropdownItemClass}
                  >
                    Profile
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#D64933] transition hover:bg-[#D64933]/10"
                >
                  Logout
                </button>
              </>
            )}

            {/* logged out: login + register */}
            {!isAuthenticated && (
              <>
                <div className="my-1 border-t border-[#EADFC8]" />

                <div className="flex gap-2 p-1">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg border border-[#EADFC8] py-2 text-center text-sm font-semibold text-[#1D1512] transition hover:bg-[#1D1512]/5"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg bg-[#F0A438] py-2 text-center text-sm font-semibold text-[#1D1512] transition hover:bg-[#F7ECD9]"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* logout confirmation modal */}
      {showLogoutConfirm && !loggingOut && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1D1512]/60 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 text-center shadow-2xl">
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
              Log out of QuickBite?
            </h3>
            <p className="mt-2 text-sm text-[#3A2A20]/60">
              You'll need to log back in to place orders or view your
              favorites.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-lg border border-[#EADFC8] py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#1D1512] transition hover:bg-[#1D1512]/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-lg bg-[#D64933] py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#c03e2a]"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* logout loading overlay */}
      {loggingOut && <Loader fullScreen label="Logging you out" />}
    </nav>
  );
};

export default Navbar;
