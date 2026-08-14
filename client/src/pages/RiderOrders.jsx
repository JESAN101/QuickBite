import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMotorcycle, FaBoxOpen, FaSearch, FaMapMarkerAlt, FaClock } from "react-icons/fa";

import {
  getAvailableOrders,
  getMyDeliveries,
  acceptDelivery,
  completeDelivery,
} from "../services/riderService";

const RiderOrders = () => {
  const [available, setAvailable] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("available");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availableData, myData] = await Promise.all([
        getAvailableOrders(),
        getMyDeliveries(),
      ]);
      setAvailable(availableData.orders || []);
      setMyDeliveries(myData.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      const data = await acceptDelivery(orderId);
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept delivery.");
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      const data = await completeDelivery(orderId);
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete delivery.");
    }
  };

  const filteredAvailable = available.filter((order) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      order.restaurant?.name?.toLowerCase().includes(keyword) ||
      order.user?.name?.toLowerCase().includes(keyword) ||
      order.deliveryAddress?.toLowerCase().includes(keyword)
    );
  });

  const filteredMyDeliveries = myDeliveries.filter((order) => {
    if (!search) return true;
    const keyword = search.toLowerCase();
    return (
      order.restaurant?.name?.toLowerCase().includes(keyword) ||
      order.user?.name?.toLowerCase().includes(keyword) ||
      order.deliveryAddress?.toLowerCase().includes(keyword)
    );
  });

  const renderOrderCard = (order, action) => (
    <div
      key={order._id}
      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-900">
              {order.restaurant?.name}
            </h3>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                order.orderStatus === "Out for Delivery"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{order.user?.name}</span>
            <span className="text-gray-300">|</span>
            <span>{order.user?.phone}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-500">
            <FaMapMarkerAlt className="mt-0.5 shrink-0 text-orange-400" />
            <span>{order.deliveryAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaClock />
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {order.foods.map((item) => (
              <span
                key={item._id}
                className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 ring-1 ring-orange-100"
              >
                {item.food?.name} × {item.quantity}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 md:min-w-[140px]">
          <p className="text-2xl font-extrabold text-orange-600">
            Rs. {order.totalPrice}
          </p>

          <span className="text-xs text-gray-400">
            {order.paymentMethod} · {order.paymentStatus}
          </span>

          {action}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
          Deliveries
        </h1>
        <p className="mt-1 text-gray-500">
          Pick up orders and complete deliveries
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by restaurant, customer, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-0">
        <button
          onClick={() => setTab("available")}
          className={`border-b-2 px-5 py-3 text-sm font-bold transition ${
            tab === "available"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Available to Pickup ({filteredAvailable.length})
        </button>

        <button
          onClick={() => setTab("mine")}
          className={`border-b-2 px-5 py-3 text-sm font-bold transition ${
            tab === "mine"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Deliveries ({filteredMyDeliveries.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
            <p className="text-gray-500">Loading deliveries...</p>
          </div>
        </div>
      ) : tab === "available" ? (
        filteredAvailable.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-100">
            <FaBoxOpen className="mx-auto text-5xl text-gray-300" />
            <p className="mt-4 font-medium text-gray-500">
              No orders waiting for pickup right now.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              New orders appear here as soon as restaurants mark them "Out for Delivery".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAvailable.map((order) =>
              renderOrderCard(
                order,
                <button
                  onClick={() => handleAccept(order._id)}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600"
                >
                  <FaMotorcycle />
                  Accept
                </button>
              )
            )}
          </div>
        )
      ) : filteredMyDeliveries.length === 0 ? (
        <div className="rounded-2xl bg-white p-16 text-center shadow-sm ring-1 ring-gray-100">
          <FaMotorcycle className="mx-auto text-5xl text-gray-300" />
          <p className="mt-4 font-medium text-gray-500">
            You haven't accepted any deliveries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMyDeliveries.map((order) =>
            renderOrderCard(
              order,
              order.orderStatus === "Delivered" ? (
                <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                  ✅ Delivered
                </span>
              ) : (
                <button
                  onClick={() => handleDeliver(order._id)}
                  className="rounded-xl bg-green-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-green-500/25 transition hover:bg-green-600"
                >
                  Mark Delivered
                </button>
              )
            )
          )}
        </div>
      )}
    </div>
  );
};

export default RiderOrders;
