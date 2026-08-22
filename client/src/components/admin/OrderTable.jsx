import { FaTrash, FaEye } from "react-icons/fa";
import { getStatusSolidClass } from "../../utils/orderStatus";

const OrderTable = ({ orders, onStatusChange, onDelete, onView }) => {
  const getStatusColor = (status) => getStatusSolidClass(status);

  return (
    <>
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Restaurant</th>
              <th className="p-4 text-center">Items</th>
              <th className="p-4 text-center">Total</th>
              <th className="p-4 text-center">Payment</th>
              <th className="p-4 text-center">Date</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10 text-gray-500">
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order.user?.name}</td>

                  <td className="p-4">{order.restaurant?.name}</td>

                  <td className="p-4 text-center">
                    {order.foods.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                  </td>

                  <td className="p-4 text-center font-semibold">
                    Rs. {order.totalPrice}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-block w-full text-center px-3 py-2 rounded-full text-white text-sm font-semibold ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          onStatusChange(order._id, e.target.value)
                        }
                        className="border rounded-lg p-2 w-full"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(order)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => onDelete(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
            No Orders Found
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="font-semibold">{order.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {order.restaurant?.name}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold">Rs. {order.totalPrice}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center gap-2 text-sm">
                <span className="text-gray-600">
                  Items:{" "}
                  {order.foods.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )}
                </span>

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

              <div className="mt-3 space-y-2">
                <span
                  className={`inline-block w-full text-center px-3 py-2 rounded-full text-white text-sm font-semibold ${getStatusColor(
                    order.orderStatus,
                  )}`}
                >
                  {order.orderStatus}
                </span>

                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className="border rounded-lg p-2 w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => onView(order)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                >
                  <FaEye />
                </button>

                <button
                  onClick={() => onDelete(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default OrderTable;
