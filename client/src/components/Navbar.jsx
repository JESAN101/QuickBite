import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { isLoggedIn, getUser, logout } from "../utils/auth";
import { useCart } from "../context/CartContext";
import Loader from "./Loader";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/orders", label: "Orders" },
  { to: "/favorites", label: "Favorites" },
];

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { cartCount } = useCart();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const requireLogin = (e) => {
    e.preventDefault();
    toast.error("Please login first to continue.");
  };

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
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) =>
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

        {/* desktop right side: cart + auth/avatar */}
        <div className="hidden items-center gap-5 md:flex">
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

          {!isLoggedIn() ? (
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

        {/* mobile: cart icon + toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {isAuthPage ? (
            <button
              type="button"
              onClick={requireLogin}
              className="relative text-[#F7ECD9]/85"
            >
              <FaShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#D64933] px-1 text-[10px] font-bold leading-none text-[#F7ECD9]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>
          ) : (
            <Link to="/cart" className="relative text-[#F7ECD9]/85">
              <FaShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#D64933] px-1 text-[10px] font-bold leading-none text-[#F7ECD9]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-[#F7ECD9]"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-[#F7ECD9]/10 bg-[#1D1512] px-6 py-4 md:hidden">
          {isLoggedIn() && (
            <div className="mb-2 flex items-center gap-3 border-b border-[#F7ECD9]/10 pb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0A438] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1D1512]">
                {getInitials(user?.name)}
              </span>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#F7ECD9]">
                {user?.name}
              </span>
            </div>
          )}

          {navLinks.map((link) =>
            isAuthPage ? (
              <button
                key={link.to}
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  toast.error("Please login first to continue.");
                }}
                className="py-2.5 text-left font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/80"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/80"
              >
                {link.label}
              </Link>
            )
          )}

          {isAuthPage ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                toast.error("Please login first to continue.");
              }}
              className="py-2.5 text-left font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/80"
            >
              Profile
            </button>
          ) : (
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#F7ECD9]/80"
            >
              Profile
            </Link>
          )}

          <div className="mt-2 border-t border-[#F7ECD9]/10 pt-3">
            {!isLoggedIn() ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-[#F7ECD9]/20 py-2 text-center text-sm font-semibold text-[#F7ECD9]"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-[#F0A438] py-2 text-center text-sm font-semibold text-[#1D1512]"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full rounded-lg border border-[#F7ECD9]/20 py-2 text-sm font-semibold text-[#F7ECD9]"
              >
                Logout
              </button>
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