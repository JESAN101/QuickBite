import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardCard from "../components/admin/DashboardCard";
import { getRiderStats, getMyDeliveries } from "../services/riderService";

const RiderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  const fetchDashboard = async () => {
    try {
      const [statsData, deliveriesData] = await Promise.all([
        getRiderStats(),
        getMyDeliveries(),
      ]);

      setStats(statsData.stats);
      setRecentDeliveries((deliveriesData.orders || []).slice(0, 5));
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
        🏍 Rider Dashboard
      </h1>

      <p className="text-gray-500 mb-8">
        Track your deliveries and earnings
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          color="bg-blue-500"
        />

        <DashboardCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Delivered Today"
          value={stats.todayDeliveries}
          color="bg-green-500"
        />

        <DashboardCard
          title="Orders Awaiting Rider"
          value={stats.availableCount}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto mt-10">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            My Recent Deliveries
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Restaurant</th>
              <th className="p-4 text-center">Total</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentDeliveries.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-10 text-gray-500"
                >
                  No deliveries yet.
                </td>
              </tr>
            ) : (
              recentDeliveries.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">
                    {order.user?.name}
                  </td>

                  <td className="p-4">
                    {order.restaurant?.name}
                  </td>

                  <td className="p-4 text-center font-semibold">
                    Rs. {order.totalPrice}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-500"
                          : "bg-yellow-500"
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

export default RiderDashboard;
