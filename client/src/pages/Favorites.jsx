import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeartBroken, FaShoppingCart } from "react-icons/fa";

import { getFavorites, removeFavorite } from "../services/favoriteService";
import { addToCart } from "../services/cartService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.favorites);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);
      toast.success("Removed from favorites");
      fetchFavorites();
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove favorite.");
    }
  };

  const handleAddToCart = async (foodId) => {
    try {
      const response = await addToCart(foodId, 1);
      toast.success(response.message || "Added to cart.");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-dashed border-[#EADFC8] bg-[#FFFBF3] py-20 text-center">
          <FaHeartBroken className="mx-auto text-3xl text-[#D64933]/50" />
          <p className="mt-4 font-['Fraunces',serif] text-3xl italic text-[#1D1512]/70">
            No favorites yet.
          </p>
          <p className="mt-3 text-sm text-[#3A2A20]/50">
            Save dishes you love and they'll show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
          Saved for later
        </span>
        <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          My Favorites
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((item) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-2xl border border-[#EADFC8]/70 bg-[#FFFBF3] shadow-[0_8px_20px_-10px_rgba(29,21,18,0.2)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_-12px_rgba(29,21,18,0.3)]"
          >
            <Link to={`/food/${item.food._id}`}>
              <img
                src={`http://localhost:5000/uploads/${item.food.image}`}
                alt={item.food.name}
                className="h-52 w-full object-cover"
              />
            </Link>

            <div className="p-5">
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
                {item.food.name}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-sm text-[#3A2A20]/60">
                {item.food.description}
              </p>
              <p className="mt-3 font-['Fraunces',serif] text-xl font-semibold text-[#D64933]">
                Rs. {item.food.price}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => handleAddToCart(item.food._id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1D1512] py-2.5 text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
                >
                  <FaShoppingCart className="text-xs" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="rounded-lg border border-[#EADFC8] px-4 text-sm font-semibold text-[#3A2A20]/70 transition hover:border-[#D64933]/40 hover:text-[#D64933]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;