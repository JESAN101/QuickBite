import { useEffect, useState } from "react";
import { getRestaurants } from "../services/restaurantService";
import RestaurantCard from "./RestaurantCard";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data.restaurants);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold mb-8">
        Popular Restaurants
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant._id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </section>
  );
};

export default Restaurants;