import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMotorcycle, FaBoxOpen } from "react-icons/fa";

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
      toast.error(
        error.response?.data?.message ||
          "Failed to accept delivery."
      );
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      const data = await completeDelivery(orderId);

      toast.success(data.message);

      fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to complete delivery."
      );
    }
  };

  const renderOrderCard = (order, action) => (
    <div
      key={order._id}
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-lg">
            {order.restaurant?.name}
          </h3>

          <span
            className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
              order.orderStatus === "Out for Delivery"
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Customer: {order.user?.name} ({order.user?.phone})
        </p>

        <p className="text-sm text-gray-500">
          Deliver to: {order.deliveryAddress}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {order.foods.map((item) => (
            <span
              key={item._id}
              className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded"
            >
              {item.food?.name} × {item.quantity}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <p className="text-xl font-bold text-orange-600">
          Rs. {order.totalPrice}
        </p>

        <p className="text-xs text-gray-400">
          {order.paymentMethod} · {order.paymentStatus}
        </p>

        {action}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Deliveries
        </h1>

        <p className="text-gray-500 mt-2">
          Pick up orders and complete deliveries
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setTab("available")}
          className={`px-5 py-3 font-semibold border-b-2 transition ${
            tab === "available"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Available to Pickup ({available.length})
        </button>

        <button
          onClick={() => setTab("mine")}
          className={`px-5 py-3 font-semibold border-b-2 transition ${
            tab === "mine"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Deliveries ({myDeliveries.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl">
          Loading...
        </div>
      ) : tab === "available" ? (
        available.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <FaBoxOpen className="mx-auto text-5xl text-gray-300" />

            <p className="mt-4 text-gray-500">
              No orders waiting for pickup right now.
            </p>

            <p className="text-sm text-gray-400">
              New orders appear here as soon as restaurants mark them
              "Out for Delivery".
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {available.map((order) =>
              renderOrderCard(
                order,
                <button
                  onClick={() => handleAccept(order._id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2"
                >
                  <FaMotorcycle />
                  Accept
                </button>
              )
            )}
          </div>
        )
      ) : myDeliveries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-16 text-center">
          <FaMotorcycle className="mx-auto text-5xl text-gray-300" />

          <p className="mt-4 text-gray-500">
            You haven't accepted any deliveries yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myDeliveries.map((order) =>
            renderOrderCard(
              order,
              order.orderStatus === "Delivered" ? (
                <span className="text-sm font-semibold text-green-600">
                  ✓ Delivered
                </span>
              ) : (
                <button
                  onClick={() => handleDeliver(order._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold"
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
