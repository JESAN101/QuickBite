import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import FoodForm from "../components/admin/FoodForm";

import { createFood } from "../services/foodService";
import { getAllCategories } from "../services/categoryService";
import { getRestaurants } from "../services/restaurantService";

const AdminAddFood = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchRestaurants();
  }, []);

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

      const data = await createFood(formData);

      toast.success(data.message);

      navigate("/admin/foods");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create food."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        ➕ Add Food
      </h1>

      <FoodForm
        categories={categories}
        restaurants={restaurants}
        onSubmit={handleSubmit}
        loading={loading}
      />

    </div>
  );
};

export default AdminAddFood;