// Foods.jsx
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import FoodCard from "./FoodCard";
import Pagination from "./Pagination";

const PAGE_SIZE = 8;

const Foods = ({ foods, loading, clearFilters }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(foods.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedFoods = foods.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [foods]);

  const FoodSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-[#EADFC8]/70 bg-[#FFFBF3] shadow-[0_8px_20px_-10px_rgba(29,21,18,0.2)]">
      <div className="h-52 animate-pulse bg-[#EADFC8]" />
      <div className="p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#EADFC8]" />
        <div className="mt-2 h-3 w-full animate-pulse rounded bg-[#EADFC8]" />
        <div className="mt-1.5 h-3 w-4/5 animate-pulse rounded bg-[#EADFC8]" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-16 animate-pulse rounded bg-[#EADFC8]" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-[#EADFC8]" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
          On the menu
        </span>
        <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
          Popular right now
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <FoodSkeleton key={i} />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EADFC8] bg-[#FFFBF3] py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D64933]/10">
            <FaSearch className="text-2xl text-[#D64933]/60" />
          </div>
          <p className="mt-5 font-['Fraunces',serif] text-2xl italic text-[#1D1512]/70">
            No foods found.
          </p>
          <p className="mt-2 text-sm text-[#3A2A20]/50">
            Nothing matches that search — try a different keyword or clear your
            filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-6 inline-block rounded-lg bg-[#1D1512] px-8 py-3 font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                onChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Foods;
