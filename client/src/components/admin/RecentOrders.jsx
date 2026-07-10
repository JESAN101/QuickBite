import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderService";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();

      // Show newest first
      setOrders(data.orders.slice().reverse());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Recent Orders
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Customer</th>

              <th className="p-3 text-left">Restaurant</th>

              <th className="p-3 text-left">Total</th>

              <th className="p-3 text-left">Payment</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order._id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-3">
                  {order.user?.name}
                </td>

                <td className="p-3">
                  {order.restaurant?.name}
                </td>

                <td className="p-3">
                  Rs. {order.totalPrice}
                </td>

                <td className="p-3">
                  {order.paymentStatus}
                </td>

                <td className="p-3">
                  {order.orderStatus}
                </td>

                <td className="p-3">
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default RecentOrders;
