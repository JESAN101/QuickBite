import { useEffect, useState } from "react";
import { getDashboardStats, getDashboardAnalytics } from "../services/adminService";
import { getOrderStatusChartColor } from "../utils/orderStatus";
import DashboardCard from "../components/admin/DashboardCard";
import RecentOrders from "../components/admin/RecentOrders";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await getDashboardAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  if (error && (!stats || !analytics)) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-xl font-bold text-gray-900">
          Failed to load dashboard
        </p>
        <p className="text-sm text-gray-500">Please try again.</p>
        <button
          onClick={() => {
            setError(false);
            fetchStats();
            fetchAnalytics();
          }}
          className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats || !analytics) {
    return (
      <div className="flex justify-center items-center h-full text-xl">
        Loading Dashboard...
      </div>
    );
  }

  // Revenue Chart Data (Line)
  const revenueChartData = {
    labels: analytics.revenueLast7Days.map((item) => item.date),
    datasets: [
      {
        label: "Revenue (Rs.)",
        data: analytics.revenueLast7Days.map((item) => item.revenue),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Orders Count Chart Data (Bar)
  const ordersChartData = {
    labels: analytics.ordersLast7Days.map((item) => item.date),
    datasets: [
      {
        label: "Orders Count",
        data: analytics.ordersLast7Days.map((item) => item.count),
        backgroundColor: "#f97316",
        borderRadius: 6,
      },
    ],
  };

  // Orders Status Chart Data (Doughnut)
  const statusLabels = analytics.ordersByStatus.map((item) => item.status);
  const statusData = analytics.ordersByStatus.map((item) => item.count);
  const statusBgColors = statusLabels.map((lbl) =>
    getOrderStatusChartColor(lbl)
  );

  const statusChartData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusData,
        backgroundColor: statusBgColors,
        borderWidth: 1,
      },
    ],
  };

  // Top Selling Foods Data (Bar)
  const topFoodsChartData = {
    labels: analytics.topFoods.map((item) => item.name),
    datasets: [
      {
        label: "Units Sold",
        data: analytics.topFoods.map((item) => item.totalQuantity),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Real-time overview of your platform's performance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <DashboardCard
          title="Users"
          value={stats.totalUsers}
          icon="👥"
          color="from-blue-400 to-blue-600"
        />

        <DashboardCard
          title="Foods"
          value={stats.totalFoods}
          icon="🍔"
          color="from-orange-400 to-orange-500"
        />

        <DashboardCard
          title="Restaurants"
          value={stats.totalRestaurants}
          icon="🏪"
          color="from-emerald-400 to-green-600"
        />

        <DashboardCard
          title="Orders"
          value={stats.totalOrders}
          icon="📦"
          color="from-purple-400 to-purple-600"
        />

        <DashboardCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue}`}
          icon="💰"
          color="from-amber-400 to-orange-500"
        />

        <DashboardCard
          title="Pending"
          value={stats.pendingOrders}
          icon="⏳"
          color="from-yellow-400 to-amber-500"
        />

        <DashboardCard
          title="Preparing"
          value={stats.preparingOrders}
          icon="👨‍🍳"
          color="from-cyan-400 to-blue-500"
        />

        <DashboardCard
          title="Delivered"
          value={stats.completedOrders}
          icon="✅"
          color="from-green-400 to-emerald-600"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-lg font-bold text-gray-900">📈 Revenue Trend (Last 7 Days)</h3>
          <div className="h-72">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Order Count Trend */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-lg font-bold text-gray-900">📊 Daily Orders (Last 7 Days)</h3>
          <div className="h-72">
            <Bar
              data={ordersChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Top Selling Foods */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-lg font-bold text-gray-900">🔥 Top Selling Dishes</h3>
          <div className="h-72">
            <Bar
              data={topFoodsChartData}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { beginAtZero: true, grid: { color: "#f3f4f6" } },
                  y: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>

        {/* Orders by Status */}
        <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h3 className="mb-4 text-lg font-bold text-gray-900">🍕 Orders by Status</h3>
          <div className="h-64 flex justify-center items-center">
            <Doughnut
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "right" } },
              }}
            />
          </div>
        </div>

      </div>

      <RecentOrders />
    </div>
  );
};

export default AdminDashboard;