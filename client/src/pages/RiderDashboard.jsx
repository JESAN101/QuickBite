import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getRiderStats, getMyDeliveries } from "../services/riderService";
import { getStatusBadgeClass } from "../utils/orderStatus";

const statCards = (stats) => [
  {
    title: "Total Deliveries",
    value: stats.totalDeliveries,
    icon: "📦",
    color: "from-blue-500 to-blue-600",
    trend: "+12%",
    up: true,
  },
  {
    title: "Active Now",
    value: stats.activeDeliveries,
    icon: "🔥",
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Delivered Today",
    value: stats.todayDeliveries,
    icon: "✅",
    color: "from-emerald-500 to-green-600",
    trend: "+8%",
    up: true,
  },
  {
    title: "Awaiting Pickup",
    value: stats.availableCount,
    icon: "⏳",
    color: "from-rose-500 to-pink-600",
  },
];

const RiderDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [error, setError] = useState(false);

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
      setError(true);
      toast.error("Failed to load dashboard.");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error && !stats) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xl font-bold text-gray-900">
            Failed to load dashboard
          </p>
          <p className="text-sm text-gray-500">
            Please try refreshing the page.
          </p>
          <button
            onClick={fetchDashboard}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="text-gray-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
          Rider Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          Track your deliveries and performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards(stats).map((card) => (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
          >
            <div
              className={`absolute -right-4 -top-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${card.color} text-3xl opacity-15`}
            >
              {card.icon}
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {card.title}
            </p>

            <p className="mt-3 text-3xl font-extrabold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Deliveries Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            My Recent Deliveries
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-6 py-4 font-semibold text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 font-semibold text-gray-500">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-500">
                  Total
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-center font-semibold text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {recentDeliveries.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    No deliveries yet. Accept orders to get started.
                  </td>
                </tr>
              ) : (
                recentDeliveries.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-orange-50/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {order.user?.name}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {order.restaurant?.name}
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-gray-900">
                      Rs. {order.totalPrice}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
