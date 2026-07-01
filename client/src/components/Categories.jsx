import { useEffect, useState } from "react";
import { getAllCategories } from "../services/categoryService";
import CategoryCard from "./CategoryCard";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold mb-8">Food Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;