import { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/admin/AdminSidebar";
import MobileNav from "../components/MobileNav";

const mobileLinks = [
  { to: "/", label: "Storefront", icon: "🏠" },
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/restaurants", label: "Restaurants", icon: "🏪" },
  { to: "/admin/foods", label: "Foods", icon: "🍔" },
  { to: "/admin/orders", label: "Orders", icon: "📋" },
  { to: "/admin/categories", label: "Categories", icon: "🏷️" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/coupons", label: "Coupons", icon: "🎟️" },
  {
    to: "/admin/requests/restaurant",
    label: "Restaurant Requests",
    icon: "🏪",
  },
  { to: "/admin/requests/rider", label: "Rider Requests", icon: "🏍️" },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      {sidebarOpen && (
        <MobileNav links={mobileLinks} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-[#111827]/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10"
          >
            <FaBars />
          </button>

          <h1 className="text-lg font-extrabold text-orange-400">QuickBite</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
