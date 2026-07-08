import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">
          No Orders Yet
        </h1>

        <p className="text-gray-500 mt-4">
          Your placed orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-4xl font-bold mb-10">
        My Orders
      </h1>

      <div className="space-y-8">

        {orders.map((order) => (

          <div
            key={order._id}
            className="bg-white rounded-xl shadow-lg p-6"
          >

            <div className="flex justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold">
                  {order.restaurant?.name}
                </h2>

                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-orange-500 text-xl">
                  Rs. {order.totalPrice}
                </p>

                <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full">
                  {order.orderStatus}
                </span>

              </div>

            </div>

            <hr />

            <div className="mt-5 space-y-3">

              {order.foods.map((item) => (

                <div
                  key={item.food._id}
                  className="flex justify-between"
                >

                  <span>
                    {item.food.name}
                  </span>

                  <span>
                    x {item.quantity}
                  </span>

                </div>

              ))}

            </div>

            <hr className="my-5" />

            <p>
              <strong>Delivery:</strong>{" "}
              {order.deliveryAddress}
            </p>

            <p className="mt-2">
              <strong>Payment:</strong>{" "}
              {order.paymentMethod}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Orders;