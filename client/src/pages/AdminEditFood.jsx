import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import FoodForm from "../components/admin/FoodForm";

import {
  getFoodById,
  updateFood,
} from "../services/foodService";

import { getAllCategories } from "../services/categoryService";
import { getRestaurants } from "../services/restaurantService";

const AdminEditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState({});
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFood();
    fetchCategories();
    fetchRestaurants();
  }, []);

  const fetchFood = async () => {
    try {
      const data = await getFoodById(id);
      setFood(data.food);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data.restaurants);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      const data = await updateFood(id, formData);

      toast.success(data.message);

      navigate("/admin/foods");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to update food."
      );

    } finally {

      setLoading(false);

    }
  };

  if (!food._id) {
    return (
      <div className="text-center py-20 text-xl">
        Loading Food...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        ✏ Edit Food
      </h1>

      <FoodForm
        initialData={food}
        categories={categories}
        restaurants={restaurants}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </div>
  );
};

export default AdminEditFood;