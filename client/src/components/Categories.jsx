// Categories.jsx
import CategoryCard from "./CategoryCard";

const Categories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#D64933]">
            Browse
          </span>
          <h2 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
            What are you{" "}
            <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
              craving
            </span>
            ?
          </h2>
        </div>
      </div>

      {/* horizontal scroll row — no visible scrollbar, works on mobile as a swipe strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex shrink-0 items-center gap-3 rounded-full border px-5 py-3 transition ${
            selectedCategory === "all"
              ? "border-[#1D1512] bg-[#1D1512] text-[#F7ECD9]"
              : "border-[#EADFC8] bg-[#FFFBF3] text-[#1D1512] hover:border-[#F0A438]/60"
          }`}
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              selectedCategory === "all"
                ? "bg-[#F0A438] text-[#1D1512]"
                : "bg-[#F0A438]/15 text-[#D64933]"
            }`}
          >
            ✦
          </span>
          <span className="whitespace-nowrap font-['Plus_Jakarta_Sans',sans-serif] font-semibold">
            All
          </span>
        </button>

        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;