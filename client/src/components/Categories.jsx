import CategoryCard from "./CategoryCard";

const Categories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <h2 className="text-3xl font-bold mb-8">
        Food Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {/* All */}

        <div
          onClick={() => setSelectedCategory("all")}
          className={`cursor-pointer rounded-xl p-6 text-center shadow-md transition
          ${
            selectedCategory === "all"
              ? "bg-orange-500 text-white"
              : "bg-white hover:shadow-lg"
          }`}
        >
          <h3
            className={`text-xl font-semibold ${
              selectedCategory === "all"
                ? "text-white"
                : "text-orange-500"
            }`}
          >
            All
          </h3>
        </div>

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