import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCart,
  clearCart,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cart.");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 1000 ? 0 : 100;

  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Placing your order...");

    try {
      const orderData = {
        restaurant: cart[0].food.restaurant,

        foods: cart.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),

        totalPrice: total,

        deliveryAddress: address,

        paymentMethod,
      };

      const response = await placeOrder(orderData);

      // Clear cart
      await clearCart();

      toast.dismiss(loadingToast);
      toast.success(response.message);

      navigate("/order-success");
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-8">
        Checkout
      </h1>

      {/* Order Summary */}

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Order Summary
        </h2>

        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-3"
          >
            <div>
              <h3 className="font-semibold">
                {item.food.name}
              </h3>

              <p className="text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="font-semibold">
              Rs. {item.food.price * item.quantity}
            </div>
          </div>
        ))}

        <div className="mt-6 space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee</span>

            <span>
              {deliveryFee === 0
                ? "FREE"
                : `Rs. ${deliveryFee}`}
            </span>
          </div>

          <hr />

          <div className="flex justify-between text-2xl font-bold text-orange-500">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>

        </div>

      </div>

      {/* Delivery Address */}

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Delivery Address
        </h2>

        <textarea
          rows="4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter complete delivery address..."
          className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

      </div>

      {/* Payment */}

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">

        <h2 className="text-2xl font-bold mb-5">
          Payment Method
        </h2>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Cash">
            Cash on Delivery
          </option>

          <option value="eSewa">
            eSewa
          </option>

          <option value="Khalti">
            Khalti
          </option>

        </select>

      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-lg text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? "Placing Order..."
          : "Place Order"}
      </button>

    </div>
  );
};

export default Checkout;