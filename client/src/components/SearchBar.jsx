import { FaSearch } from "react-icons/fa";

const SearchBar = ({ search, setSearch }) => {
  return (
    <section className="max-w-6xl mx-auto -mt-8 px-4 relative z-10">
      <div className="bg-white shadow-xl rounded-xl p-4 flex items-center gap-3">

        <FaSearch className="text-orange-500 text-xl" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search foods..."
          className="w-full outline-none text-lg"
        />

      </div>
    </section>
  );
};

export default SearchBar;