import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import FoodForm from "../components/admin/FoodForm";
import {
  getMyRestaurant,
  createMyFood,
  updateMyFood,
} from "../services/restaurantService";
import { getAllCategories } from "../services/categoryService";
import { getFoodById } from "../services/foodService";

const RestaurantFoodForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [restaurant, setRestaurant] = useState(null);
  const [food, setFood] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [restaurantData, categoriesData] = await Promise.all([
        getMyRestaurant(),
        getAllCategories(),
      ]);

      setRestaurant(restaurantData.restaurant);
      setCategories(categoriesData.categories || []);

      if (isEditing) {
        const foodData = await getFoodById(id);
        setFood(foodData.food);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load form data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      if (isEditing) {
        const data = await updateMyFood(id, formData);
        toast.success(data.message);
      } else {
        const data = await createMyFood(formData);
        toast.success(data.message);
      }

      navigate("/restaurant/foods");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save food."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-full text-xl">
        Loading...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">
        {isEditing ? "✏ Edit Food" : "➕ Add Food"}
      </h1>

      <FoodForm
        initialData={food}
        categories={categories}
        restaurants={[restaurant]}
        fixedRestaurantId={restaurant._id}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </>
  );
};

export default RestaurantFoodForm;
