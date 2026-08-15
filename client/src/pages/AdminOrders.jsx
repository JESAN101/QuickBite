import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import OrderTable from "../components/admin/OrderTable";
import OrderDetailsModal from "../components/admin/OrderDetailsModal";

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../services/orderService";

const PAGE_SIZE = 10;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [stats, setStats] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllOrders({
        page,
        limit: PAGE_SIZE,
        search,
      });

      setOrders(data.orders || []);
      setPages(data.pages || 1);
      setStats(data.stats || {});
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalOrders = stats.totalOrders || 0;

const pendingOrders = stats.pendingOrders || 0;

const deliveredOrders = stats.deliveredOrders || 0;

const totalRevenue = stats.totalRevenue || 0;

  const handleStatusChange = async (
  orderId,
  orderStatus
) => {
  try {
    const data = await updateOrderStatus(
      orderId,
      orderStatus
    );

    toast.success(data.message);

    fetchOrders();

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to update order."
    );

  }
};

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm(
      "Delete this order?"
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteOrder(orderId);

      toast.success(data.message);

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete order."
      );
    }
  };

  const handleView = (order) => {
  setSelectedOrder(order);
};

  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Order Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer orders
          </p>
        </div>

        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search customer or restaurant..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-96 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-gray-500">
      Total Orders
    </h3>

    <h2 className="text-3xl font-bold mt-2">
      {totalOrders}
    </h2>
  </div>

  <div className="bg-yellow-500 text-white rounded-xl shadow-lg p-6">
    <h3>Pending</h3>

    <h2 className="text-3xl font-bold mt-2">
      {pendingOrders}
    </h2>
  </div>

  <div className="bg-green-500 text-white rounded-xl shadow-lg p-6">
    <h3>Delivered</h3>

    <h2 className="text-3xl font-bold mt-2">
      {deliveredOrders}
    </h2>
  </div>

  <div className="bg-orange-500 text-white rounded-xl shadow-lg p-6">
    <h3>Total Revenue</h3>

    <h2 className="text-3xl font-bold mt-2">
      Rs. {totalRevenue}
    </h2>
  </div>

</div>

        {loading ? (
          <div className="text-center py-20 text-xl">
            Loading Orders...
          </div>
        ) : (
          <OrderTable
  orders={orders}
  onStatusChange={handleStatusChange}
  onDelete={handleDelete}
  onView={handleView}
/>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page {page} of {pages}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(pages, p + 1))
            }
            disabled={page >= pages}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {selectedOrder && (
  <OrderDetailsModal
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
  />
)}

      </div>
  );
};

export default AdminOrders;
