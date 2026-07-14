const RestaurantFilter = ({
  restaurants,
  selectedRestaurant,
  setSelectedRestaurant,
}) => {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#3A2A20]/50">
        Filter by restaurant
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-[#EADFC8]">
        <button
          onClick={() => setSelectedRestaurant("all")}
          className={`relative pb-3 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold transition ${
            selectedRestaurant === "all"
              ? "text-[#1D1512]"
              : "text-[#3A2A20]/45 hover:text-[#1D1512]"
          }`}
        >
          All Restaurants
          {selectedRestaurant === "all" && (
            <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#D64933]" />
          )}
        </button>

        {restaurants.map((restaurant) => (
          <button
            key={restaurant._id}
            onClick={() => setSelectedRestaurant(restaurant._id)}
            className={`relative pb-3 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold transition ${
              selectedRestaurant === restaurant._id
                ? "text-[#1D1512]"
                : "text-[#3A2A20]/45 hover:text-[#1D1512]"
            }`}
          >
            {restaurant.name}
            {selectedRestaurant === restaurant._id && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#D64933]" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default RestaurantFilter;