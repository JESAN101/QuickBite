import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createCoupon,
  updateCoupon,
  getCouponById,
} from "../../services/couponService";

const CouponForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    isActive: true,
    expiresAt: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchCoupon = async () => {
    try {
      const data = await getCouponById(id);
      const coupon = data.coupon;

      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount || "",
        maxDiscount: coupon.maxDiscount || "",
        usageLimit: coupon.usageLimit || "",
        isActive: coupon.isActive,
        expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load coupon.");
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchCoupon();
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscount: Number(formData.maxDiscount) || 0,
        usageLimit: Number(formData.usageLimit) || 0,
        isActive: formData.isActive,
        expiresAt: formData.expiresAt || null,
      };

      if (isEditing) {
        const data = await updateCoupon(id, payload);
        toast.success(data.message);
      } else {
        const data = await createCoupon(payload);
        toast.success(data.message);
      }

      navigate("/admin/coupons");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Coupon" : "Add Coupon"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Coupon Code</label>

            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SAVE10"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Discount Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="percentage">Percentage (%)</option>

              <option value="flat">Flat Amount (Rs.)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              {formData.type === "percentage"
                ? "Discount (%)"
                : "Discount Amount (Rs.)"}
            </label>

            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="e.g. 10"
              min="0"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Minimum Order Amount (Rs.)
            </label>

            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              placeholder="0 = no minimum"
              min="0"
              className={inputClass}
            />
          </div>

          {formData.type === "percentage" && (
            <div>
              <label className="block mb-2 font-medium">
                Max Discount (Rs.)
              </label>

              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                placeholder="0 = no limit"
                min="0"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">Usage Limit</label>

            <input
              type="number"
              name="usageLimit"
              value={formData.usageLimit}
              onChange={handleChange}
              placeholder="0 = unlimited"
              min="0"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Expiry Date (optional)
            </label>

            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 accent-orange-500"
          />

          <span className="font-medium">Active (can be used by customers)</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Coupon"
              : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default CouponForm;
