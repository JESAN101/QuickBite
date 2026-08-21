import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaSearch,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

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
  const map = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Preparing: "bg-blue-100 text-blue-700 border-blue-200",
    "Out for Delivery": "bg-purple-100 text-purple-700 border-purple-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
    Cancelled: "bg-red-100 text-red-600 border-red-200",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
        error.response?.data?.message || "Failed to update order."
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(keyword) ||
      order.deliveryAddress?.toLowerCase().includes(keyword) ||
      order.orderStatus.toLowerCase().includes(keyword);
    const matchesStatus =
      statusFilter === "All" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const preparingOrders = orders.filter((o) => o.orderStatus === "Preparing").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
          Orders
        </h1>
        <p className="mt-1 text-gray-500">
          Manage and update your restaurant's incoming orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <FaClipboardList />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Total</p>
              <p className="text-2xl font-extrabold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
              <FaClock />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Pending</p>
              <p className="text-2xl font-extrabold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaClock />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Preparing</p>
              <p className="text-2xl font-extrabold text-gray-900">{preparingOrders}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <FaCheckCircle />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">Delivered</p>
              <p className="text-2xl font-extrabold text-gray-900">{deliveredOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === tab
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1">
                  ({orders.filter((o) => o.orderStatus === tab).length})
                </span>
              )}
            </button>
          )
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
            <p className="text-gray-500">Loading Orders...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-6 py-4 font-semibold text-gray-500">Customer</th>
                  <th className="px-6 py-4 font-semibold text-gray-500">Items</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">Total</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">Payment</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">Address</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">Date</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-500">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                      No orders match your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="transition hover:bg-orange-50/30">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{order.user?.name}</p>
                        <p className="text-xs text-gray-400">{order.user?.phone}</p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.foods.map((item) => (
                            <div key={item._id} className="text-sm text-gray-600">
                              {item.food?.name} × {item.quantity}
                            </div>
                          ))}
                        </div>

                        {order.discount > 0 && (
                          <div className="mt-1 text-xs font-semibold text-green-600">
                            Coupon - Rs. {order.discount}
                          </div>
                        )}

                        {order.rider && (
                          <div className="mt-1 text-xs font-semibold text-purple-600">
                            🏍 Rider: {order.rider.name}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center font-bold text-gray-900">
                        Rs. {order.totalPrice}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-gray-700">{order.paymentMethod}</span>
                        <div className="text-xs text-gray-400">{order.paymentStatus}</div>
                      </td>

                      <td className="max-w-[160px] truncate px-6 py-4 text-center text-sm text-gray-600" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </td>

                      <td className="px-6 py-4 text-center text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getStatusColor(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>

                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                          >
                            {orderStatuses.map((status) => (
                              <option key={status} value={status}>
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
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
