const CategoryCard = ({
  category,
  selectedCategory,
  setSelectedCategory,
}) => {
  const active = selectedCategory === category._id;

  return (
    <div
      onClick={() => setSelectedCategory(category._id)}
      className={`cursor-pointer rounded-xl p-6 text-center shadow-md transition
      ${
        active
          ? "bg-orange-500 text-white"
          : "bg-white hover:shadow-lg"
      }`}
    >
      <h3
        className={`text-xl font-semibold ${
          active ? "text-white" : "text-orange-500"
        }`}
      >
        {category.name}
      </h3>
    </div>
  );
};

export default CategoryCard;