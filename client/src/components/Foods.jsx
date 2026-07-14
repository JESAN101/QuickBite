// Foods.jsx
import FoodCard from "./FoodCard";

const Foods = ({ foods }) => {
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

      {foods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#EADFC8] bg-[#FFFBF3] py-24 text-center">
          <p className="font-['Fraunces',serif] text-2xl italic text-[#1D1512]/70">
            Nothing matches that search.
          </p>
          <p className="mt-2 text-sm text-[#3A2A20]/50">
            Try a different keyword or clear your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Foods;