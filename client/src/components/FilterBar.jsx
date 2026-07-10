const FilterBar = ({
  sortBy,
  setSortBy,
  clearFilters,
  foodCount,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex items-center gap-4">

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="newest">
            Newest
          </option>

          <option value="priceLow">
            Price: Low → High
          </option>

          <option value="priceHigh">
            Price: High → Low
          </option>

          <option value="name">
            Name (A-Z)
          </option>
        </select>

        <button
          onClick={clearFilters}
          className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg transition"
        >
          🧹 Clear Filters
        </button>

      </div>

      <div className="font-semibold text-gray-600">
        Showing {foodCount} food{foodCount !== 1 ? "s" : ""}
      </div>

    </div>
  );
};

export default FilterBar;