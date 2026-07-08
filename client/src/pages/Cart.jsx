import { useEffect, useState } from "react";
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../services/cartService";

const Cart = () => {
  const [cart, setCart] = useState([]);

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

  const total = cart.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">
          Your Cart is Empty
        </h1>

        <p className="text-gray-500 mt-4">
          Add some delicious food first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          My Cart
        </h1>

        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
        >
          Clear Cart
        </button>

      </div>

      <div className="space-y-6">

        {cart.map((item) => (

          <div
            key={item._id}
            className="flex items-center justify-between bg-white shadow-lg rounded-xl p-5"
          >

            <div className="flex items-center gap-5">

              <img
                src={`http://localhost:5000/uploads/${item.food.image}`}
                alt={item.food.name}
                className="w-28 h-28 object-cover rounded-lg"
              />

              <div>

                <h2 className="text-2xl font-bold">
                  {item.food.name}
                </h2>

                <p className="text-gray-600">
                  Rs. {item.food.price}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => decreaseQuantity(item)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                -
              </button>

              <span className="text-xl font-bold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(item)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                +
              </button>

            </div>

            <div className="text-xl font-bold text-orange-500">
              Rs. {item.food.price * item.quantity}
            </div>

            <button
              onClick={() => deleteItem(item._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Remove
            </button>

          </div>

        ))}

      </div>

      <div className="mt-10 bg-white shadow-lg rounded-xl p-6">

        <div className="flex justify-between text-2xl font-bold">

          <span>Total</span>

          <span>Rs. {total}</span>

        </div>

        <button
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg text-lg font-semibold"
        >
          Proceed to Checkout
        </button>

      </div>

    </div>
  );
};

export default Cart;