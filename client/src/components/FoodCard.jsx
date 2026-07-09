import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { addToCart } from "../services/cartService";
import { useFavorites } from "../context/FavoritesContext";

const FoodCard = ({ food }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = async () => {
  try {
    const response = await addToCart(food._id, 1);

    toast.success(response.message);
  } catch (error) {
    console.log(error);

    if (error.response?.status === 401) {
      toast.error("Please login first.");
    } else {
      toast.error("Failed to add to cart.");
    }
  }
};

  const handleFavorite = async () => {
  try {
    await toggleFavorite(food._id);

    if (isFavorite(food._id)) {
      toast("Removed from favorites", {
        icon: "💔",
      });
    } else {
      toast.success("Added to favorites ❤️");
    }
  } catch (error) {
    console.log(error);

    if (error.response?.status === 401) {
      toast.error("Please login first.");
    } else {
      toast.error(
        error.response?.data?.message ||
        "Failed to update favorites."
      );
    }
  }
};

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">

      {/* Favorite Button */}

      <button
        onClick={handleFavorite}
        className="absolute top-3 right-3 bg-white rounded-full w-10 h-10 shadow flex items-center justify-center text-2xl hover:scale-110 transition z-10"
      >
        {isFavorite(food._id) ? "❤️" : "🤍"}
      </button>

      <Link to={`/food/${food._id}`}>
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt={food.name}
          className="w-full h-56 object-cover"
        />

        <div className="p-4">

          <h3 className="text-xl font-bold">
            {food.name}
          </h3>

          <p className="text-gray-600 mt-2 line-clamp-2">
            {food.description}
          </p>

        </div>
      </Link>

      <div className="flex justify-between items-center px-4 pb-4">

        <span className="text-orange-500 font-bold text-lg">
          Rs. {food.price}
        </span>

        <button
          onClick={handleAddToCart}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Add to Cart
        </button>

      </div>

    </div>
  );
};

export default FoodCard;