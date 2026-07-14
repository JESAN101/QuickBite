import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getRestaurantById } from "../services/restaurantService";
import { getFoodsByRestaurant } from "../services/foodService";

const Restaurant = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data.restaurant);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchFoods = async () => {
      try {
        const data = await getFoodsByRestaurant(id);
        setFoods(data.foods);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurant();
    fetchFoods();
  }, [id]);

  if (!restaurant) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFFBF3]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EADFC8] border-t-[#F0A438]" />
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#3A2A20]/50">
            Loading restaurant…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF3] py-14">
      <div className="mx-auto max-w-6xl px-6">
        {/* Restaurant hero */}
        <div className="relative">
          <img
            src={`http://localhost:5000/uploads/${restaurant.image}`}
            alt={restaurant.name}
            className="h-[320px] w-full rounded-2xl object-cover shadow-[0_20px_40px_-16px_rgba(29,21,18,0.25)] md:h-[420px]"
          />

          <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-[#1D1512]/80 via-[#1D1512]/20 to-transparent p-8">
            <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#F7ECD9] md:text-5xl">
              {restaurant.name}
            </h1>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <p className="text-lg leading-relaxed text-[#3A2A20]/65 sm:col-span-2">
            {restaurant.description}
          </p>

          <div className="flex items-center gap-3 rounded-lg border border-[#EADFC8] bg-white p-4">
            <span className="text-xl">📍</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2A20]/45">
                Address
              </p>
              <p className="mt-1 font-semibold text-[#1D1512]">
                {restaurant.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-[#EADFC8] bg-white p-4">
            <span className="text-xl">📞</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2A20]/45">
                Phone
              </p>
              <p className="mt-1 font-semibold text-[#1D1512]">
                {restaurant.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px w-full bg-[#EADFC8]" />

        {/* Menu */}
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D64933]/25 bg-[#D64933]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
            Menu
          </span>
          <h2 className="font-['Fraunces',serif] text-3xl italic text-[#1D1512]">
            What's cooking
          </h2>
        </div>

        {foods.length === 0 ? (
          <p className="text-[#3A2A20]/50">No dishes available yet.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {foods.map((food) => (
              <div
                key={food._id}
                className="group overflow-hidden rounded-2xl border border-[#EADFC8] bg-white shadow-sm transition hover:shadow-[0_20px_40px_-16px_rgba(29,21,18,0.25)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:5000/uploads/${food.image}`}
                    alt={food.name}
                    className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  {!food.isAvailable && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#D64933]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#F7ECD9]">
                      Unavailable
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
                    {food.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#3A2A20]/60">
                    {food.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-['Fraunces',serif] text-2xl italic text-[#D64933]">
                      Rs. {food.price}
                    </p>

                    <Link
                      to={`/food/${food._id}`}
                      className="rounded-lg bg-[#1D1512] px-5 py-2.5 text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;