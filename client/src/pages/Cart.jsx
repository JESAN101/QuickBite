import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../services/cartService";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQuantity = async (item) => {
    try {
      await updateCart(item._id, item.quantity + 1);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const decreaseQuantity = async (item) => {
    if (item.quantity === 1) return;

    try {
      await updateCart(item._id, item.quantity - 1);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      fetchCart();
    } catch (error) {
      console.log(error);
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
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-5xl font-bold mb-4">
          🛒 Your Cart is Empty
        </h1>

        <p className="text-gray-500 text-lg mb-8">
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition"
        >
          Browse Foods
        </button>
      </div>
    );
  }

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

            {/* Left */}

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

            {/* Right */}

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