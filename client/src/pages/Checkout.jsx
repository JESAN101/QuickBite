import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTag, FaTimes } from "react-icons/fa";

import { getCart, clearCart } from "../services/cartService";
import { placeOrder } from "../services/orderService";
import {
  validateCoupon,
  getActiveCoupons,
} from "../services/couponService";
import { getDeliveryFee } from "../utils/pricing";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data.cart);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cart.");
    }
  };

  const fetchActiveCoupons = async () => {
    try {
      const data = await getActiveCoupons();
      setAvailableCoupons(data.coupons || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchActiveCoupons();
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.food.price * item.quantity,
    0
  );

  const deliveryFee = getDeliveryFee(subtotal);

  const discount = appliedCoupon?.discount || 0;

  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();

    if (!code) {
      toast.error("Please enter a coupon code.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setApplyingCoupon(true);

    try {
      const data = await validateCoupon(code, subtotal);

      setAppliedCoupon({
        code: code.toUpperCase(),
        discount: data.discount,
      });

      toast.success(data.message);
    } catch (error) {
      setAppliedCoupon(null);

      toast.error(
        error.response?.data?.message || "Invalid coupon code."
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const nextErrors = {};

    if (!address.trim()) {
      nextErrors.address = "Delivery address is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    const loadingToast = toast.loading("Placing your order...");

    try {
      const orderData = {
        restaurant: cart[0].food.restaurant._id || cart[0].food.restaurant,

        foods: cart.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),

        totalPrice: total,

        deliveryAddress: address,

        paymentMethod,

        couponCode: appliedCoupon?.code || "",
      };

      const response = await placeOrder(orderData);

      // Clear cart
      await clearCart();

      toast.dismiss(loadingToast);
      toast.success(response.message);

      navigate("/order-success");
    } catch (error) {
      console.log(error);

      toast.dismiss(loadingToast);

      toast.error(
        error.response?.data?.message || "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { value: "Cash", label: "Cash on Delivery" },
    { value: "eSewa", label: "eSewa" },
    { value: "Khalti", label: "Khalti" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-8 shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)] sm:p-10">
        {/* header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0A438] font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#1D1512]">
            {cart.length}
          </div>

          <h1 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
            Review &amp;{" "}
            <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
              Checkout
            </span>
          </h1>
          <p className="mt-1 text-sm text-[#3A2A20]/55">
            Confirm your order before it heads to the kitchen
          </p>
        </div>

        {/* Order Summary */}
        <div className="mt-10">
          <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
            Order Summary
          </label>

          <div className="overflow-hidden rounded-lg border border-[#EADFC8] bg-white">
            {cart.length === 0 ? (
              <p className="p-5 text-sm text-[#3A2A20]/55">
                Your cart is empty.
              </p>
            ) : (
              cart.map((item, idx) => (
                <div
                  key={item._id}
                  className={`flex items-center justify-between p-4 ${
                    idx !== cart.length - 1 ? "border-b border-[#EADFC8]" : ""
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-[#1D1512]">
                      {item.food.name}
                    </h3>
                    <p className="text-sm text-[#3A2A20]/55">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold text-[#1D1512]">
                    Rs. {item.food.price * item.quantity}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-2 rounded-lg border border-[#EADFC8] bg-white p-4">
            <div className="flex justify-between text-sm text-[#3A2A20]/70">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>

            <div className="flex justify-between text-sm text-[#3A2A20]/70">
              <span>Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? "FREE" : `Rs. ${deliveryFee}`}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-sm font-semibold text-[#3F6B3F]">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>- Rs. {discount}</span>
              </div>
            )}

            <hr className="border-[#EADFC8]" />

            <div className="flex justify-between font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#D64933]">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className="mt-8">
          <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
            Coupon Code
          </label>

          {appliedCoupon ? (
            <div className="flex items-center justify-between rounded-lg border border-[#3F6B3F]/30 bg-[#3F6B3F]/10 p-4">
              <div className="flex items-center gap-3">
                <FaTag className="text-[#3F6B3F]" />
                <span className="font-semibold text-[#1D1512]">
                  {appliedCoupon.code}
                </span>
                <span className="text-sm font-bold text-[#3F6B3F]">
                  - Rs. {discount}
                </span>
              </div>

              <button
                onClick={handleRemoveCoupon}
                className="text-[#3A2A20]/50 transition hover:text-[#D64933]"
                aria-label="Remove coupon"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code (e.g. SAVE10)"
                className="flex-1 rounded-lg border border-[#EADFC8] bg-white p-3 text-[#1D1512] uppercase outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25"
              />

              <button
                onClick={handleApplyCoupon}
                disabled={applyingCoupon}
                className="rounded-lg bg-[#1D1512] px-5 py-3 text-sm font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:opacity-60"
              >
                {applyingCoupon ? "Checking…" : "Apply"}
              </button>
            </div>
          )}

          {/* Available coupons */}
          {availableCoupons.length > 0 && !appliedCoupon && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3A2A20]/50">
                Available coupons
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon._id}
                    onClick={() => setCouponCode(coupon.code)}
                    className="rounded-full border border-[#EADFC8] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D1512] transition hover:border-[#F0A438] hover:text-[#946022]"
                  >
                    {coupon.code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delivery Address */}
        <div className="mt-8">
          <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
            Delivery Address
          </label>
          <textarea
            rows="4"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) setErrors((p) => ({ ...p, address: "" }));
            }}
            placeholder="Enter complete delivery address..."
            className={`w-full rounded-lg border bg-white p-3 text-[#1D1512] outline-none transition focus:border-[#F0A438] focus:ring-2 focus:ring-[#F0A438]/25 ${
              errors.address ? "border-[#ef4444]" : "border-[#EADFC8]"
            }`}
          />
          {errors.address && (
            <p className="mt-1.5 text-xs font-medium text-[#ef4444]">
              {errors.address}
            </p>
          )}
        </div>

        {/* Payment */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-[#1D1512]">
            Payment Method
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {paymentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPaymentMethod(option.value)}
                className={`rounded-lg border p-3 text-sm font-semibold transition ${
                  paymentMethod === option.value
                    ? "border-[#F0A438] bg-[#F0A438]/15 text-[#1D1512]"
                    : "border-[#EADFC8] bg-white text-[#3A2A20]/70 hover:border-[#F0A438]/60"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D1512] py-3.5 text-lg font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#F7ECD9] border-t-transparent" />
          )}
          {loading ? "Placing order…" : `Place order · Rs. ${total}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
