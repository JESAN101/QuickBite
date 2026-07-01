import { useEffect, useState } from "react";
import { getAllFoods } from "../services/foodService";
import FoodCard from "./FoodCard";

const Foods = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getAllFoods();
        setFoods(data.foods);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold mb-8">
        Popular Foods
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {foods.map((food) => (
          <FoodCard
            key={food._id}
            food={food}
          />
        ))}
      </div>
    </section>
  );
};

export default Foods;