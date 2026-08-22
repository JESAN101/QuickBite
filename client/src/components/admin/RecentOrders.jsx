import { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderService";
import { getStatusBadgeClass } from "../../utils/orderStatus";

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data.orders.slice().reverse().slice(0, 8));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">
          Recent Orders
        </h2>
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
          Latest {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80">
              <th className="px-6 py-3.5 font-semibold text-gray-500">Customer</th>
              <th className="px-6 py-3.5 font-semibold text-gray-500">Restaurant</th>
              <th className="px-6 py-3.5 text-center font-semibold text-gray-500">Total</th>
              <th className="px-6 py-3.5 text-center font-semibold text-gray-500">Payment</th>
              <th className="px-6 py-3.5 text-center font-semibold text-gray-500">Status</th>
              <th className="px-6 py-3.5 text-center font-semibold text-gray-500">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="transition hover:bg-orange-50/30"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {order.user?.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {order.restaurant?.name}
                  </td>

                  <td className="px-6 py-4 text-center font-bold text-gray-900">
                    Rs. {order.totalPrice}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusBadgeClass(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
