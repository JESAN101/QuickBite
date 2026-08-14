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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
          {isEditing ? "Edit Food" : "Add Food"}
        </h1>
        <p className="mt-1 text-gray-500">
          {isEditing
            ? "Update the details of this dish"
            : "Add a new dish to your menu"}
        </p>
      </div>

      <FoodForm
        initialData={food}
        categories={categories}
        restaurants={[restaurant]}
        fixedRestaurantId={restaurant._id}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default RestaurantFoodForm;
