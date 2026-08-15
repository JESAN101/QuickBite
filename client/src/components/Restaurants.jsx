// Restaurants.jsx
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getRestaurants } from "../services/restaurantService";
import RestaurantCard from "./RestaurantCard";

const PAGE_SIZE = 6;

const Restaurants = ({ loading }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(restaurants.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedRestaurants = restaurants.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data.restaurants);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRestaurants();
  }, []);

  const RestaurantSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-[#EADFC8] bg-white shadow-[0_8px_20px_-10px_rgba(29,21,18,0.15)]">
      <div className="h-52 animate-pulse bg-[#EADFC8]" />
      <div className="p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#EADFC8]" />
        <div className="mt-2 h-3 w-full animate-pulse rounded bg-[#EADFC8]" />
        <div className="mt-1.5 h-3 w-3/4 animate-pulse rounded bg-[#EADFC8]" />
        <div className="mt-4 space-y-1.5 border-t border-[#EADFC8] pt-3">
          <div className="h-3 w-4/5 animate-pulse rounded bg-[#EADFC8]" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-[#EADFC8]" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl bg-[#FFFBF3] px-6 py-16">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
          Where it comes from
        </span>
        <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          Kitchens worth knowing
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RestaurantSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-lg border border-[#EADFC8] bg-[#FFFBF3] px-4 py-2 text-sm font-semibold text-[#1D1512] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>
              <span className="text-sm font-semibold text-[#3A2A20]/60">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 rounded-lg border border-[#EADFC8] bg-[#FFFBF3] px-4 py-2 text-sm font-semibold text-[#1D1512] transition hover:bg-[#F0A438] hover:text-[#1D1512] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Restaurants;
