import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";


import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../services/cartService";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { loadCart } = useCart();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
  try {
    const data = await getCart();
    setCart(data.cart);
    loadCart();
  } catch (error) {
    console.log(error);
    toast.error("Failed to load cart.");
  }
};

  const increaseQuantity = async (item) => {
    try {
      await updateCart(item._id, item.quantity + 1);
      fetchCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity.");
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity === 1) return;

    try {
      await updateCart(item._id, item.quantity - 1);
      fetchCart();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update quantity.");
    }
  };

  const deleteItem = async (id) => {
    const loadingToast = toast.loading("Removing item...");

    try {
      await removeFromCart(id);

      toast.dismiss(loadingToast);
      toast.success("Item removed from cart.");

      fetchCart();
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);
      toast.error("Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    const loadingToast = toast.loading("Clearing cart...");

    try {
      await clearCart();

      toast.dismiss(loadingToast);
      toast.success("Cart cleared successfully.");

      fetchCart();
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);
      toast.error("Failed to clear cart.");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  const deliveryFee = subtotal >= 1000 ? 0 : 100;
  const grandTotal = subtotal + deliveryFee;

  if (cart.length === 0) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-12 text-center shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)]">
        <div className="text-6xl">🛒</div>

        <h1 className="mt-6 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          Your{" "}
          <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
            Cart
          </span>{" "}
          is Empty
        </h1>

        <p className="mt-3 text-[#3A2A20]/60">
          Looks like you haven't added any delicious food yet.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-lg bg-[#1D1512] px-8 py-3 font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
        >
          Browse Foods
        </button>
      </div>
    </div>
  );
}

return (
  <div className="mx-auto max-w-7xl px-6 py-14">
    {/* Header */}

    <div className="mb-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-bold text-[#1D1512]">
          My{" "}
          <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
            Cart
          </span>
        </h1>

        <p className="mt-2 text-[#3A2A20]/60">
          Review your selected meals before checkout.
        </p>
      </div>

      <button
        onClick={handleClearCart}
        className="rounded-lg bg-[#D64933] px-6 py-3 font-semibold text-white transition hover:bg-[#B73927]"
      >
        Clear Cart
      </button>
    </div>

    <div className="grid gap-10 lg:grid-cols-3">
      {/* Cart Items */}

      <div className="space-y-6 lg:col-span-2">
        {cart.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)]"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-5">
                <img
                  src={`http://localhost:5000/uploads/${item.food.image}`}
                  alt={item.food.name}
                  className="h-32 w-32 rounded-xl object-cover"
                />

                <div>
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#1D1512]">
                    {item.food.name}
                  </h2>

                  <p className="mt-2 text-sm text-[#3A2A20]/65">
                    {item.food.description}
                  </p>

                  {item.food.restaurant && (
                    <p className="mt-3 text-sm text-[#3A2A20]/55">
                      🍴 {item.food.restaurant.name}
                    </p>
                  )}

                  <p className="mt-4 text-xl font-bold text-[#F0A438]">
                    Rs. {item.food.price}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-5">
                {/* Quantity */}

                <div className="flex overflow-hidden rounded-lg border border-[#EADFC8]">
                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="bg-[#F7ECD9] px-4 py-2 text-lg font-bold transition hover:bg-[#F0A438]"
                  >
                    −
                  </button>

                  <div className="flex items-center justify-center border-x border-[#EADFC8] bg-white px-6 font-semibold">
                    {item.quantity}
                  </div>

                  <button
                    onClick={() => increaseQuantity(item)}
                    className="bg-[#F7ECD9] px-4 py-2 text-lg font-bold transition hover:bg-[#F0A438]"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-[#3A2A20]/55">
                    Item Total
                  </p>

                  <p className="text-2xl font-bold text-[#D64933]">
                    Rs. {item.food.price * item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="rounded-lg bg-[#D64933] px-5 py-2 font-medium text-white transition hover:bg-[#B73927]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}

      <div>
        <div className="sticky top-24 rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-8 shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)]">
          <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
            Order{" "}
            <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
              Summary
            </span>
          </h2>

          <div className="mt-8 space-y-5 text-[#3A2A20]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                Rs. {subtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>

              {deliveryFee === 0 ? (
                <span className="font-semibold text-green-600">
                  FREE
                </span>
              ) : (
                <span className="font-semibold">
                  Rs. {deliveryFee}
                </span>
              )}
            </div>

            <hr className="border-[#EADFC8]" />

            <div className="flex justify-between text-2xl font-bold text-[#1D1512]">
              <span>Total</span>

              <span className="text-[#F0A438]">
                Rs. {grandTotal}
              </span>
            </div>
          </div>

          {deliveryFee === 0 && (
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              🎉 Congratulations! You qualified for FREE delivery.
            </div>
          )}

          <button
            onClick={() => navigate("/checkout")}
            className="mt-8 w-full rounded-lg bg-[#1D1512] py-4 text-lg font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          🛒 My Cart
        </h1>

        <button
          onClick={handleClearCart}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg transition"
        >
          Clear Cart
        </button>

      </div>

      {/* Cart Items */}

      <div className="space-y-6">

        {cart.map((item) => (

          <div
            key={item._id}
            className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl shadow-lg p-5 gap-6"
          >

            <div className="flex gap-5">

              <img
                src={`http://localhost:5000/uploads/${item.food.image}`}
                alt={item.food.name}
                className="w-32 h-32 rounded-lg object-cover"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  {item.food.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {item.food.description}
                </p>

                {item.food.restaurant && (
                  <p className="text-sm text-gray-400 mt-2">
                    🍴 {item.food.restaurant.name}
                  </p>
                )}

                <p className="text-orange-500 font-bold text-lg mt-3">
                  Rs. {item.food.price}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-5">

              <div className="flex items-center">

                <button
                  onClick={() => decreaseQuantity(item)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l-lg"
                >
                  −
                </button>

                <div className="border-y border-gray-300 px-5 py-2 font-bold">
                  {item.quantity}
                </div>

                <button
                  onClick={() => increaseQuantity(item)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-lg"
                >
                  +
                </button>

              </div>

              <div className="text-xl font-bold text-orange-500 w-28 text-center">
                Rs. {item.food.price * item.quantity}
              </div>

              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
              >
                Remove
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Order Summary */}

      <div className="mt-12 bg-white rounded-xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-8">
          Order Summary
        </h2>

        <div className="space-y-4 text-lg">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>

            {deliveryFee === 0 ? (
              <span className="text-green-600 font-semibold">
                FREE
              </span>
            ) : (
              <span>Rs. {deliveryFee}</span>
            )}

          </div>

          <hr />

          <div className="flex justify-between text-2xl font-bold">

            <span>Total</span>

            <span className="text-orange-500">
              Rs. {grandTotal}
            </span>

          </div>

        </div>

        {deliveryFee === 0 && (
          <p className="mt-6 text-green-600 font-medium">
            🎉 Congratulations! You qualified for FREE delivery.
          </p>
        )}

        <button
          onClick={() => navigate("/checkout")}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg text-lg font-semibold transition"
        >
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
};

export default Cart;