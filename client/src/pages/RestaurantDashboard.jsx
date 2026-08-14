import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardCard from "../components/admin/DashboardCard";
import { getMyStats, getMyOrders } from "../services/restaurantService";

const statusColors = {
  Pending: "bg-yellow-500",
  Preparing: "bg-blue-500",
  "Out for Delivery": "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

const RestaurantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboard = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        getMyStats(),
        getMyOrders(),
      ]);

      setStats(statsData.stats);
      setRecentOrders((ordersData.orders || []).slice(0, 5));
    } catch (error) {
      console.log(error);
      toast.error("Failed to load dashboard.");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-full text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">
        🍽 Restaurant Dashboard
      </h1>

      <p className="text-gray-500 mb-8">
        Overview of your restaurant's performance
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Today's Orders"
          value={stats.todayOrders}
          color="bg-blue-500"
        />

        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          color="bg-orange-500"
        />

        <DashboardCard
          title="Pending Orders"
          value={stats.pendingOrders}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Menu Items"
          value={stats.totalFoods}
          color="bg-green-500"
        />

        <DashboardCard
          title="Preparing"
          value={stats.preparingOrders}
          color="bg-purple-500"
        />

        <DashboardCard
          title="Delivered"
          value={stats.deliveredOrders}
          color="bg-emerald-600"
        />

        <DashboardCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue}`}
          color="bg-red-500"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto mt-10">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-center">Items</th>
              <th className="p-4 text-center">Total</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-500"
                >
                  No orders yet.
                </td>
              </tr>
            ) : (
              recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">
                    {order.user?.name}
                  </td>

                  <td className="p-4 text-center">
                    {order.foods.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </td>

                  <td className="p-4 text-center font-semibold">
                    Rs. {order.totalPrice}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        statusColors[order.orderStatus] ||
                        "bg-gray-500"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RestaurantDashboard;
