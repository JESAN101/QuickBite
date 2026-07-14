import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getFoodById } from "../services/foodService";
import { addToCart } from "../services/cartService";

const FoodDetails = () => {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

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
    setAdding(true);
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
          error.response?.data?.message || "Failed to add item to cart."
        );
      }
    } finally {
      setAdding(false);
    }
  };

  if (!food) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFFBF3]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EADFC8] border-t-[#F0A438]" />
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#3A2A20]/50">
            Loading dish details…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF3] py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          {/* image */}
          <div className="relative">
            <img
              src={`http://localhost:5000/uploads/${food.image}`}
              alt={food.name}
              className="h-[420px] w-full rounded-2xl object-cover shadow-[0_20px_40px_-16px_rgba(29,21,18,0.25)] md:h-[480px]"
            />

            <span
              className={`absolute left-4 top-4 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] shadow-sm ${
                food.isAvailable
                  ? "bg-[#2E7D4F]/90 text-[#F7ECD9]"
                  : "bg-[#D64933]/90 text-[#F7ECD9]"
              }`}
            >
              {food.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* details */}
          <div>
            {food.category?.name && (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D64933]/25 bg-[#D64933]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
                {food.category.name}
              </span>
            )}

            <h1 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-bold leading-tight text-[#1D1512] md:text-5xl">
              {food.name}
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-[#3A2A20]/65">
              {food.description}
            </p>

            <p className="mt-6 font-['Fraunces',serif] text-4xl italic text-[#D64933]">
              Rs. {food.price}
            </p>

            {/* meta info */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#EADFC8] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2A20]/45">
                  Restaurant
                </p>
                <p className="mt-1 font-semibold text-[#1D1512]">
                  {food.restaurant?.name || "—"}
                </p>
              </div>

              <div className="rounded-lg border border-[#EADFC8] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2A20]/45">
                  Prep time
                </p>
                <p className="mt-1 font-semibold text-[#1D1512]">
                  {food.preparationTime} mins
                </p>
              </div>

              <div className="rounded-lg border border-[#EADFC8] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#3A2A20]/45">
                  Category
                </p>
                <p className="mt-1 font-semibold text-[#1D1512]">
                  {food.category?.name || "—"}
                </p>
              </div>
            </div>

            {/* quantity */}
            <div className="mt-10">
              <p className="mb-3 text-sm font-semibold text-[#1D1512]">
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#EADFC8] bg-white text-lg font-semibold text-[#1D1512] transition hover:border-[#F0A438] disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <span className="w-8 text-center font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#1D1512]">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#EADFC8] bg-white text-lg font-semibold text-[#1D1512] transition hover:border-[#F0A438]"
                >
                  +
                </button>
              </div>
            </div>

            {/* add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!food.isAvailable || adding}
              className="mt-10 w-full rounded-lg bg-[#1D1512] py-4 text-lg font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {!food.isAvailable
                ? "Currently unavailable"
                : adding
                ? "Adding…"
                : `Add to cart · Rs. ${food.price * quantity}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;