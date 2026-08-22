import { FaEdit, FaTrash } from "react-icons/fa";

const formatDiscount = (coupon) => {
  if (coupon.type === "percentage") {
    const base = `${coupon.value}%`;

    return coupon.maxDiscount > 0
      ? `${base} (up to Rs. ${coupon.maxDiscount})`
      : base;
  }

  return `Rs. ${coupon.value} off`;
};

const CouponTable = ({ coupons, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="p-4 text-left">Code</th>
            <th className="p-4 text-left">Discount</th>
            <th className="p-4 text-center">Min Order</th>
            <th className="p-4 text-center">Usage</th>
            <th className="p-4 text-center">Expires</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {coupons.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-500">
                No Coupons Found
              </td>
            </tr>
          ) : (
            coupons.map((coupon) => {
              const isExpired =
                coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

              const statusText = !coupon.isActive
                ? "Inactive"
                : isExpired
                  ? "Expired"
                  : "Active";

              const statusClass = !coupon.isActive
                ? "bg-gray-500"
                : isExpired
                  ? "bg-red-500"
                  : "bg-green-500";

              return (
                <tr key={coupon._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-bold uppercase">{coupon.code}</td>

                  <td className="p-4 font-semibold text-orange-600">
                    {formatDiscount(coupon)}
                  </td>

                  <td className="p-4 text-center">
                    {coupon.minOrderAmount > 0
                      ? `Rs. ${coupon.minOrderAmount}`
                      : "None"}
                  </td>

                  <td className="p-4 text-center">
                    {coupon.usedCount}
                    {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : " (∞)"}
                  </td>

                  <td className="p-4 text-center">
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString()
                      : "Never"}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${statusClass}`}
                    >
                      {statusText}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => onEdit(coupon._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => onDelete(coupon._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;
