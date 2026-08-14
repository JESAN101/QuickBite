import { Link } from "react-router-dom";
import { FaHamburger } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#1D1512] px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F0A438]/15">
          <FaHamburger className="text-3xl text-[#F0A438]" />
        </div>

        <h1 className="mt-8 font-['Fraunces',serif] text-7xl italic font-bold text-[#F0A438]">
          404
        </h1>

        <h2 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#F7ECD9]">
          This dish isn't on the menu
        </h2>

        <p className="mx-auto mt-3 max-w-sm font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#F7ECD9]/60">
          The page you're looking for was moved, deleted, or never existed.
          Let's get you back to something delicious.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="w-full rounded-lg bg-[#F0A438] px-6 py-3 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#1D1512] transition hover:bg-[#F7ECD9] sm:w-auto"
          >
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full rounded-lg border border-[#F7ECD9]/20 px-6 py-3 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#F7ECD9] transition hover:border-[#F0A438] hover:text-[#F0A438] sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
