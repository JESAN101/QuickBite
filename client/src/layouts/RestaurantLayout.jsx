import { useState } from "react";
import { FaBars } from "react-icons/fa";
import RestaurantSidebar from "../components/restaurant/RestaurantSidebar";
import MobileNav from "../components/MobileNav";

const mobileLinks = [
  { to: "/", label: "Storefront", icon: "🏠" },
  { to: "/restaurant/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/restaurant/orders", label: "Orders", icon: "📋" },
  { to: "/restaurant/foods", label: "Menu", icon: "🍔" },
  { to: "/restaurant/profile", label: "Restaurant Profile", icon: "🏪" },
];

const RestaurantLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F3EA]">
      <RestaurantSidebar />

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

export default RestaurantLayout;
