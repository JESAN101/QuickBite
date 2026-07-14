import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { login } from "../services/authService";
import { isLoggedIn } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Already-logged-in users shouldn't see the login form
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Logging in...");

    try {
      const data = await login(form);

      // Save Token
      localStorage.setItem("token", data.token);

      // Save User
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.dismiss(loadingToast);
      toast.success(data.message);

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);

      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1D1512]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .fade-up-1 { animation: fadeUp 0.55s ease-out 0.05s both; }
        .fade-up-2 { animation: fadeUp 0.55s ease-out 0.15s both; }
        .fade-up-3 { animation: fadeUp 0.55s ease-out 0.25s both; }
        .fade-up-4 { animation: fadeUp 0.55s ease-out 0.35s both; }
        .hero-image { animation: kenBurns 16s ease-out forwards; }
      `}</style>

      {/* full-bleed background image */}
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=80"
        alt="Freshly prepared food ready for delivery"
        className="hero-image absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1D1512]/95 via-[#1D1512]/75 to-[#1D1512]/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1D1512]/80 via-transparent to-transparent lg:hidden" />

      {/* content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        {/* left: branding + tagline */}
        <div className="mb-10 hidden max-w-md lg:mb-0 lg:block">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0A438] text-sm font-bold text-[#1D1512]">
              QB
            </span>
            <span className="font-['Fraunces',serif] text-xl italic text-[#F7ECD9]">
              QuickBite
            </span>
          </Link>

          <div className="fade-up-2 mt-10">
            <h2 className="font-['Fraunces',serif] text-4xl italic leading-tight text-[#F7ECD9]">
              Good food, delivered without the wait.
            </h2>
            <p className="mt-4 max-w-sm font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#F7ECD9]/70">
              Sign in to reorder your favorites, track deliveries, and pick up
              right where you left off.
            </p>
          </div>
        </div>

        {/* right: glass form card */}
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0A438] text-sm font-bold text-[#1D1512]">
              QB
            </span>
            <span className="font-['Fraunces',serif] text-xl italic text-[#F7ECD9]">
              QuickBite
            </span>
          </Link>

          <div className="fade-up-1 rounded-2xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#F7ECD9]">
              Welcome{" "}
              <span className="font-['Fraunces',serif] italic font-normal text-[#F0A438]">
                back
              </span>
            </h1>
            <p className="mt-1 text-sm text-[#F7ECD9]/60">
              Log in to continue to your account
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="fade-up-2">
                <label className="mb-2 block text-sm font-semibold text-[#F7ECD9]/90">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F7ECD9]/40"
                    size={14}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/15 bg-white/10 p-3 pl-10 text-[#F7ECD9] placeholder-[#F7ECD9]/35 outline-none backdrop-blur-sm transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/30"
                    required
                  />
                </div>
              </div>

              <div className="fade-up-3">
                <label className="mb-2 block text-sm font-semibold text-[#F7ECD9]/90">
                  Password
                </label>
                <div className="relative">
                  <FaLock
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F7ECD9]/40"
                    size={14}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/15 bg-white/10 p-3 pl-10 pr-11 text-[#F7ECD9] placeholder-[#F7ECD9]/35 outline-none backdrop-blur-sm transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F7ECD9]/40 transition hover:text-[#F7ECD9]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="fade-up-4 w-full rounded-lg bg-[#F0A438] py-3.5 text-lg font-semibold text-[#1D1512] transition hover:bg-[#F7ECD9] disabled:opacity-60"
              >
                {loading ? "Logging in…" : "Login"}
              </button>
            </form>

            <p className="fade-up-4 mt-6 text-center text-sm text-[#F7ECD9]/60">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#F0A438] hover:text-[#F7ECD9] hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;