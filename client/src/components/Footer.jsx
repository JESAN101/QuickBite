import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const exploreLinks = [
  { to: "/", label: "Home" },
  { to: "/orders", label: "My Orders" },
  { to: "/favorites", label: "Favorites" },
  { to: "/cart", label: "Cart" },
];

const Footer = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const requireLogin = (e) => {
    e.preventDefault();
    toast.error("Please login first to continue.");
  };

  return (
    <footer className="bg-[#1D1512]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0A438] text-sm font-bold text-[#1D1512]">
                QB
              </span>
              <span className="font-['Fraunces',serif] text-xl italic text-[#F7ECD9]">
                QuickBite
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-[#F7ECD9]/50">
              Real food from real kitchens across Kathmandu, ordered in
              seconds and delivered while it's still hot.
            </p>
          </div>

          {/* quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A438]">
              Explore
            </h4>
            <div className="mt-4 flex flex-col gap-2.5">
              {exploreLinks.map((link) =>
                isAuthPage ? (
                  <button
                    key={link.to}
                    type="button"
                    onClick={requireLogin}
                    className="text-left text-sm text-[#F7ECD9]/60 hover:text-[#F7ECD9]"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-[#F7ECD9]/60 hover:text-[#F7ECD9]"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* contact / social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A438]">
              Get in touch
            </h4>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-[#F7ECD9]/60">
              <span>support@quickbite.com</span>
              <span>+977 1-234-5678</span>
            </div>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F7ECD9]/15 text-[#F7ECD9]/60 transition hover:border-[#F0A438] hover:text-[#F0A438]"
              >
                <FaFacebookF size={13} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F7ECD9]/15 text-[#F7ECD9]/60 transition hover:border-[#F0A438] hover:text-[#F0A438]"
              >
                <FaInstagram size={13} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F7ECD9]/15 text-[#F7ECD9]/60 transition hover:border-[#F0A438] hover:text-[#F0A438]"
              >
                <FaTwitter size={13} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#F7ECD9]/10 pt-6 text-xs text-[#F7ECD9]/40 md:flex-row">
          <span>© {new Date().getFullYear()} QuickBite. All rights reserved.</span>
          <span>Made in Kathmandu.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;