import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaStar, FaShoppingCart } from "react-icons/fa";

import { addToCart } from "../services/cartService";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

const FoodCard = ({ food }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { loadCart } = useCart();
  const favorited = isFavorite(food._id);

  const handleAddToCart = async (e) => {
  e.preventDefault();
  try {
    const response = await addToCart(food._id, 1);
    toast.success(response.message);
    loadCart();
  } catch (error) {
    console.log(error);
    if (error.response?.status === 401) {
      toast.error("Please login first.");
    } else {
      toast.error("Failed to add to cart.");
    }
  }
};

  const handleFavorite = async (e) => {
    e.preventDefault();
    try {
      await toggleFavorite(food._id);
      toast.success(favorited ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        toast.error("Please login first.");
      } else {
        toast.error(error.response?.data?.message || "Failed to update favorites.");
      }
    }
  };

  return (
    <Link
      to={`/food/${food._id}`}
      className="group block overflow-hidden rounded-2xl border border-[#EADFC8]/70 bg-[#FFFBF3] shadow-[0_8px_20px_-10px_rgba(29,21,18,0.2)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_-12px_rgba(29,21,18,0.3)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt={food.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* rating badge — only shown when the food actually has reviews */}
        {food.rating > 0 && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#1D1512]/85 px-2.5 py-1 text-xs font-semibold text-[#F7ECD9] backdrop-blur-sm">
            <FaStar className="text-[#F0A438]" />
            {food.rating.toFixed(1)}
          </span>
        )}

        <button
          onClick={handleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFBF3]/90 text-[#D64933] shadow-md backdrop-blur-sm transition hover:scale-110"
        >
          {favorited ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
          {food.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[#3A2A20]/60">
          {food.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-['Fraunces',serif] text-xl font-semibold text-[#D64933]">
            Rs. {food.price}
          </span>

          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 rounded-lg bg-[#1D1512] px-4 py-2 text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
          >
            <FaShoppingCart className="text-xs" />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;