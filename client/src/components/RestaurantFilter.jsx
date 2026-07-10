const RestaurantFilter = ({
  restaurants,
  selectedRestaurant,
  setSelectedRestaurant,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">

      <h2 className="text-2xl font-bold mb-6">
        Filter by Restaurant
      </h2>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => setSelectedRestaurant("all")}
          className={`px-5 py-2 rounded-full transition ${
            selectedRestaurant === "all"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          All Restaurants
        </button>

        {restaurants.map((restaurant) => (
          <button
            key={restaurant._id}
            onClick={() =>
              setSelectedRestaurant(
                restaurant._id
              )
            }
            className={`px-5 py-2 rounded-full transition ${
              selectedRestaurant === restaurant._id
                ? "bg-orange-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {restaurant.name}
          </button>
        ))}

      </div>

    </section>
  );
};

export default RestaurantFilter;