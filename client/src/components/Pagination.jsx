import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const variants = {
  storefront:
    "border-[#EADFC8] bg-[#FFFBF3] text-[#1D1512] hover:bg-[#F0A438] hover:text-[#1D1512]",
  admin: "bg-gray-800 text-white hover:bg-gray-700",
};

// Reusable Previous / Next pagination controls.
const Pagination = ({ page, totalPages, onChange, variant = "storefront" }) => (
  <div className="mt-10 flex items-center justify-center gap-6">
    <button
      onClick={() => onChange(page - 1)}
      disabled={page <= 1}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        variants[variant]
      }`}
    >
      <FaChevronLeft className="text-xs" />
      Previous
    </button>

    <span className="text-sm font-semibold text-[#3A2A20]/60">
      Page {page} of {totalPages}
    </span>

    <button
      onClick={() => onChange(page + 1)}
      disabled={page >= totalPages}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        variants[variant]
      }`}
    >
      Next
      <FaChevronRight className="text-xs" />
    </button>
  </div>
);

export default Pagination;
