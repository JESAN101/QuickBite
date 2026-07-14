const FilterBar = ({ sortBy, setSortBy, clearFilters, foodCount }) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-lg border border-[#EADFC8] bg-[#FFFBF3] py-2.5 pl-4 pr-10 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#1D1512] outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25"
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="name">Name (A–Z)</option>
          </select>
          <svg
            className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#3A2A20]/50"
            viewBox="0 0 12 8"
            fill="none"
          >
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <button
          onClick={clearFilters}
          className="rounded-lg border border-[#EADFC8] bg-transparent px-4 py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#3A2A20]/70 transition hover:border-[#D64933]/40 hover:text-[#D64933]"
        >
          Clear filters
        </button>
      </div>

      <div className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#3A2A20]/60">
        Showing{" "}
        <span className="font-['Fraunces',serif] font-semibold text-[#1D1512]">
          {foodCount}
        </span>{" "}
        food{foodCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default FilterBar;