import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getFoodById } from "../services/foodService";
import { addToCart } from "../services/cartService";

const FoodDetails = () => {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const data = await getFoodById(id);
        setFood(data.food);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, [id]);

  const handleAddToCart = async () => {
  const loadingToast = toast.loading("Adding to cart...");

  try {
    const data = await addToCart(food._id, quantity);

    toast.dismiss(loadingToast);
    toast.success(data.message);
  } catch (error) {
    toast.dismiss(loadingToast);
    console.log(error);

    if (error.response?.status === 401) {
      toast.error("Please login first.");
    } else {
      toast.error(
        error.response?.data?.message ||
          "Failed to add item to cart."
      );
    }
  }
};

  if (!food) {
    return (
      <div className="text-center py-20 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <img
          src={`http://localhost:5000/uploads/${food.image}`}
          alt={food.name}
          className="w-full h-[450px] object-cover rounded-xl shadow-lg"
        />

        <div>
          <h1 className="text-5xl font-bold">
            {food.name}
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            {food.description}
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-8">
            Rs. {food.price}
          </h2>

          <div className="mt-8 space-y-3">
            <p>
              <strong>Restaurant:</strong>{" "}
              {food.restaurant?.name}
            </p>

            <p>
              <strong>Category:</strong>{" "}
              {food.category?.name}
            </p>

            <p>
              <strong>Preparation Time:</strong>{" "}
              {food.preparationTime} mins
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {food.isAvailable ? "Available" : "Unavailable"}
            </p>
          </div>

          {/* Quantity */}
          <div className="mt-8 flex items-center gap-4">
            <button
              onClick={() =>
                quantity > 1 &&
                setQuantity(quantity - 1)
              }
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>

            <span className="text-2xl font-bold">
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity(quantity + 1)
              }
              className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>

          {/* Add To Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;