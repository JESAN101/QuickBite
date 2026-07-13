import { FaTimes } from "react-icons/fa";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-3xl font-bold mb-8">
          Order Details
        </h2>

        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div>
            <p className="text-gray-500">Customer</p>
            <h3 className="font-semibold text-lg">
              {order.user?.name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Restaurant</p>
            <h3 className="font-semibold text-lg">
              {order.restaurant?.name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Payment</p>
            <h3 className="font-semibold">
              {order.paymentMethod}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">Payment Status</p>

            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                order.paymentStatus === "Paid"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Order Status</p>

            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${
                order.orderStatus === "Pending"
                  ? "bg-yellow-500"
                  : order.orderStatus === "Preparing"
                  ? "bg-blue-500"
                  : order.orderStatus === "Out for Delivery"
                  ? "bg-purple-500"
                  : order.orderStatus === "Delivered"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Order Date</p>
            <h3 className="font-semibold">
              {new Date(order.createdAt).toLocaleString()}
            </h3>
          </div>

        </div>

        {/* Delivery Address */}
        <div className="mb-8">

          <p className="text-gray-500 mb-2">
            Delivery Address
          </p>

          <div className="border rounded-lg p-4 bg-gray-50">
            {order.deliveryAddress}
          </div>

        </div>

        {/* Ordered Items */}
        <div>

          <h3 className="text-xl font-bold mb-4">
            Ordered Items
          </h3>

          <div className="border rounded-lg overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">
                    Food
                  </th>

                  <th className="p-3 text-center">
                    Qty
                  </th>

                  <th className="p-3 text-center">
                    Price
                  </th>

                  <th className="p-3 text-center">
                    Subtotal
                  </th>

                </tr>

              </thead>

              <tbody>
  {order.foods.map((item) => (
    <tr
      key={item._id}
      className="border-t"
    >
      <td className="p-3">
        {item.food?.name}
      </td>

      <td className="p-3 text-center">
        {item.quantity}
      </td>

      <td className="p-3 text-center">
        Rs. {item.food?.price}
      </td>

      <td className="p-3 text-center font-semibold">
        Rs. {(item.food?.price || 0) * item.quantity}
      </td>
    </tr>
  ))}
</tbody>

            </table>

          </div>

        </div>

        {/* Total */}
        <div className="mt-8 flex justify-end">

          <div className="text-right">

            <p className="text-gray-500">
              Total Amount
            </p>

            <h2 className="text-3xl font-bold text-orange-500">
              Rs. {order.totalPrice}
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
};

export default OrderDetailsModal;