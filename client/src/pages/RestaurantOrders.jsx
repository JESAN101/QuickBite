import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMyOrders,
  updateMyOrderStatus,
} from "../services/restaurantService";

const orderStatuses = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500";
    case "Preparing":
      return "bg-blue-500";
    case "Out for Delivery":
      return "bg-purple-500";
    case "Delivered":
      return "bg-green-500";
    case "Cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await getMyOrders();

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      const data = await updateMyOrderStatus(orderId, orderStatus);

      toast.success(data.message);

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update order."
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();

    return (
      order.user?.name?.toLowerCase().includes(keyword) ||
      order.deliveryAddress.toLowerCase().includes(keyword) ||
      order.orderStatus.toLowerCase().includes(keyword)
    );
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.orderStatus === "Pending"
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.orderStatus === "Delivered"
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          My Orders
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your restaurant's incoming orders
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-3xl font-bold text-green-500 mt-1">
            {deliveredOrders}
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by customer, address or status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-96 border rounded-lg px-4 py-3"
      />

      {loading ? (
        <div className="text-center py-20 text-xl">
          Loading Orders...
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-center">Total</th>
                <th className="p-4 text-center">Payment</th>
                <th className="p-4 text-center">Address</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    No Orders Found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <p className="font-semibold">
                        {order.user?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.phone}
                      </p>
                    </td>

                    <td className="p-4">
                      {order.foods.map((item) => (
                        <div
                          key={item._id}
                          className="text-sm"
                        >
                          {item.food?.name} × {item.quantity}
                        </div>
                      ))}

                      {order.discount > 0 && (
                        <div className="text-xs text-green-600 font-semibold mt-1">
                          Coupon - Rs. {order.discount}
                        </div>
                      )}

                      {order.rider && (
                        <div className="text-xs text-purple-600 font-semibold mt-1">
                          🏍 Rider: {order.rider.name}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-center font-semibold">
                      Rs. {order.totalPrice}
                    </td>

                    <td className="p-4 text-center">
                      {order.paymentMethod}
                      <div className="text-xs text-gray-500">
                        {order.paymentStatus}
                      </div>
                    </td>

                    <td className="p-4 text-center text-sm max-w-[160px]">
                      {order.deliveryAddress}
                    </td>

                    <td className="p-4 text-center text-sm">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="border rounded-lg px-2 py-1 text-sm"
                        >
                          {orderStatuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
