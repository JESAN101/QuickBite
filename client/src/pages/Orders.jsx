import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyOrders } from "../services/orderService";
import { addItemsToCart } from "../services/cartService";
import { FaStore, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaTag, FaMotorcycle, FaRedo, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PAGE_SIZE = 5;

const statusStyles = {
  Pending: "bg-[#F0A438]/15 text-[#946022]",
  Preparing: "bg-[#D64933]/12 text-[#B03A24]",
  "Out for Delivery": "bg-[#3B6E8F]/12 text-[#2C5670]",
  Delivered: "bg-[#3F6B3F]/15 text-[#2F522F]",
  Cancelled: "bg-[#1D1512]/10 text-[#1D1512]/60",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedOrders = orders.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (e, order) => {
    e.preventDefault();
    e.stopPropagation();
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
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to reorder items.");
    }
  };

  const OrderSkeleton = () => (
    <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 shadow-[0_8px_20px_-12px_rgba(29,21,18,0.15)]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 animate-pulse rounded-full bg-[#EADFC8]" />
            <div className="h-6 w-48 animate-pulse rounded bg-[#EADFC8]" />
          </div>
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-[#EADFC8]" />
        </div>
        <div className="text-right">
          <div className="ml-auto h-6 w-24 animate-pulse rounded bg-[#EADFC8]" />
          <div className="ml-auto mt-2 h-4 w-28 animate-pulse rounded bg-[#EADFC8]" />
        </div>
      </div>
      <div className="my-5 border-t border-[#EADFC8]" />
      <div className="space-y-2.5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#EADFC8]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#EADFC8]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#EADFC8]" />
      </div>
      <div className="my-5 border-t border-[#EADFC8]" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-64 animate-pulse rounded bg-[#EADFC8]" />
        <div className="h-8 w-28 animate-pulse rounded-lg bg-[#EADFC8]" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
            Order history
          </span>
          <div className="mt-2 h-8 w-40 animate-pulse rounded bg-[#EADFC8]" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-2xl border border-dashed border-[#EADFC8] bg-[#FFFBF3] py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D64933]/10">
            <FaStore className="text-2xl text-[#D64933]/60" />
          </div>
          <p className="mt-5 font-['Fraunces',serif] text-3xl italic text-[#1D1512]/70">
            No orders yet.
          </p>
          <p className="mt-3 text-sm text-[#3A2A20]/50">
            Your placed orders will show up here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-[#1D1512] px-8 py-3 font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
          >
            Browse Restaurants
          </Link>
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
        {paginatedOrders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-6 shadow-[0_8px_20px_-12px_rgba(29,21,18,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(29,21,18,0.2)]"
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

                {order.discount > 0 && (
                  <p className="mt-1 flex items-center justify-end gap-1.5 text-xs font-semibold text-[#3F6B3F]">
                    <FaTag className="text-[10px]" />
                    {order.coupon?.code || "Coupon"} · saved Rs.{" "}
                    {order.discount}
                  </p>
                )}

                <span
                  className={`mt-2 inline-block rounded-full px-3.5 py-1 text-xs font-semibold ${
                    statusStyles[order.orderStatus] || "bg-[#EADFC8] text-[#1D1512]"
                  }`}
                >
                  {order.orderStatus}
                </span>

                {order.rider && (
                  <p className="mt-1.5 flex items-center justify-end gap-1.5 text-xs font-medium text-[#3A2A20]/55">
                    <FaMotorcycle className="text-xs" />
                    {order.orderStatus === "Delivered"
                      ? "Delivered by"
                      : "Delivering by"}{" "}
                    {order.rider.name}
                  </p>
                )}
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

              <button
                onClick={(e) => handleReorder(e, order)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#1D1512] px-5 py-2 text-xs font-bold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
              >
                <FaRedo className="text-[10px]" />
                Order Again
              </button>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 rounded-lg border border-[#EADFC8] bg-[#FFFBF3] px-4 py-2 text-sm font-semibold text-[#1D1512] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronLeft className="text-xs" />
            Previous
          </button>
          <span className="text-sm font-semibold text-[#3A2A20]/60">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 rounded-lg border border-[#EADFC8] bg-[#FFFBF3] px-4 py-2 text-sm font-semibold text-[#1D1512] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
