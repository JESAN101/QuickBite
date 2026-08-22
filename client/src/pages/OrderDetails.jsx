import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaStore,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTag,
  FaMotorcycle,
  FaBan,
  FaCheckCircle,
  FaClipboardCheck,
  FaUtensils,
  FaTruck,
  FaHome,
} from "react-icons/fa";

import { getOrder, cancelOrder } from "../services/orderService";
import { addItemsToCart } from "../services/cartService";
import useOrderSocket from "../hooks/useOrderSocket";

const TIMELINE_STEPS = [
  { label: "Placed", icon: FaClipboardCheck },
  { label: "Confirmed", icon: FaCheckCircle },
  { label: "Preparing", icon: FaUtensils },
  { label: "Out for Delivery", icon: FaTruck },
  { label: "Delivered", icon: FaHome },
];

const statusToStepIndex = {
  Pending: 1,
  Preparing: 2,
  "Out for Delivery": 3,
  Delivered: 4,
  Cancelled: -1,
};

const stepColors = {
  Pending: "#F0A438",
  Preparing: "#D64933",
  "Out for Delivery": "#3B6E8F",
  Delivered: "#3F6B3F",
  Cancelled: "#1D1512",
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [canCancel, setCanCancel] = useState(false);

  // Live updates via Socket.IO
  useOrderSocket({
    onStatus: ({ orderId, status }) => {
      if (orderId === id) {
        setOrder((prev) =>
          prev ? { ...prev, orderStatus: status } : prev
        );
      }
    },
  });

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrder(id);
      const o = data.order;

      setOrder(o);

      if (
        o.orderStatus === "Pending" &&
        data.cancelDeadline &&
        Date.now() < data.cancelDeadline
      ) {
        setCanCancel(true);
      } else {
        setCanCancel(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load order."
      );
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    setCancelling(true);

    try {
      const data = await cancelOrder(id);
      toast.success(data.message);
      fetchOrder();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = async () => {
    const loadingToast = toast.loading("Repopulating your cart...");
    try {
      const items = order.foods.map((f) => ({
        food: f.food._id,
        quantity: f.quantity,
      }));
      await addItemsToCart(items);
      toast.dismiss(loadingToast);
      toast.success("Cart updated! Redirecting...");
      navigate("/cart");
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to reorder items.");
    }
  };

  if (loading || !order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FFFBF3]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#EADFC8] border-t-[#D64933]" />
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#3A2A20]/50">
            Loading order…
          </p>
        </div>
      </div>
    );
  }

  const activeColor = stepColors[order.orderStatus] || "#F0A438";
  const currentStep =
    order.orderStatus === "Cancelled"
      ? -1
      : statusToStepIndex[order.orderStatus] ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      {/* Back + title */}
      <div className="mb-10">
        <button
          onClick={() => navigate("/orders")}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#3A2A20]/60 transition hover:text-[#D64933]"
        >
          <FaArrowLeft className="text-xs" />
          Back to Orders
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
          Order details
        </span>
        <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          Order #{order._id.slice(-6).toUpperCase()}
        </h1>
      </div>

      {/* Timeline tracker */}
      <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-8 shadow-[0_8px_20px_-12px_rgba(29,21,18,0.15)]">
        <h2 className="mb-8 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
          Order Status
        </h2>

        {order.orderStatus === "Cancelled" ? (
          <div className="flex items-center gap-4 rounded-xl border border-[#D64933]/20 bg-[#D64933]/10 p-5">
            <FaBan className="text-2xl text-[#D64933]" />
            <div>
              <p className="font-bold text-[#D64933]">Order Cancelled</p>
              <p className="mt-1 text-sm text-[#3A2A20]/60">
                This order was cancelled and will not be delivered.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop horizontal timeline */}
            <div className="hidden sm:block">
              <div className="flex items-start">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.label}
                      className="relative flex flex-1 flex-col items-center"
                    >
                      {idx > 0 && (
                        <div
                          className="absolute right-1/2 top-4 -z-0 h-0.5 w-full"
                          style={{
                            background:
                              idx <= currentStep ? activeColor : "#EADFC8",
                          }}
                        />
                      )}

                      <div
                        className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition"
                        style={{
                          background: done ? activeColor : "#EADFC8",
                          boxShadow: isCurrent
                            ? `0 0 0 5px ${activeColor}25`
                            : "none",
                        }}
                      >
                        <Icon
                          className="text-sm"
                          style={{ color: done ? "#fff" : "#3A2A20" }}
                        />
                      </div>

                      <p
                        className="mt-3 text-center text-xs font-semibold"
                        style={{ color: done ? activeColor : "#3A2A20" }}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="mt-1 text-[10px] text-[#3A2A20]/50">
                          Current
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile vertical timeline */}
            <div className="sm:hidden">
              <div className="relative ml-3 border-l-2 border-[#EADFC8] pl-8">
                {TIMELINE_STEPS.map((step, idx) => {
                  const done = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  const Icon = step.icon;

                  return (
                    <div key={step.label} className="relative pb-8 last:pb-0">
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div
                          className="absolute -left-[33px] top-5 h-full w-0.5"
                          style={{
                            background:
                              idx < currentStep ? activeColor : "#EADFC8",
                          }}
                        />
                      )}

                      <div
                        className="absolute -left-[41px] top-0 flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          background: done ? activeColor : "#EADFC8",
                          boxShadow: isCurrent
                            ? `0 0 0 3px ${activeColor}25`
                            : "none",
                        }}
                      >
                        <Icon
                          className="text-[10px]"
                          style={{ color: done ? "#fff" : "#3A2A20" }}
                        />
                      </div>

                      <p
                        className="text-sm font-semibold"
                        style={{ color: done ? activeColor : "#3A2A20" }}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="mt-0.5 text-xs text-[#3A2A20]/55">
                          Current step
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Items */}
        <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 shadow-[0_8px_20px_-12px_rgba(29,21,18,0.15)]">
          <div className="flex items-center gap-2">
            <FaStore className="text-[#D64933]" />
            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
              {order.restaurant?.name}
            </h3>
          </div>

          <div className="mt-5 space-y-3">
            {order.foods.map((item) => (
              <div
                key={item.food._id}
                className="flex justify-between text-sm text-[#1D1512]"
              >
                <span>{item.food.name}</span>
                <span className="text-[#3A2A20]/55">
                  × {item.quantity} — Rs. {item.food.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="my-5 border-t border-[#EADFC8]" />

          <div className="space-y-2 text-sm text-[#3A2A20]/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">
                Rs. {order.foods.reduce((s, f) => s + f.food.price * f.quantity, 0)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-[#3F6B3F] font-semibold">
                <span>Coupon discount</span>
                <span>- Rs. {order.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-[#1D1512]">
              <span>Total</span>
              <span className="text-[#D64933]">Rs. {order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 shadow-[0_8px_20px_-12px_rgba(29,21,18,0.15)]">
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
            Delivery &amp; Payment
          </h3>

          <div className="mt-5 space-y-4 text-sm text-[#3A2A20]/70">
            <p className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-[#D64933]" />
              {order.deliveryAddress}
            </p>

            <p className="flex items-center gap-3">
              <FaMoneyBillWave className="shrink-0 text-[#D64933]" />
              {order.paymentMethod}
              {order.paymentStatus && (
                <span
                  className={`ml-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "bg-[#3F6B3F]/15 text-[#2F522F]"
                      : "bg-[#F0A438]/15 text-[#946022]"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              )}
            </p>

            <p className="flex items-center gap-3">
              <FaCalendarAlt className="shrink-0 text-[#D64933]" />
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {order.rider && (
              <p className="flex items-center gap-3">
                <FaMotorcycle className="shrink-0 text-[#D64933]" />
                {order.orderStatus === "Delivered"
                  ? "Delivered by"
                  : "Delivering by"}{" "}
                {order.rider.name}
              </p>
            )}

            {order.discount > 0 && order.coupon && (
              <p className="flex items-center gap-3">
                <FaTag className="shrink-0 text-[#3F6B3F]" />
                Coupon: {order.coupon.code} (saved Rs. {order.discount})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={handleReorder}
          className="rounded-lg bg-[#1D1512] px-6 py-3 text-sm font-bold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
        >
          Order Again
        </button>

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-lg border border-[#D64933] bg-[#D64933]/10 px-6 py-3 text-sm font-bold text-[#D64933] transition hover:bg-[#D64933] hover:text-white disabled:opacity-60"
          >
            {cancelling ? "Cancelling…" : "Cancel Order"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
