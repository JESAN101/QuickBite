import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

import CouponTable from "../components/admin/CouponTable";

import { getAllCoupons, deleteCoupon } from "../services/couponService";

const AdminCoupons = () => {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const data = await getAllCoupons();

      setCoupons(data.coupons || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this coupon?");

    if (!confirmDelete) return;

    try {
      const data = await deleteCoupon(id);

      toast.success(data.message);

      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon.");
    }
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Coupon Management</h1>

        <p className="text-gray-500 mt-2">
          Create and manage promo codes for customers
        </p>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search coupon code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 border rounded-lg px-4 py-3"
        />

        <button
          onClick={() => navigate("/admin/coupons/add")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Coupon
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl">Loading Coupons...</div>
      ) : (
        <CouponTable
          coupons={filteredCoupons}
          onEdit={(id) => navigate(`/admin/coupons/edit/${id}`)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminCoupons;
