import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";
import { FaStore, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const statusStyles = {
  Pending: "bg-[#F0A438]/15 text-[#946022]",
  Preparing: "bg-[#D64933]/12 text-[#B03A24]",
  "Out for Delivery": "bg-[#3B6E8F]/12 text-[#2C5670]",
  Delivered: "bg-[#3F6B3F]/15 text-[#2F522F]",
  Cancelled: "bg-[#1D1512]/10 text-[#1D1512]/60",
};

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
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-dashed border-[#EADFC8] bg-[#FFFBF3] py-20 text-center">
          <p className="font-['Fraunces',serif] text-3xl italic text-[#1D1512]/70">
            No orders yet.
          </p>
          <p className="mt-3 text-sm text-[#3A2A20]/50">
            Your placed orders will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
          Order history
        </span>
        <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          My Orders
        </h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 shadow-[0_8px_20px_-12px_rgba(29,21,18,0.15)]"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <FaStore className="text-[#D64933]" />
                  <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#1D1512]">
                    {order.restaurant?.name}
                  </h2>
                </div>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-[#3A2A20]/55">
                  <FaCalendarAlt className="text-xs" />
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-['Fraunces',serif] text-2xl font-semibold text-[#D64933]">
                  Rs. {order.totalPrice}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3.5 py-1 text-xs font-semibold ${
                    statusStyles[order.orderStatus] || "bg-[#EADFC8] text-[#1D1512]"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-[#EADFC8]" />

            <div className="space-y-2.5">
              {order.foods.map((item) => (
                <div
                  key={item.food._id}
                  className="flex justify-between text-sm text-[#1D1512]"
                >
                  <span>{item.food.name}</span>
                  <span className="text-[#3A2A20]/55">× {item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-[#EADFC8]" />

            <div className="flex flex-col gap-2 text-sm text-[#3A2A20]/70 sm:flex-row sm:items-center sm:gap-8">
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="shrink-0 text-[#D64933]" />
                {order.deliveryAddress}
              </p>
              <p className="flex items-center gap-2">
                <FaMoneyBillWave className="shrink-0 text-[#D64933]" />
                {order.paymentMethod}
                {order.paymentStatus && (
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-[#3F6B3F]/15 text-[#2F522F]"
                        : "bg-[#F0A438]/15 text-[#946022]"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;