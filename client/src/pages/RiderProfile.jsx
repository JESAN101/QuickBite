import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getUser } from "../utils/auth";
import { getRiderStats } from "../services/riderService";

const RiderProfile = () => {
  const user = getUser();

  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const data = await getRiderStats();

      setStats(data.stats);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load stats.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const infoRows = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Phone", value: user?.phone },
    { label: "Role", value: "Delivery Rider" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {user?.name}
            </h2>

            <span className="mt-1 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Delivery Rider
            </span>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="border-b border-gray-100 pb-3"
            >
              <p className="text-sm text-gray-500">
                {row.label}
              </p>

              <p className="font-semibold mt-0.5">
                {row.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-5">
            <p className="text-sm text-gray-500">
              Total Deliveries
            </p>

            <p className="text-3xl font-bold text-orange-500 mt-1">
              {stats.totalDeliveries}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5">
            <p className="text-sm text-gray-500">
              Active Deliveries
            </p>

            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {stats.activeDeliveries}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5">
            <p className="text-sm text-gray-500">
              Delivered Today
            </p>

            <p className="text-3xl font-bold text-green-500 mt-1">
              {stats.todayDeliveries}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderProfile;
