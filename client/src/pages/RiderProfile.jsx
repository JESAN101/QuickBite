import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaMotorcycle, FaBox, FaCheckCircle, FaClock, FaEnvelope, FaPhone } from "react-icons/fa";

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

  const infoItems = [
    { icon: <FaUser />, label: "Full Name", value: user?.name },
    { icon: <FaEnvelope />, label: "Email", value: user?.email },
    { icon: <FaPhone />, label: "Phone", value: user?.phone },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
        My Profile
      </h1>

      {/* Profile Card */}
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-4xl font-extrabold text-white shadow-lg shadow-orange-500/25">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {user?.name}
            </h2>
            <p className="mt-1 text-gray-500">{user?.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700">
              <FaMotorcycle className="text-[10px]" />
              Delivery Rider
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {item.icon}
                {item.label}
              </div>
              <p className="mt-1 font-bold text-gray-900">
                {item.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FaBox className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Total Deliveries
                </p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {stats.totalDeliveries}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <FaClock className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Active Now
                </p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {stats.activeDeliveries}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">
                  Delivered Today
                </p>
                <p className="text-3xl font-extrabold text-gray-900">
                  {stats.todayDeliveries}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderProfile;
