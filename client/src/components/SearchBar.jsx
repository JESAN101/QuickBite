import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
  return (
    <section className="max-w-6xl mx-auto -mt-8 px-4 relative z-10">
      <div className="bg-white shadow-xl rounded-xl p-4 flex items-center gap-3">

        <FaSearch className="text-orange-500 text-xl" />

        <input
          type="text"
          placeholder="Search food, restaurants..."
          className="w-full outline-none text-lg"
        />

        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
          Search
        </button>

      </div>
    </section>
  );
};

export default SearchBar;