// Restaurants.jsx
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
    <section className="mx-auto max-w-7xl bg-[#FFFBF3] px-6 py-16">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
          Where it comes from
        </span>
        <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          Kitchens worth knowing
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
};

export default Restaurants;