import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminService";
import DashboardCard from "../components/admin/DashboardCard";
import RecentOrders from "../components/admin/RecentOrders";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-full text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        📊 Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <DashboardCard
          title="Users"
          value={stats.totalUsers}
          color="bg-blue-500"
        />

        <DashboardCard
          title="Foods"
          value={stats.totalFoods}
          color="bg-orange-500"
        />

        <DashboardCard
          title="Restaurants"
          value={stats.totalRestaurants}
          color="bg-green-500"
        />

        <DashboardCard
          title="Orders"
          value={stats.totalOrders}
          color="bg-purple-500"
        />

        <DashboardCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue}`}
          color="bg-emerald-600"
        />

        <DashboardCard
          title="Pending"
          value={stats.pendingOrders}
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Preparing"
          value={stats.preparingOrders}
          color="bg-cyan-500"
        />

        <DashboardCard
          title="Delivered"
          value={stats.completedOrders}
          color="bg-green-700"
        />

      </div>

      <RecentOrders />
    </>
  );
};

export default AdminDashboard;