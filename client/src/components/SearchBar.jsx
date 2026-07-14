import { FaSearch } from "react-icons/fa";

const SearchBar = ({ search, setSearch }) => {
  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-3xl px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-2 pl-5 shadow-[0_12px_30px_-8px_rgba(29,21,18,0.25)] transition-shadow focus-within:shadow-[0_12px_34px_-6px_rgba(240,164,56,0.35)]">
        <FaSearch className="shrink-0 text-lg text-[#D64933]" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes, cuisines, or restaurants…"
          className="w-full bg-transparent py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-[15px] text-[#3A2A20] placeholder:text-[#3A2A20]/40 outline-none"
        />

        <button className="shrink-0 rounded-xl bg-[#1D1512] px-5 py-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#2A1F1A]">
          Search
        </button>
      </div>
    </section>
  );
};

export default SearchBar;