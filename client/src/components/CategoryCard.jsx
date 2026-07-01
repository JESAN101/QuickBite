const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
      <h3 className="text-xl font-semibold text-orange-500">
        {category.name}
      </h3>
    </div>
  );
};

export default CategoryCard;